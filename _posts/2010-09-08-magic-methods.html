---
layout: post
title: Вложенные массивы и Magic Methods
date: 2010-09-08 12:00
---
<!--more-->
Наверное всем известно про волшебные(магические) методы в PHP, а конкретно __get и __set методы. Однако есть
    неприятная особенность, если нужно изменить значение вложенного массива. Для решение этой проблемы есть простое
    и элегантное решение. <br>
    <br>
    Рассмотри такой вот класс:<br>
    <blockquote><font color="#000000">class</font>&nbsp;MyClass&nbsp;<font color="#009900">{</font>
&nbsp;&nbsp;&nbsp;&nbsp;protected&nbsp;<font color="#000088">$data</font>&nbsp;<font color="#339933">=</font>&nbsp;<font color="#990000">array</font><font color="#009900">(</font><font color="#0000ff">'some'</font>&nbsp;<font color="#339933">=&gt;</font>&nbsp;<font color="#990000">array</font><font color="#009900">(</font><font color="#0000ff">'sub'</font>&nbsp;<font color="#339933">=&gt;</font>&nbsp;<font color="#0000ff">'data'</font><font color="#009900">)</font><font color="#009900">)</font><font color="#339933">;</font><br>
        &nbsp;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">public</font>&nbsp;<font color="#000000">function</font>&nbsp;__set<font color="#009900">(</font><font color="#000088">$name</font><font color="#339933">,</font>&nbsp;<font color="#000088">$value</font><font color="#009900">)</font>&nbsp;<font color="#009900">{</font><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000088">$this</font><font color="#339933">-&gt;</font><font color="#004000">data</font><font color="#009900">[</font><font color="#000088">$name</font><font color="#009900">]</font>&nbsp;<font color="#339933">=</font>&nbsp;<font
                color="#000088">$value</font><font color="#339933">;</font><br>
        &nbsp;&nbsp;&nbsp;&nbsp;<font color="#009900">}</font><br>
        &nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">public</font>&nbsp;<font color="#000000">function</font>&nbsp;__get<font color="#009900">(</font><font color="#000088">$name</font><font color="#009900">)</font>&nbsp;<font
                color="#009900">{</font><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#b1b100">return</font>&nbsp;<font color="#000088">$this</font><font color="#339933">-&gt;</font><font color="#004000">data</font><font color="#009900">[</font><font color="#000088">$name</font><font color="#009900">]</font><font color="#339933">;</font><br>
        &nbsp;&nbsp;&nbsp;&nbsp;<font color="#009900">}</font><br>
        <font color="#009900">}</font></blockquote>
    <br>
    <br>
    Если попытаться изменить значение sub ключа some массива $data таким вот образом:<br>
    <br>
    <blockquote><font color="#000088">$my</font>&nbsp;<font color="#339933">=</font>&nbsp;<font color="#000000">new</font>&nbsp;MyClass<font color="#009900">(</font><font color="#009900">)</font><font color="#339933">;</font><br>
        &nbsp;<br>
        <font color="#000088">$my</font><font color="#339933">-&gt;</font><font color="#004000">some</font><font color="#009900">[</font><font color="#0000ff">'sub'</font><font color="#009900">]</font>&nbsp;<font color="#339933">=</font>&nbsp;<font color="#0000ff">'test'</font><font color="#339933">;</font>&nbsp;<font color="#666666">//&nbsp;пытаемся&nbsp;изменить&nbsp;значение</font><br>
        &nbsp;<br>
        <font color="#b1b100">echo</font>&nbsp;<font color="#000088">$my</font><font color="#339933">-&gt;</font><font color="#004000">some</font><font color="#009900">[</font><font color="#0000ff">'sub'</font><font color="#009900">]</font><font color="#339933">;</font>&nbsp;<font color="#666666">//&nbsp;выведет&nbsp;'data'</font></blockquote>
    <br>
    <br>
    Вылезет Notice:<br>
    <blockquote>Notice: Indirect modification of overloaded property MyClass::$some has no effect</blockquote>
    <br>
    <br>
    Для решения проблемы напишем ещё один класс (у меня он называется ActiveArray, так как является частю моего
    ActiveRecord):<br>
    <br>
    <blockquote><font color="#000000">class</font>&nbsp;ActiveArray&nbsp;<font color="#009900">{</font><br> &nbsp;&nbsp;&nbsp;&nbsp;protected&nbsp;<font color="#000088">$array</font><font color="#339933">;</font><br> &nbsp;<br> &nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">public</font>&nbsp;<font color="#000000">function</font>&nbsp;__construct<font color="#009900">(</font><font color="#000088">$array</font><font color="#009900">)</font>&nbsp;<font color="#009900">{</font><br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000088">$this</font><font color="#339933">-&gt;</font><font color="#004000">array</font>&nbsp;<font color="#339933">=</font>&nbsp;<font color="#339933"> &amp;</font><font color="#000088">$array</font><font color="#339933">;</font><br>  &nbsp;&nbsp;&nbsp;&nbsp;<font color="#009900">}</font><br> &nbsp;<br>  &nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">public</font>&nbsp;<font color="#000000">function</font>&nbsp;__set<font color="#009900">(</font><font color="#000088">$name</font><font color="#339933">,</font>&nbsp;<font color="#000088">$value</font><font color="#009900">)</font>&nbsp;<font color="#009900">{</font><br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000088">$this</font><font color="#339933">-&gt;</font><font color="#004000">array</font><font color="#009900">[</font><font color="#000088">$name</font><font color="#009900">]</font>&nbsp;<font color="#339933">=</font>&nbsp;<font color="#000088">$value</font><font color="#339933">;</font><br> &nbsp;&nbsp;&nbsp;&nbsp;<font color="#009900">}</font><br>  &nbsp;<br> &nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">public</font>&nbsp;<font color="#000000">function</font>&nbsp;__get<font  color="#009900">(</font><font color="#000088">$name</font><font color="#009900">)</font>&nbsp;<font color="#009900">{</font><br>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#b1b100">if</font>&nbsp;<font color="#009900">(</font><font color="#990000">is_array</font><font color="#009900">(</font><font color="#000088">$this</font><font color="#339933">-&gt;</font><font color="#004000">array</font><font color="#009900">[</font><font color="#000088">$name</font><font  color="#009900">]</font><font color="#009900">)</font><font color="#009900">)</font><br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#b1b100">return</font>&nbsp;<font  color="#000000">new</font>&nbsp;<font color="#000000">self</font><font color="#009900">(</font><font color="#339933">&amp;</font><font color="#000088">$this</font><font color="#339933">-&gt;</font><font color="#004000">array</font><font color="#009900">[</font><font color="#000088">$name</font><font color="#009900">]</font><font color="#009900">)</font><font color="#339933">;</font><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#b1b100">else</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#b1b100">return</font>&nbsp;<font color="#000088">$this</font><font color="#339933">-&gt;</font><font  color="#004000">array</font><font color="#009900">[</font><font color="#000088">$name</font><font color="#009900">]</font><font color="#339933">;</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br> &nbsp;&nbsp;&nbsp;&nbsp;<font color="#009900">}</font><br>
        <font color="#009900">}</font></blockquote>
    <br>
    <br>
    И слегка модифицируем метод __get класса MyClass:<br>
    <blockquote>&nbsp;&nbsp;&nbsp;&nbsp;<font color="#000000">public</font>&nbsp;<font color="#000000">function</font>&nbsp;__get<font color="#009900">(</font><font color="#000088">$name</font><font color="#009900">)</font>&nbsp;<font color="#009900">{</font><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#b1b100">if</font><font color="#009900">(</font><font color="#990000">is_array</font><font color="#009900">(</font><font
                color="#000088">$this</font><font color="#339933">-&gt;</font><font color="#004000">data</font><font color="#009900">[</font><font color="#000088">$name</font><font color="#009900">]</font><font color="#009900">)</font><font color="#009900">)</font><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#b1b100">return</font>&nbsp;<font color="#000000">new</font>&nbsp;ActiveArray<font color="#009900">(</font><font color="#339933">
            &amp;</font><font color="#000088">$this</font><font color="#339933">-&gt;</font><font color="#004000">data</font><font color="#009900">[</font><font color="#000088">$name</font><font color="#009900">]</font><font color="#009900">)</font><font color="#339933">;</font><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#b1b100">else</font><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#b1b100">return</font>&nbsp;<font color="#000088">$this</font><font color="#339933">-&gt;</font><font color="#004000">data</font><font color="#009900">[</font><font color="#000088">$name</font><font color="#009900">]</font><font color="#339933">;</font><br>
        &nbsp;&nbsp;&nbsp;&nbsp;<font color="#009900">}</font></blockquote>
    <br>
    <br>
    Теперь можно обращатся ко вложенным массивам таким вот образом:<br>
    <blockquote><font color="#000088">$my</font><font color="#339933">-&gt;</font><font color="#004000">some</font><font color="#339933">-&gt;</font><font color="#004000">sub</font>&nbsp;<font color="#339933">=</font>&nbsp;<font color="#0000ff">'test'</font><font color="#339933">;</font><br>
        <font color="#b1b100">echo</font>&nbsp;<font color="#000088">$my</font><font  color="#339933">-&gt;</font><font color="#004000">some</font><font color="#339933">-&gt;</font><font color="#004000">sub</font><font color="#339933">;</font>&nbsp;<font color="#666666">//&nbsp;выведет&nbsp;'test'</font><br>
        &nbsp;<br>
        <font color="#000088">$my</font><font color="#339933">-&gt;</font><font  color="#004000">some</font>&nbsp;<font color="#339933">=</font>&nbsp;<font  color="#990000">array</font><font color="#009900">(</font><font color="#0000ff">'abc'</font>&nbsp;<font color="#339933">=&gt;</font>&nbsp;<font color="#cc66cc">123</font><font color="#009900">)</font><font color="#339933">;</font><br>
        <font color="#b1b100">echo</font>&nbsp;<font color="#000088">$my</font><font color="#339933">-&gt;</font><font color="#004000">some</font><font color="#339933">-&gt;</font><font color="#004000">abc</font><font color="#339933">;</font>&nbsp;<font color="#666666">//&nbsp;выведет&nbsp;'123'</font>
    </blockquote>
    <br>
    <br>
    Спасибо за внимание!

    <br>
    <br>
