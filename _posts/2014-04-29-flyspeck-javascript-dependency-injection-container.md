---
layout: post
title: Flyspeck &mdash; простой DI на JavaScript
---
Нужен был простой контейнер внедрения зависимостей на JavaScript. Реализовал похожим на [Pimple](http://pimple.sensiolabs.org/).

<script src="https://gist.github.com/elfet/11349215.js"></script>

Пример использования:

<!-- lang: js -->
```
// Создаём контейнер.
var c = new Flyspeck();

// Устанавливаем строковое значение.
c.set('name', '...');

// Устанавливаем объект.
c.set('config', {
    server: '...'
});


// Создаём сервис возвращающий экземпляр пользователя.
// Экземпляр будет создан только при первом обращении
// при помощи c.get('user'), при остальных будет возвращён этот же экземпляр.
c.set('user', function (c) {
    return new User(c.get('name'));
});


// Переопределяем пользователя. Первый аргумент переопределяемый экземпляр,
// второй - контейнер.
c.extend('user', function (user, c) {
    return new ProxyUser(user);
});


c.set('app', function (c) {
    return new Application(c.get('config'), c.get('user'));
});

c.extend('app', function (app, c) {
    app.setSomething();
    return app;
});

var app = c.get('app');
```
