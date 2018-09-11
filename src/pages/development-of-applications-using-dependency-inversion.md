---
layout: post
lang: ru
title: Разработка архитектуры приложения
date: 2012-11-13
---
<img class="center" alt="" src="/assets/inversion-of-control.png" />

В этой статье я хочу ещё раз поговорить о разработке архитектуры приложения с использованием инверсии зависимости (<a href="http://ru.wikipedia.org/wiki/%D0%98%D0%BD%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F">Inversion of Control</a>).

Я уже писал о библиотеке <a title="Inversion of Control на PHP" href="http://medv.io/inversion-of-control-on-php">IoC</a> и о <a href="http://habrahabr.ru/post/149435/">Modular</a>.
Теперь я пошел ещё дальше и упростил все что только можно и попробую объяснить принципы построения архитектуры. А так же расскажу о новой библиотеке <a href="http://granula.github.com/">Granula</a>.

<!--more-->

Давайте представим, что мы хотим сделать библиотеку для управления пользователями на сайте. Первое что нам понадобится, это место где мы будем хранить информацию о наших пользователях.

Опишем интерфейс хранилища:


~~~ php
<?php
interface StorageInterface
{
    public function set($key, $value);
    public function get($key);
    public function save();
    public function load();
}
~~~

Отлично, теперь нам нужна реализация этого интерфейса. Для начала будем хранить информацию в файлах. Создадим класс FileStorage.

<b>FileStorage.php</b>


~~~ php
<?php
class FileStorage implements StorageInterface
{
    private $file = 'data.json';
    private $data = array();

    public function set($key, $value)
    {
    	$this->data[$key] = $value;
    }

    public function get($key)
    {
    	return $this->data[$key];
    }

    public function save()
    {
 	file_put_contents($this->file, json_encode($this->data));
    }

    public function load()
    {
    	$this->data = json_decode(file_get_contents($this->file));
    }
}
~~~


Теперь создадим класс пользователя


~~~ php
<?php
class User
{
    public function __construct(StorageInterface $storage)
    {
    }
}
~~~

Теперь чтобы создать экземпляр класса User:


~~~ php
<?php
$user = new User(new FileStorage());
~~~

Отлично, а что если какой-нибудь другой программист захочет вместо файлов использовать базу данных? Для этого ему нужно создать класс DatabaseStorage, реализовать интерфейс StorageInterface и заменить все вхождения FileStorage. Но изменение библиотеки сулит проблемы с её обновлениями.

Что бы этого избежать, давайте, введём опции:


~~~ php
<?php
$options = array(
    'StorageInterface' => 'FileStorage',
);

$user = new User($option['StorageInterface']);
~~~


Теперь что бы заменить FileStorage на DatabaseStorage, нужно всего лишь указать это в опциях:


~~~ php
<?php
$options['StorageInterface'] = 'DatabaseStorage';
~~~


То, что мы сейчас назвали опциями, на самом деле является контейнером IoC.

Именно такая архитектура позволяет строить наиболее гибкие приложения и библиотеки.

В своей предыдущей статье я рассказывал о библиотеке Modular, я продолжил развивать её, постарался упростить все для наилучшего понимания. Её основной задачей является обучение применения IoC на практике, создания модульной архитектуры приложения.

Теперь она называется <a href="http://granula.github.com/">Granula</a>.

Любая библиотека может быть модулем для гранулы. Например из компонентов
<a href="http://symfony.com/components">Symfony Components</a> можно создать MVC приложение на подобии самой Symfony.

Каждый модуль гранулы должен быть описан своим классом:


~~~ php
<?php
use Granula\Module;
use Inversion\Container;

class MyModule extends Module
{
    public function build(Container $container)
    {
        // Опишите свой модуль здесь.
    }
}
~~~


Например, описание библиотеки, которую мы создавали в начале статьи будет таким:


~~~ php
<?php
$container['StorageInterface'] = 'FileStorage';
~~~


Можно даже сократить ещё больше:


~~~ php
<?php
$container[] = 'FileStorage';
~~~


Но в таком случае не будет работать ленивая загрузка классов, так как FileStorage будет загружен <a href="https://github.com/granula/inversion">Inversion</a>(библиотекой IoC контейнеров) сразу для определения его интерфейсов.

Пример описания модуля для <b>Symfony Routing Component</b>


~~~ php
<?php
$container['request']
    = $container['Symfony\Component\HttpFoundation\Request']
    = new Factory('Symfony\Component\HttpFoundation\Request', 'createFromGlobals');

$container['Symfony\Component\Config\FileLocator']
    = 'Symfony\Component\Config\FileLocator';

$container['Doctrine\Common\Annotations\Reader']
    = 'Doctrine\Common\Annotations\AnnotationReader';

$container['Symfony\Component\Routing\Loader\AnnotationClassLoader']
    = 'Granula\Router\AnnotatedRouteControllerLoader';

$container['Symfony\Component\Config\Loader\LoaderInterface']
    = 'Symfony\Component\Routing\Loader\AnnotationDirectoryLoader';

$container['request.context']
    = $container['Symfony\Component\Routing\RequestContext']
    = new Service('Symfony\Component\Routing\RequestContext');

$container['router']
    = $container['Symfony\Component\Routing\RouterInterface']
    = new Factory('Granula\Router\RouterFactory');
~~~


Теперь можно создавать экземпляры как в Symfony при помощи контейнера:


~~~ php
<?php
$object = $container->get('Class');
~~~


Либо при момощи фабрики (при использовании trait):


~~~ php
<?php
$user = User::create();
~~~


Затем все необходимые модули указываются в Front Controller:


~~~ php
<?php
class App extends Granula\App
{
    public function register()
    {
        return array(
            new MyModule(),
            // Список модулей
        );
    }
}
~~~


И в файле index.php запускаются:


~~~ php
<?php
$app = new App();
$app->run();
~~~


Я оформил все необходимые модули для создания полноценного MVC приложения. Что бы поиграться с ним используйте <a href="http://getcomposer.org/">Composer</a> для установки:
<pre>composer create-project granula/app www</pre>
В него включены:
<ul>
	<li>Symfony Components</li>
	<li>Twig</li>
	<li>Doctrine ORM</li>
</ul>
<h3>Полезные ссылки</h3>
<ul>
	<li><a href="http://wiki.agiledev.ru/doku.php?id=ooad:manage_dependencies_in_php_code">Управление зависимостями в PHP-коде</a></li>
	<li><a href="http://granula.github.com/">Granula on GitHub</a></li>
	<li><a href="https://github.com/granula/inversion">Inversion</a> — библиотека IoC может быть использована отдельно от гранулы.</li>
</ul>
<i>Contributors are Welcome!</i>
