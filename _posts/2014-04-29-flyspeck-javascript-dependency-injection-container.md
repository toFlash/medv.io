---
layout: post
lang: ru
title: Flyspeck — простой DI на JavaScript
---
Нужен был простой [контейнер внедрения зависимостей на JavaScript](https://gist.github.com/antonmedv/11349215). Реализовал похожим на [Pimple](http://pimple.sensiolabs.org/).

<!--more-->

Пример использования:

~~~ javascript
// Создаём контейнер.
var c = new Flyspeck();

// Устанавливаем строковое значение.
c.set('name', '...');

// Устанавливаем объект.
c.set('config', {
    server: '...'
});


// Создаём сервис, возвращающий экземпляр пользователя.
// Экземпляр будет создан только при первом обращении.
c.set('user', function (c) {
    return new User(c.get('name'));
});


// Переопределяем пользователя. Первый аргумент- переопределяемый экземпляр, второй - контейнер.
c.extend('user', function (user, c) {
    return new ProxyUser(user);
});

// Ещё пример:
c.set('app', function (c) {
    return new Application(c.get('config'), c.get('user'));
});

// Создавать что-то новое нет необходимости, можно работать с объектом.
c.extend('app', function (app, c) {
    app.setSomething();
    return app;
});

// Получаем все сразу.
var app = c.get('app');
~~~
