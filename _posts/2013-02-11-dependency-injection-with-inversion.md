---
layout: post
lang: ru
title: Внедрение зависимости c Inversion
date: 2013-02-11 22:35
---
<a href="https://github.com/granula/inversion" target="_blank">Inversion</a> это простой и функциональный контейнер внедрения зависимости для PHP 5.3. Поддерживает сервис-ориентированную архитектуру, ссылки, PRS-0, и <a href="http://getcomposer.org/" target="_blank">Composer</a>. 

Установить можно через packagist.org: <a href="https://packagist.org/packages/granula/inversion" target="_blank">granula/inversion</a> либо <a href="https://github.com/granula/inversion/archive/master.zip">скачав</a> и добавив к PRS-0 совместимому загрузчику. 



~~~ php
<?php
$container = new Inversion\Container();
$container['foo'] = 'My\Class\Foo';
// ...
$foo = $container('foo');
~~~

<!--more-->
В вышеприведённом примере показана базовая функциональность контейнера. Разберем что там происходит.
В первой строчки создаем экземпляр контейнера. Во второй создаем ассоциацию между "foo" и сервисом создающим экземпляр класса "My\Class\Foo". Что по другому можно записать так:


~~~ php
<?php
$container->addService(new Service('My\Class\Foo'), 'foo');
~~~

<div class="alert alert-info">
Имя "foo" идёт вторым, т.к. его вообще можно опустить. Подробнее ниже.
</div>
В третей строчке мы получаем экземпляр объекта. Что по другому можно записать так:


~~~ php
<?php
$foo = $container('foo');
// или
$foo = $container->get('foo');
// или
$foo = $container['foo']->get();
// или
$foo = $container->getService('foo')->get();
~~~

<div class="alert alert-info">
Однако, рекомендую использовать сокращённый вариант, хотя все они допустимы.
</div>

<h2>Описание зависимостей</h2>
По умолчанию когда в контейнер передаётся строка она понимается как имя класса и подставляется в сервис Inversion\Servise.
У данного сервиса есть несколько особенностей и функций.
Первое это отложенная загрузка. Пока вы не будите использовать его, класс не будет загружен.
Второе, вы можете указать зависимость от других сервисов и параметров. Объясню на примере.
Пусть у нас есть класс Bar, который зависит от классов One и Two:


~~~ php
<?php
namespace My\Space;
class One {}
class Two {}
class Bar
{
    public function __construct(One $one, Two $two)
    {
    }
}
~~~

Опишем эту зависимость в Inversion:


~~~ php
<?php
use Inversion\Service;
//...
$container['one'] = 'My\Space\One';
$container['two'] = 'My\Space\Two';
$container['bar'] = new Service('My\Space\Bar', array($container['one'], $container['two']));
~~~

Теперь при вызове "bar", они будут созданы и подставлены в конструктор. На самом деле можно ещё проще. Если вместо "one" и "two" указать их имена классов:


~~~ php
<?php
$container['My\Space\One'] = 'My\Space\One';
$container['My\Space\Two'] = 'My\Space\Two';
$container['My\Space\Bar'] = new Service('My\Space\Bar'); // "new Service" можно опустить
~~~

Это удобный способ описывать зависимости при использовании интерфейсов:


~~~ php
<?php
namespace My\Space;
class One implements OneInterface {}
class Two implements TwoInterface  {}
class Bar implements BarInterface
{
    public function __construct(OneInterface $one, TwoInterface $two)
    {
    }
}
~~~




~~~ php
<?php
$container['My\Space\OneInterface'] = 'My\Space\One';
$container['My\Space\TwoInterface'] = 'My\Space\Two';
$container['My\Space\BarInterface'] = 'My\Space\Bar';
~~~

Вообще имена интерфейсов, можно опустить. Они будут автоматически получены из классов:


~~~ php
<?php
$container[] = 'My\Space\One';
$container[] = 'My\Space\Two';
$container[] = 'My\Space\Bar';
~~~

Вот так вот просто.
<div class="alert alert-info">
Однако, нужно понимать что в таком случае классы будут сразу же загружены чтобы получить список интерфейсов через рефлексию. Поэтому лучше указывать имя интерфейса вручную.
</div>
<h2>Другие виды сервисов</h2>
В библиотеке идет несколько сервисов, однако вы можете создать свой имплементировав <strong>Inversion\ServiceInterface</strong>.
<h3>Closure</h3>
Класс: <strong>Inversion\Service\Closure</strong>
Использование:


~~~ php
<?php
$container['closure'] = function () use ($container) {
    return new My\Class();
};
~~~

Можно также указать зависимости:


~~~ php
<?php
$container['closure'] = function (One $foo, Two $foo) use ($container) {
    return new My\Class();
};
~~~

Так же как и с <strong>Inversion\Service</strong> можно указать их явно:


~~~ php
<?php
$container['closure'] = new Closure(function (One $foo, Two $foo) use ($container) {
    return new My\Class();
}, array($container['one'], $container['two']));
~~~


<h3>Factory</h3>
Класс: <strong>Inversion\Service\Factory</strong>
Использование:


~~~ php
<?php
$container['factory'] = new Factory('My\ClassFactory', 'create');
~~~

Так же можно указать зависимости для конструктора явно третьим параметром.

<h3>Object</h3>
Класс: <strong>Inversion\Service\Object</strong>
Использование:


~~~ php
<?php
$container['object'] = new My\Class();
~~~

или


~~~ php
<?php
$container['object'] = new Object(new My\Class());
~~~


<h3>Prototype</h3>
Класс: <strong>Inversion\Service\Prototype</strong>
Использование:


~~~ php
<?php
$container['prototype'] = new Prototype($object);
~~~

При каждом вызове будет создана новая копия: clone $object.

<h3>Data</h3>
Класс: <strong>Inversion\Service\Data</strong>
Использование:


~~~ php
<?php
$container['data'] = new Data('what you want');
~~~

По умолчанию все массивы преобразуется в Data сервисы.


~~~ php
<?php
$container['data'] = array(...);
~~~

Эквивалентно:


~~~ php
<?php
$container['data'] = new Data(array(...));
~~~

<h2>Ссылки на сервисы</h2>
Inversion поддерживает ссылки. Что бы получить ссылку обратитесь к контейнеру как к массиву:


~~~ php
<?php
$container['foo'] = new Service(...);

$ref = $container['foo']; // Ссылка на сервис.
~~~

Таким образом можно создать алиас к любому сервису:


~~~ php
<?php
$container['My\Class\FooInterface'] = new Service('My\Class\Foo');
$container['foo'] = $container['My\Class\FooInterface'];
//...
$foo = $container('foo');
~~~

Теперь если кто-нибудь перезапишет "My\Class\FooInterface", то "foo" будет по прежнему ссылаться на этот сервис:


~~~ php
<?php
//...
$container['My\Class\FooInterface'] = new Service('Another\FooImpl');
//...
$foo = $container('foo'); // $foo instanseof Another\FooImpl
~~~

Можно даже создавать ссылки на ссылки:


~~~ php
<?php
$container['foo'] = 'My\Class\Foo';
$container['ref'] = $container['foo'];
$container['ref2'] = $container['ref'];
$container['ref3'] = $container['ref2'];
//...
$foo = $container('ref3'); // $foo instanseof My\Class\Foo
$name = $container->getRealName('ref3'); // $name == 'foo'
~~~

<h2>Расширение сервисов</h2>
Например если мы хотим расширить какой-нибудь сервис, то такой способ не подойдет т.к. он перезапишет первый:


~~~ php
<?php
$container['My\Class\FooInterface'] = 'My\Class\Foo';
//...
$container['My\Class\FooInterface'] = function (FooInterface $foo) {
    $foo->extendSome(...);
    return $foo;
};
~~~

В результате будет зацикливание, что бы этого избежать, для расширения используйте следующую функцию:


~~~ php
<?php
$container['My\Class\FooInterface'] = 'My\Class\Foo';
//...
$container->extend('My\Class\FooInterface'], function (FooInterface $foo) {
    return new FooDecorator($foo);
});
~~~

<h2>Тесты</h2>
Библиотека Inversion полностью тестирована. Тесты находятся в отдельном репозитории (<a href="https://github.com/granula/test" title="granula/test" target="_blank">granula/test</a>) вместе с другими тестами <a href="https://github.com/granula" target="_blank">гранулы</a>.

<h2>Как Singleton</h2>
Inversion спроектирована полностью без использования статических методов и синглетонов, однако редко бывает полезно иметь контейнер как синглетон:


~~~ php
<?php
$container = Inversion\Container::getInstanse();
~~~


<h2>Другие реализации</h2>
<ul>
	<li><a href="https://github.com/symfony/DependencyInjection">Symfony Dependency Injection</a> - мощная и тяжёлая библиотека внедрения зависимости. Имеет хорошую документацию.</li>
	<li><a href="http://pimple.sensiolabs.org/">Pimple</a> - простой и очень лёгкий (всего один файл) "контейнер" от создателя Symfony. 
</ul>
<br>
<br>
