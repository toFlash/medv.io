---
layout: post
title: PurePHP — NoSQL база данных на чистом PHP
---

На PHP создано куча разных штук: [веб-сервер](http://nanoweb.si.kz/), [контроллер квадрокоптера](https://github.com/jolicode/php-ar-drone) и даже [GUI](http://gtk.php.net/). 
Я решил пополнить список странных штук и создать NoSQL базу данных на чистом PHP.

Готовый результат выложен на GitHub: [elfet/purephp](https://github.com/elfet/purephp)

Посмотрим, что умеет эта "база данных"...

<!--more-->

Для установки скачайте [phar архив](https://github.com/elfet/purephp/releases/tag/v1.1.0) и выполните следующие команды:

~~~
mv pure.phar /usr/local/bin/pure
chmod +x /usr/local/bin/pure
~~~

<div class="info">
Кстати, phar архив умеет сам обновляться до новой версии. Вам нужно всего лишь выполнить команду <code>pure update</code>.
</div>

Теперь вы можете запустить демона командой `pure start`. 
По умолчанию PurePHP запускается на 1337 порту и 127.0.0.1 хосте. 
Вы можете указать другой порт и хост с помощью соответствующих опций `pure start --port="..." --host="..."`.

Для установки клиента PurePHP воспользуйтесь composer-ом: 

~~~
composer require elfet/pure:0.*
~~~

Теперь мы можем подключиться к PurePHP из нашего приложения:


~~~ php
$pure = new Pure\Client($port, $host);
~~~

В PurePHP реализовано несколько видов хранилищ данных. Все они расположены в папке [src/Storage](https://github.com/elfet/purephp/tree/master/src/Storage).
На клиенте вы можете работать с ними так, как будто бы вы работаете с ними напрямую. Для создания экземпляра хранилища используйте соответствующую функцию. 

Примеры:

Создаём хранилище типа `ArrayStorage`, называем его 'collection' и помещаем в него массив `['hello' => 'world']`:

~~~ php
$pure->of('collection')->push(['hello' => 'wolrd']);
~~~

Создаём хранилище типа `QueueStorage`, называем его 'collection' и помещаем в него строку `'wow!'`:

~~~ php
$pure->queue('collection')->push('wow!');
~~~

Получаем хранилище 'collection' и получаем верхний элемент очереди:

~~~ php
$wow = $pure->stack('collection')->pop(); // Вернёт 'wow!'
~~~

Сейчас реализованы следующие хранилища:

* ArrayStorage `->of` - простой массив.
* StackStorage `->stack` - стэк SplStack.
* QueueStorage `->queue` - очередь SqlQueue.
* PriorityQueueStorage `->priority` - очередь с приоритетом SplPriorityQueue.
* LifetimeStorage `->lifetime` - массив с временем жизни. Указывается количество секунд, через которое данный элемент будет удалён.

<div class="info">
Для доступа к коллекциям можно воспользоваться магичискими методами:
<!-- lang: php -->
<pre><code>$pure->of->collection->push();
$pure->stack->collection->pop();
//...</code></pre>
</div>

Также у всех хранилищ реализована особая функция `filter`. Она позволяет отобрать только нужные элементы:

~~~ php
$result = $pure->queue('collection')->filter('value > 100');
~~~

Также можно в ней задать лимит количества искомых элементов:

~~~ php
$result = $pure->prioriry('collection')->filter('value > 100', 10);
~~~

Выражения для функции `filter` пишутся на [Expression Language](http://symfony.com/doc/current/components/expression_language/index.html) и кешируются на сервере. В выражениях доступны две переменные: value и key.

~~~ php
$result = $pure->of('collection')->filter('value["year"] > 2000 and value["name"] matches "/term/"');
~~~

## Консоль
Попробовать PurePHP можно и прямо из консоли. Запустите сервер PurePHP и в другом окне консоли наберите команду `pure client`. 
Тут вы можете попробовать все функции PurePHP. Например:

~~~
$ pure client
Welcome to Console Client for PurePHP server.
> pure.queue.collection.push('hello')
NULL
> pure.queue.collection.push('world')
NULL
> pure.queue.collection.pop() ~ ' ' ~ pure.queue.collection.pop()
string(11) "hello world"
~~~

Для выхода из режима консоли наберите команду `exit`.

Ради интереса я сравнил скорость работы PurePHP с Memcached. Естественно PurePHP проигрывает Memcached в 5 раз. =) 
Однако у меня не было цели создать что-либо быстрее или лучше, моя цель была сделать это на PHP, и я сделал это. 
По-моему, получилось очень забавно. Однако практического применения PurePHP пока нет. =)
