---
layout: post
lang: ru
title: Dot Notation для многомерных массивов
date: 2013-02-05 15:04
comments_id: 118 http://elfet.ru/?p=118
---
Написал небольшой класс позволяющий обращаться к многомерным массивам через "точку":


~~~ php
<?php
$dn = new DotNotation(['bar' => ['baz' => ['foo' => true]]]);

$value = $dn->get('bar.baz.foo');
// Получение $value == true

$dn->set('bar.baz.foo', false);
// Изменение ['foo'=>false]

$dn->add('bar.baz', ['boo'=>true]);
// Добавление ['foo'=>false,'boo'=>true]
~~~

<!--more-->
Исходник опубликован на Gist-е:
<script src="https://gist.github.com/antonmedv/4713488.js"></script>
