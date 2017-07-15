---
layout: post
lang: ru
title: Проверка структуры JSON на CoffeeScript
date: 2013-05-10 01:04
---
Возникла задача проверки приходящего JSON от клиента на node.js. Как вы делаете эти проверки? Я реализовал простую функцию:

~~~ coffee
json = 
  key: 'value'
  sub:
    key: 'value'
  extra: 'value'
check = expect json, {key: yes, sub: {key: yes}}
console.log check # true
~~~


<!--more-->
<script src="https://gist.github.com/antonmedv/5550597.js"></script>
