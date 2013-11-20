---
layout: post
title: Обновление Deployer
published: true
---

Новое обновление для [deployer](https://github.com/elfet/deployer) включает в себя небольшое изменения в архитектуры для упрощения тестирования. Тесты выполнаются на Travis-CI: [![Build Status](https://travis-ci.org/elfet/deployer.png?branch=master)](https://travis-ci.org/elfet/deployer)

А так же новую возможность: групповое подключение к нескольким серверам. 
Если у вас несколько серверов (например тестовый, девелоперский и т.д.) вы можете подключиться ко всем сразу и выполнить деплой на всех.
{% highlight php %}
<?php
task('connect', function () {

	connect('test.server.com', 'user', 'password', 'test');
    connect('test_two.server.com', 'user', 'password', 'test');
    connect('dev.server.com', 'user', 'password', 'dev');
    connect('server.com', 'user', 'password', 'prod');
    
});

task('upload', function () {
	upload('/home/user', '/home/server');
});

task('everythere', 'Deploy everythere', ['connect', 'upload']);
{% endhighlight %}
Теперь выполнив `php deploy everythere` можно загрузить код на все сервера.

Если нужно выполнить какие-то комманды на определённых серверах. Например, только на тестовых серверах `test.server.com` и `test_two.server.com` есть специальная функция `group`.
{% highlight php %}
group('test', function () {
	run('command'); // This command will be executed only on test servers.
});
{% endhighlight %}
Данные функции пока тестируются и недоступны в phar архиве с сайта, но вы можете сами создать phar архив из `master` ветки репозитория выполнив `bin/build`.  
