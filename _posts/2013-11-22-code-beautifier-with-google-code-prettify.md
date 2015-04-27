---
layout: post
title: Подсветка кода с Google Code Prettify
background: /assets/popka.jpg
---
Для потсветки кода на [StackOverflow](http://stackoverflow.com) используется библиотека [Google Code Prettify](https://code.google.com/p/google-code-prettify/). 
Но у вас она не будет работать точно так же как на StackOverflow. Вы не можете указать комментарий с кодом для уточнения языка: `<!-- language: lang -->` - работать не будет. 
Для того что бы библиотека заработала нужно у тега `pre` указать классы `class="prettyprint lang-scm"`. 

Однако это не удобно если вы используете Markdown. 

    <!-- lang: code -->
    
        you code goes here

Следующий мой скрипт исправляет это неудобство. 
<!--more-->
{% gist 7604590 %}
Данный код ищет все теги `pre` и добавляет в них нужные классы, а так же анализирует, есть ли перед тегом с кодом комментарий `<!-- lang: ... -->` и добавляет нужный класс.
`pre` которые разукрашены при помощи [pygments](http://pygments.org/) и gist-ы  исключаются. 

Для использования подключайте библиотеку и стили отдельно (вместо `run_prettify.js`):

    <link href="google-code-prettify/prettify.css" rel="stylesheet">
    ...
    <script src="google-code-prettify/prettify.js"></script>
    <script src="prettify.js"></script>
