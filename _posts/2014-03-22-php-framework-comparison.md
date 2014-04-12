---
layout: post
title: Правильное сравнение PHP фреймворков
---
В
[интернете](http://briananglin.me/2014/01/best-php-frameworks-2014/)
[существует](http://www.sitepoint.com/best-php-frameworks-2014/)
[огромное](http://www.techempower.com/benchmarks/)
[количество](http://www.dev-metal.com/which-php-framework-to-learn-in-2014-phalcon-by-far-the-fasted-ever/)
[различных](http://1st2tech.com/blog/2014/01/07/performance-benchmark-of-popular-php-frameworks/)
[сравнений](http://codegeekz.com/best-php-frameworks-2014/)
[фреймворков](http://www.tisindia.com/blog/7-best-php-frameworks-2014/).

Все они сравнивают фреймворке по скорости, памяти, популярности.
Однако это не правильное сравнение, ведь не это самое важное при выборе фреймворка.
Гораздо важнее это то какую структуру приложения предлагает фреймворк, какие функции берёт на себя и
насколько качественно написан сам фреймворк.

Одной из мер качества кода может быть [цикломатическая сложность](http://ru.wikipedia.org/wiki/%D0%A6%D0%B8%D0%BA%D0%BB%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%BB%D0%BE%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D1%8C).
Я решил сравнить популярные фреймворки с помощью этой меры. А так же посмотреть развитие этих фреймворков в динамике.

<img src="/assets/php-framework-comparison/plot.png" class="center">

На графике отображено изменение отношения цикломатической сложности к количеству методов для всех релизов соответствующих фреймворков.
Для подсчёта цикломатической сложности воспользовался замечательной библиотекой Себастьяна Бергмана
[phploc](https://github.com/sebastianbergmann/phploc).

На графике видно, что Symfony слегка выигрывает у ZF по качеству. Laravel же скачет между ними, но в общем тоже держится на хорошем уровне. CakePHP стал гораздо лучше, чем когда он появился, однако похоже нашёл свою асимптоту. Yii же пока не показыват хороших результатов. 

<!--more-->

### Ссылки

* [PHP Mess Detector](http://phpmd.org/)
* [Development by the numbers by Anthony Ferrara](http://www.slideshare.net/ircmaxell/development-by-the-numbers)
* [How Not To Kill Your Testability Using Statics](http://kunststube.net/static/)
