---
title: Развертывание приложения с Deployer
date: 2013-07-13
lang: ru
---
Есть множество инструментов развертывания, даже на PHP. Среди них Capistrano (Ruby), Capifony для Symfony (Ruby), Magallanes (PHP), Phing (PHP) и множество других.<br>
Но ни один из них не является достаточно простым и функциональным, как <a href="http://deployer.org" target="_blank">Deployer</a>.<br>
<br>
Я для деплоя своих Symfony приложений использую capifony. Однако, когда возникает необходимость деплоя на share хостинг, с capifony возникает много проблем. Плюс мне не нравится что для деплоя PHP приложений приходиться ставить и настраивать Ruby. Поэтому я решил создать простой инструмент на PHP для развертывания любых приложений. Так родилась идея <a href="http://deployer.org" target="_blank">Deployer</a>.<br>
<!--more--><br>
Deployer представляет из себя всего один phar файл, который нужно подключить в свой скрипт развертывания. Вот пример такого скрипта (deploy.php):<br>


~~~ php
<?php
require 'deployer.phar';

task('prod_server', function () {
    connect('prod.ssh.domain.com', 'user');
});

task('test_server', function () {
    connect('test.ssh.domain.com', 'user');
});

task('upload', function () {
    upload(__DIR__, '/home/domain.com');
});

task('clear', function () {
    run('php bin/clear');
});

task('prod', ['prod_server', 'upload', 'clear']);
task('test', ['test_server', 'upload', 'clear']);

start();
~~~

Теперь можно выполнить команду <em>php deploy.php prod</em> и обновить приложение на сервере.<br>
Может показаться что Deployer написан в процедурном стиле, но это не так. Эти функции всего лишь сахар для уменьшения количества кода необходимого для написания. Каждая из этих функций является алиасом к методу из <em>Deployer\Tool</em>. Используется Context паттерн для доступа к этому классу.<br>
<br>
<br>
Можно не подключать эти функции и тогда использовать методы:<br>


~~~ php
<?php
$tool = new Deployer\Tool();

$tool->task('connect', function () use ($tool) {
    $tool->connect('ssh.domain.com', 'user', 'password');
});
~~~

<br>
Разработка все ещё продолжается. Я приглашаю всех желающих помочь с развитием проекта. Что ещё предстоит сделать:<br>
<ul>
	<li>Добавить поддержку rsync</li>
	<li>Добавить поддержку расширения pecl ss2</li>
</ul>
<br>
Проект выложен на GitHub: <a href="https://github.com/deployphp/deployer" target="_blank">deployphp/deployer</a><br>
А так же есть сайт: <a href="http://deployer.org" target="_blank">deployer.org</a><br>
