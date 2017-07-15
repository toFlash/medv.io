---
layout: post
lang: ru
title: Управление GIT-ом через веб-консоль на PHP
date: 2012-07-17 15:24
comments_id: 42 http://elfet.ru/?p=42
---
Я люблю git. Я использую его во всех своих проектах. Поэтому я решил сделать веб-консоль для управления git-ом
на PHP.

<img class="center" alt="" src="/assets/web-console.png" width="742" height="510"/>
<br>
<!--more-->
<br>

Реализовать её я решил в виде одного файла: <a
        href="https://github.com/antonmedv/console/blob/master/console.php">git.php</a>.
<br>

Достаточно всего лишь бросить его в папку репозитория, открыть его в браузере и можно управлять git-ом. В
консоли реализована история команд в localStorage и в планах сделать автокомплит. Так же можно выполнять команды
напрямую вызывая «git.php?command». Это полезно, например, для автодеплоя.

Но есть, конечно же, ограничения. Во-первых должна быть разрешена функция proc_open() и папка .git должна быть
того же пользователя(www-user).
<br>
<br>

Свою консольку я смог запустить даже на шаред хостинге от masterhost-а.

<br>
<br>

Код выложен на github: <a href="https://github.com/antonmedv/console">github.com/antonmedv/php-git</a>
