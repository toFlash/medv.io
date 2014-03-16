---
layout: post
title: Создание чата на PHP
---

Пять лет назад я написал похожую [статью](http://elfet.ru/create-php-ajax-chat/),
однако с того времени PHP и браузеры шагнули далеко вперёд.
В этой статье я расскажу о лучших практиках создания ПО на PHP.

### Что понадобится?

* PHP 5.5.x
* [Composer](https://getcomposer.org) - менеджер зависимостей.

<div class="info">
Кстати, если вы работаете на Windows, то вам для разработки на PHP не нужно ничего больше (никаких "денверов").
PHP имеет встроенный сервер, который отлично подходит для разработки.
</div>

<!--more-->

### Архитектура

В современном ПО на PHP применятся единая точка входа. Все запросы к серверу перенаправляются к единственному скрипту PHP,
который разбирает запрос и определяет что делать дальше.

Создадим файл `app.php` это и будет нашей единой точкой входа. Если вы используете сервер Apache,
то его нужно сконфигурировать так, что бы он перенаправлял все запросы к нашему скипту.
Это можно сделать при помощи файла `.htaccess`:

```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^(.*)$ app.php [QSA,L]
</IfModule>
```

Как настроить другие серверы (в том числе и встроенный в PHP) можно почитать [тут](http://silex.sensiolabs.org/doc/web_servers.html).

Наш чат будет состоять из трех частей: приложения на [Silex](http://silex.sensiolabs.org/) и демона на [Ratchet](http://socketo.me/)
и клиента на JavaScript.

### Приложение

Начнем с инициализации. Выполните комманду `composer init` в терминале. Composer задаст вам несколько вопросов, после чего сгенерирует
файл `composer.json` в котором и будут описыватся наши зависимости.
Так же нам понадобятся следующие компоненты:

```
composer require silex/silex:1.2.* facebook/php-sdk:3.2.* cboden/ratchet:0.3.*
```

Все PHP файлы демона и приложения мы будем хранить в папке `src`. Настроим автозагрузку по `PSR-4`.
В файле `composer.json` добавьте следующее:

```
    "autoload": {
        "psr-4": {
            "Elfet\\Chat\\": "src/"
        }
    }
```
и выполните `composer update`.

В файле `app.php` подключите файл `autoload.php` сгенерированный composer-ом:


<!-- lang: php -->
```
require __DIR__ . '/../vendor/autoload.php';
```

Создадим класс нашего приложения src/Application.php и добавим в `app.php` следующее:

<!-- lang: php -->
```
$app = new Elfet\Chat\Application(include __DIR__ . '/../config.php');

$app->get('/', function () use ($app) {
    return $app->render('chat.phtml', [
        'user' => $app['user'],
    ]);
})->bind('index');

$app->run();
```

Создаём экземпляр нашего приложения и передаём в него массив с настройками нашего приложения (Оператор include возвращает то что возвращает файл при помощи оператора return).
При помощи функции `$app->get()` описываем то что вернёт приложение при обращении к адресу `/`. Мы вернём код клиента чата `chat.phtml`.
Мы не будем использовать никаких шаблонизаторов. Вместо этого мы создадим следующий метод `$app->render()`.

<!-- lang: php -->
```
class Application extends \Silex\Application
{
    public function render($viewPath, $params = [])
    {
        extract($params);

        ob_start();
        include $viewPath;
        $content = ob_get_clean();

        return new Response($content);
    }
}
```
Метод принимает путь к файлу и параметры. Файл будет подключен и результат его работы будет передан в экземпляре класса `Response`.


### Аутентификация

Для входа в чат мы не будем создавать никаких специальных форм и баз пользователей. Воспользуемся аутентификацией через
Facebook. Для этого вам нужно зарегестировать свое приложение на [developers.facebook.com](https://developers.facebook.com)
и получить `app_id` и `secret`.

<img src="/assets/create-chat-on-php/login.png" class="center">

Подключите Facebook PHP-SDK:

```
composer require facebook/php-sdk:2.3.*
```

<!-- lang: php -->
```
$app['facebook'] = $app->share(function () use ($app) {
    return new \Facebook([
        'appId' => 'Facebook app_id',
        'secret' => 'Facebook secret',
        'allowSignedRequest' => false
    ]);
});
```

Информацию о пользователе мы будем хранить в сессии, так как эту же сессию мы будем использовать в демоне мы будем хранить
её в [Memcached](http://memcached.org/).

<!-- lang: php -->
```
// Включаем механизм сессия Silex
$app->register(new SessionServiceProvider());

// Перепопереляем способ сохранения сессии в memcached
$app['session.storage.handler'] = $app->share(function ($app) {
    $memcache = new \Memcache();
    $memcache->connect('localhost', 11211);
    return new MemcacheSessionHandler($memcache);
});
```

Для получения пользователя из сессии создадми следующую функцию.

<!-- lang: php -->
```
$app['user'] = function () use ($app) {
    return $app['session']->get('user');
};
```

Мы будем проверять авторизацию перед каждым запросом от браузера к нашему приложению

<!-- lang: php -->
```
$app->before(function ($request) use ($app) {
    $user = $app['user'];

    // Если пользователья нет, по проводим запрашиваем данные о нем из Facebook.
    if (null === $user) {
        $facebook = $app['facebook'];

        // Для получения данных от Facebook мы будем использовать FQL.
        $result = $facebook->api(array(
            'method' => 'fql.query',
            'query' => 'SELECT uid, name, pic_square, profile_url FROM user WHERE uid = me()',
        ));

        // Если Facebook вернул нам данные о пользователе запишим их в сессию.
        if (!empty($result)) {
            $app['session']->set('user', $result[0]);
            return;
        }

        // Иначе выводим страницу с кномпой входа.
        return $app->render('login.phtml', [
            'loginUrl' => $facebook->getLoginUrl(),
        ]);
    }
});
```
Теперь при обращении к любому пути `$app->get('/', ...)` будет проверена авторизация.

### Демон

Создадим файл `server.php` и инициализируем в нём Event Loop:

<!-- lang: php -->
```
$server = IoServer::factory(..., 8080, '127.0.0.1');
$server->run();
```

Так же нам нужен Http Server и WebSocket Server:

<!-- lang: php -->
```
$websocket = new WsServer(...);
$http = new HttpServer($websocket);
$server = IoServer::factory($http, 8080, '127.0.0.1');
$server->run();
```

Ratchet предостовляет удобный механизм для исползования Symfony Session Component.

<!-- lang: php -->
```
$memcache = new Memcache;
$memcache->connect('localhost', 11211);
$sesionHandler = new MemcacheSessionHandler($memcache);

// Наш код чата будет содержится в классе Server.
$chat = new Server();

$sessionProvider = new SessionProvider($server, $sessionHandler);
$websocket = new WsServer($sessionProvide);
//...
```

Теперь создадим класс Server. Для работы с Ratchet мы должны имплементировать MessageComponentInterface интерфейс.

<!-- lang: php -->
```
class Server implements MessageComponentInterface
{
    private $clients;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    //...
}
```

При подключении пользователя получаем информацию о пользователе из сессии и заносим пользователя в список подключенных клиентов.

<!-- lang: php -->
```
    public function onOpen(ConnectionInterface $conn)
    {
        $user = $conn->Session->get('user');
        $conn->user = $user;
        $this->clients->attach($conn);
    }
```

При отключении пользователя удаляем его из списка клиентов:

<!-- lang: php -->
```
    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
    }
```

При получении сообщения от одного клиента рассылаем его всем.

<!-- lang: php -->
```
    public function onMessage(ConnectionInterface $from, $message)
    {
        $message = [
            'text' => $message,
            'user' => $from->user,
        ];

        foreach ($this->clients as $client) {
            $client->send(json_encode([$message]));
        }
    }
```

Теперь мы можем запустить нашего демона коммандой:

```
php server.php
```

### Клиент

Создадим файл chat.phtml в котором опишем структуру нашего чата, подключим библиотеки: jQuery и Handlebars (будем использовать для шаблона сообщения).

```
<script id="message" type="text/x-handlebars-template">
    <div class="message">
        <a class="user" href="{{user.profile_url}}"><img src="{{user.pic_square}}" title="{{user.name}}"></a>
        <div class="text">{{text}}</div>
    </div>
</script>
```

Так же подключим client.js

<!-- lang: js -->
```
var conn, text, template;

function connect(server, port) {
    // Подключаемся к нашему демону.
    conn = new WebSocket('ws://' + server + ':' + port);

    // Компилируем шаблон сообщения.
    template = Handlebars.compile($('#message').html());

    // При получении сообщений вставляем из на страницу.
    conn.onmessage = function (e) {
        var messages = JSON.parse(e.data);

        for (var i in messages) {
            $('.container').append(template(messages[i]));

            // Прокручиваем страницу вниз.
            scroll();
        }
    };
}

// Функция для прокрутки страницы вниз.
function scroll() {
    var doc = $(document);
    doc.scrollTop(doc.height());
}

// Когда страница будем загружена, вешаем обработчик отправки формы.
$(function () {
    text = $('#text');
    $('form').submit(function (event) {
        // Когда нажат Enter, отправляем сообщение.
        conn.send(text.val());

        // Очищаем поле ввода.
        text.val('');

        // Отменяем отправку формы.
        return false;
    });
    scroll();
});
```

Полностью готовый чат вы можете скачать тут. Он немного отличается от этого. В нём реализованны дополнительные функции:

* Хранение истории сообщений
* Вставка изображений
* Разделение сообщений на свои/чужие
* Мобильная версия чата
* Вынесенные настройки


### Ссылки

* [Silex](http://silex.sensiolabs.org/)
* [ReactPHP](http://reactphp.org/)
* [Ratchet](http://socketo.me/)
* [Handlebars](http://handlebarsjs.com/)