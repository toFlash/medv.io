---
layout: post
title: WebCrypt — сервис онлайн шифрования
date: "2013-10-27 19:20"
visible: true
---

В интернете существует огромное множество инструментов позволяющих вам зашифровать и передать ваше сообщение. Рассмотрим некоторые из них. <br>
<br>
<a href="http://webcrypt.org">webcrypt.org</a> — open source сервис онлайн шифрования прямо в браузере. Код выложен на <a href="https://github.com/elfet/webcrypt">GitHub</a> под GNU GPL и хостится на GitHub Pages. Для шифрования используется замечательная библиотека Стэнфордского Университета <a href="http://bitwiseshiftleft.github.io/sjcl/">SJCL</a>.<br>
<img src="/assets/webcrypt.png" class="center">
<!--more-->
<br>
WebCrypt шифрует сообщение и генерирует ссылку вида <i>webcrypt.org/#здесь_зашифрованное_сообщение</i>. при переходе по этой ссылке, сервер спросит пароль и если он верный — покажет расшифрованное сообщение. На сервер ничего не передаётся и не сохраняется. Сервис работает как на десктопах, так и на мобильниках. <br>
<br>
Если вы не доверяете домену webcrypt.org, вы можете форкнуть проект на GitHub и открыть его уже у себя. Все будет работать точно так-же. Пример: <a href="http://elfet.github.io/webcrypt/">elfet.github.io/webcrypt/</a><br>
<br>
Пример зашифрованного сообщения (пароль: 1234): <br>
<a href="http://webcrypt.org/#3MWeqOpi7zZNhItJWcy3kQ.dJG5p4dWCGc.VYOsn14tw7i68Hl6S2Je+tbznSFo">webcrypt.org/#3MWeqOpi7zZNhItJWcy3kQ.dJG5p4dWCGc.VYOsn14tw7i68Hl6S2Je+tbznSFo</a><br>
<br>
