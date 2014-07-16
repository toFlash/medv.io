---
layout: post
title: Inversion of Control на PHP
date: 2011-11-07 13:40
---
<!--more-->
<a href="http://habrahabr.ru/blogs/net/131993/">Inversion of Control (IoC) контейнеры</a> — это удобный способ организации внедрения зависимости получивший широкое применение в мире Java.

    Данная <a href="https://github.com/Elfet/IoC">библиотека</a> позволяет использовать IoC контейнеры в PHP.<br>
    <br>
    <a name="habracut"></a><br>
    <br>
    Для примера опишем несколько интерфейсов:<br>
    <br>
    <pre><code data-language="php">interface First {
    public function first();
}

interface Second {
    public function second();
}

interface Third {
    public function third();
}</code></pre><br>
    <br>
    И их реализаций:<br>
    <br>
    <pre><code data-language="php">class Foo implements First {
    public function first() { /* ... */
    }
}

class Boo implements Second {
    public function __construct(First $first) {
    /* ... */ }

    public function second() { /* ... */
    }
}

class Woo implements Third {
    public function __construct(First $first, Second $first) { /* ... */ }

    public function third() { /* ... */
    }
}</code></pre><br>
    <br>
    Теперь воспользуемся IoC контейнером для описания зависимостей:<br>
    <br>
    <pre><code data-language="php">$ioc = IoC\Container::getInstance();

$ioc-&gt;register(&#039;Foo&#039;);
$ioc-&gt;register(&#039;Boo&#039;);
$ioc-&gt;register(&#039;Woo&#039;);</code></pre><br>
    <br>
    Зависимости назначаются автоматически. Класс Foo реализует интерфейс First: в IoC контейнере First ссылается на Foo.
    <br>
    <br>
    Опишем класс-менеджер зависящий от этих интерфейсов:<br>
    <br>
    <pre><code data-language="php">class Manager
{
    use IoC\Creatable;

    public function __construct(First $first, Second $second, Third $third)
    {
        /* ... */
    }
}</code></pre><br>
    <br>
    Создадим экземпляр менеджера:<br>
    <br>
    <pre><code data-language="php">$manager = Manager::create();</code></pre><br>
    <br>
    IoC сам создаст экземпляры нужных классов для конструктора менеджера. <br>
    <br>
    Если нет PHP 5.4, то можно не использовать примеси:<br>
    <br>
    <pre><code data-language="php">class Manager
{
    public static function create()
    {
        return \IoC\Factory::create(get_called_class(), func_get_args());
    }

    /* ... */
}</code></pre><br>
    <br>
    Так же в конструкторе менеджера можно описать дополнительные параметры:<br>
    <br>
    <pre><code data-language="php">class Manager
{
    use IoC\Creatable;

    public function __construct(First $first, Second $second, Third $third, $value, $anotherValue = &#039;default&#039;)
    {
        /* ... */
    }
}</code></pre><br>
    <br>
    И по прежнему пользоваться IoC:<br>
    <br>
    <pre><code data-language="php">$manager = Manager::create(&#039;value&#039;, &#039;another value&#039;);
$managerWithDefault = Manager::create(&#039;value&#039;);</code></pre><br>
    <br>
    В библиотеке реализованы три типа зависимости: Reference, Lazy и Prototype.<br>
    <br>
    Ленивая загрузка:<br>
    <pre><code data-language="php">$ioc-&gt;register(&#039;Foo&#039;);</code></pre><br>
    Экземпляр класса Foo будет создан только при вызове функции create()<br>
    <br>
    В данном случае, везде будет использован один экземпляр класса Foo:<br>
    <pre><code data-language="php">$ioc-&gt;register(new Foo());</code></pre><br>
    <br>
    Если класс построен на <a href="http://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%BE%D1%82%D0%BE%D1%82%D0%B8%D0%BF_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F)">шаблоне прототип</a> (новые объекты создаются при помощи clone), то полезной будет следующая функция:<br>
    <pre><code data-language="php">$ioc-&gt;prototype(new Foo());</code></pre><br>
    При каждом вызове create() будет создан новый экземпляр Foo при помощи clone.<br>
    <br>
    Так же можно добавлять свои ассоциации:<br>
    <pre><code data-language="php">$ioc-&gt;assoc(new MyAssoc(&#039;Foo&#039;));</code></pre><br>
    <br>
    IoC позволяет вручную настроит соответствие реализации интерфейсу:<br>
    <br>
    <pre><code data-language="php">$ioc-&gt;register(&#039;Foo&#039;, &#039;First&#039;);

$ioc-&gt;register(new Foo(), &#039;Second&#039;);

$ioc-&gt;prototype(&#039;Foo&#039;, &#039;First&#039;);</code></pre><br>
    <br>
    Множественная ассоциация. В случае если класс FooBoo реализует сразу два интерфейса First, Second:<br>
    <br>
    <pre><code data-language="php">$ioc-&gt;register(&#039;FooBoo&#039;, array(&#039;First&#039;, &#039;Second&#039;));</code></pre><br>
    <br>
    Так же можно добавить ассоциации для классов:<br>
    <br>
    <pre><code data-language="php">// Если Boo extends Foo
$ioc-&gt;register(&#039;Boo&#039;, &#039;Foo&#039;);</code></pre><br>
    <br>
    <a href="https://github.com/Elfet/IoC">Проект на GitHub</a><br>
    <br>
    <h3>Другие реализации IoC для PHP</h3><br>
    <a href="https://fisheye.codehaus.org/browse/picocontainer/php/picocontainer/trunk/container">PHP порт Pico Container</a><br>
    <a href="http://phemto.sourceforge.net/">Phemto</a><br>
    <a href="https://github.com/jamolkhon/Sharbat">Sharbat</a>
    <br>
