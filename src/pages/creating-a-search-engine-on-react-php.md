---
title: Создание поисковика на React PHP
date: 2013-07-07
lang: ru
---
В этот статье я расскажу как самому создать поисковую систему по интернету на React PHP. Целью статьи является не создание полноценного поисковика, а разбор принципов построения такой системы на React PHP.

<a href="/assets/react-php.png">
<img src="/assets/react-php.png" alt="" class="center" width="500" height="371">
</a>
Нетерпеливые могут сразу посмотреть готовый проект на <a href="https://github.com/antonmedv/homer" target="_blank">GitHub</a>.
<!--more-->
Наша система будет состоять из двух частей: фронтенд и демон. Фронтенд будет отдавать пользователю интерфейс и принимать запросы. Демон будет загружать ссылки добавленные пользователем, индексировать их, находить новые ссылки и индексировать их и так далее.
Для поиска мы воспользуемся полнотекстовым поиском базы данных SQLite. Для начала этого нам будет достаточно.
Начнём мы с создания демона.

<h3>Демон</h3>
Наш демон будет написан на <a href="http://reactphp.org/" target="_blank">React PHP</a>. Для этого нужно понимать как он работает.
В основу этого фреймворнка положен <a href="http://en.wikipedia.org/wiki/Event_loop" target="_blank">event loop</a>. C него и начнём.


~~~ php
<?php
$loop = React\EventLoop\Factory::create();
// наш код идёт тут
$loop->run();
~~~

ReactPHP идёт вместе с набором замечательных компонентов. Среди них <a href="https://github.com/reactphp/react/tree/master/src/React/HttpClient" target="_blank">HttpClient</a>, которым мы воспользуемся для параллельной загрузки страниц. Для его работы нам нужен DNS ресолвер, который будет преобразовывать доменные имена в IP адреса. Воспользуемся <a href="http://ru.wikipedia.org/wiki/Google_Public_DNS" target="_blank">Google Public DNS</a> (ip: 8.8.8.8)


~~~ php
<?php
$dnsResolverFactory = new React\Dns\Resolver\Factory();
$dnsResolver = $dnsResolverFactory->createCached('8.8.8.8', $loop);

$factory = new React\HttpClient\Factory();
$client = $factory->create($loop, $dnsResolver);
~~~

Теперь создадим класс для загрузки страниц <a href="https://github.com/antonmedv/homer/blob/master/src/Homer/Loader.php" target="_blank">Loader</a>. А в нём метод для загрузки url:


~~~ php
<?php
    public function load($url, $deep)
    {
        // Проверяем действительно ли на передали URL для загрузки.
        $url = filter_var($url, FILTER_VALIDATE_URL);

        // Если нет, то выходим.
        if (false === $url) {
            return false;
        }

        // Сохраняем url, и глубину поиска.
        $this->url = $url;
        $this->deep = $deep;

        // И самое главное, создаём GET запрос.
        $this->request = $this->client->request('GET', $url);

        // Когда наступит событие response, вызываем метод onResponse.
        // Метод onResponse получит в качества аргумента Response класс.
        $this->request->on('response', array($this, 'onResponse'));

        // Завершаем запрос.
        $this->request->end();

        return true;
    }
~~~

Теперь создадим в цикле $loop переодический таймер, который будет вызываться с определённой интенсивностью.


~~~ php
<?php
$loop->addPeriodicTimer(1, function ($timer) use ($client) {
    $loader = new Loader($client);
    $loader->load($url, $deep);
});
~~~

Однако у нас неоткуда взять $url и $deep переменные. Для их получения сделаем простую очередь сообщений <a href="https://github.com/antonmedv/homer/blob/master/src/Homer/Queue.php" target="_blank">Queue</a>. Либо можно использовать какую-нибудь <a href="http://gearman.org/" target="_blank">готовую</a>.


~~~ php
<?php
    while ($row = $queue->pop()) {
        $loader = new Homer\Loader($client);
        $loader->load($row['url'], $row['deep']);
    }
~~~

Теперь опишем метод onResponse где будем получать данные из Response класса. По событию data приходит часть ответа сервера, можно самому собрать все кусочки воедино, однако в React PHP есть способ получше. Это promise и <a href="https://github.com/reactphp/react/blob/master/src/React/Stream/BufferedSink.php" target="_blank">BufferedSink</a>.


~~~ php
<?php
    public function onResponse(React\HttpClient\Response $response)
    {
        $this->response = $response;
        BufferedSink::createPromise($response)->then(array($this, 'onLoad'));
    }
~~~

Теперь в onLoad методе мы получим весь ответ сервера, когда он будет полностью загружен. В onLoad методе для разбора полученого кода страницы будем использовать <a href="http://symfony.com/doc/current/components/dom_crawler.html" target="_blank">DomCrawler</a> и все найденные ссылки будем добавлять в очередь для последующей загрузки.


~~~ php
<?php
    public function onLoad($body)
    {
        // Получаем заголоски ответа
        $headers = $this->response->getHeaders();

        // Если есть редирект добавляем его в загрузку.
        if (isset($headers['Location'])) {
            if ($this->deep > 0) {
                $this->pushQueue($headers['Location'], $this->deep - 1);
            }

            return;
        }

        // Создаём DomCrawler.
        $html = new Crawler();
        $html->addHtmlContent($body);

        // Индексируем содержание документа, реализация Search рассмотрим позже.
        $this->search->index($this->url, $html);

        // Если возможно ищем все ссылки и добавляем их в очередь.
        if ($this->deep > 0) {
            $html->filter('a')->each(function (Crawler $link) {
                 $this->queue->push($link->attr('href'), $this->deep - 1);
            });
        }
    }
~~~

Реализацию класса <a href="https://github.com/antonmedv/homer/blob/master/src/Homer/Search.php" target="_blank">Search</a> пока оставим самую простую, ищем теги title и body и добавляем их в базу данных для полнотекстового поиска.

<h3>FrontEnd</h3>
Фронтенд мы реализуем на Silex. Создадим файл index.php


~~~ php
<?php
$app = new Silex\Application();
// наш код идёт тут.
$app->run();
~~~

У нашего фронтенда будет две функции: поиск по базе данных и добавление новых ссылок в очередь.


~~~ php
<?php
$app->get('/', function () use ($app) {
    $search = $app['request']->get('search', false);

    // Ищем использую метод Search::search.
    $result = $app['search']->search($search, 20);

    ob_start();
    include 'view/index.phtml';
    return ob_get_clean();
})->bind('search');
~~~

В файле <a href="https://github.com/antonmedv/homer/blob/master/view/index.phtml" target="_blank">index.phtml</a> мы создадим форму для поиска и форму для добавления ссылок, это всё что нам нужно.


~~~ php
<?php
$app->post('/add', function () use ($app) {
    $url = filter_var($app['request']->get('url', ''), FILTER_VALIDATE_URL);
    if ($url) {
        // Добавляем ссылку в очередь с глубиной поиска 3.
        $app['queue']->push($url, 3);
    }
    return $app->redirect($app->url('search'));
})->bind('add');
~~~


Так же я сделал статистику по использованию памяти демоном. Пример:
<img src="/assets/react-stat.png" width="527" height="238" class="center">
На своём ноутбуке я запускал демона на целый день индексировать википедию и следил за расходом памяти. PHP успешно справляется с освобождением, главное что бы небыло циклических ссылок. Утечек памяти обнаружено не было. Максимальное использование памяти было около 100 МБ, но всегда спускалось на уровень 20 МБ. База данных за время работы скрипта выросла на 20 ГБ.


Если статья будет интересна вам, то в следующих частях я расскажу о том как использовать в нашем поисковике <a href="http://sphinxsearch.com/" target="_blank">Sphinx</a>, и как применить <a href="http://en.wikipedia.org/wiki/MapReduce" target="_blank">MapReduce</a> для подсчета ссылок.
