---
layout: post
title: Immutable list implementation 🥝
---

Today I want to share with you an implementation of **immutable list in JavaScript** in **one line**!

Long story short:

```js
const list = (head, tail) => next => next ? tail : head
```

That's it! This is a full implementation of immutable list structure in JavaScript.

<img src="/assets/mind-blow.gif" class="center">

Let's me show how to create a list on three elements.

```js
const three = list(1, list(2, list(3)))
```

As you may notice in the last `list` call, we omitted `tail` argument. 
That's because an empty `∅` list is presented as `undefined`.

```js
const empty = void 0
```

But the list itself is not very useful, we need a way of getting elements from it. 
For this we'll create two functions `head` and `tail`.
 
 
```js
const head = l => l && l()
const tail = l => l && l(true)
```

Here is how we can retrieve head and tail from our `three` list. 

```js
const el = head(three) // 1
const xs = tail(three) // list(2, list(3))
``` 

And there is no way to mutate the `three` list. We can create only new list from elements of old one.


Lets write an function to retrieve the last element from a list. 
If tail isn't an empty list (i.e. not undefined) get the last element of it's tail. 
If tail is empty get list's head. Yep, a recursion. A special one — with a tail call.

```js
const last = l => tail(l) ? last(tail(l)) : head(l)
```

But to deal with a really big list in JavaScript we need [tail call optimization](http://2ality.com/2015/06/tail-call-optimization.html).
And luckily ES6 has it.

Next, lets implement a very useful and powerful function [foldl](https://en.wikipedia.org/wiki/Fold_(higher-order_function)).

```js
const foldl = (l, acc, fn) => l ? foldl(tail(l), fn(head(l), acc), fn) : acc
```

This function folds (reduces) the given list from the left with a function.

```js
foldl(three, 1, (x, acc) => x * acc) // gives 6
```

Next, lets implement reverse function which returns new list in reverse order. 

```js
const reverse = l => foldl(l, empty, list)
```

Pretty neat. Right? I created a npm library [@medv/list](https://github.com/antonmedv/list) with these
and other helpful functions. You can play with it to understand why it's working.

<script src="https://embed.runkit.com" async data-element-id="runkit"></script>

<div id="runkit">
const {list, print, foldl, reverse} = require('@medv/list')
 
const a = list(1, list(2, list(3)))
const b = reverse(a)
 
print(a)
print(b)
foldl(a, 1, (x, acc) => x * acc)
</div>

With foldl and reverse we can implement simple foldr function. 

```js
const foldr = (l, acc, fn) => foldl(reverse(l), acc, fn)
```

And with foldr we can implement function for concatenating two lists.

```js
const concat = (l, r) => foldr(l, r, list)
```

The complexity of concat is proportional to `length(l)`, so avoid repeatedly concatenating lists of arbitrary length, 
e.g. `concat(l, list(el))`. Instead, consider prepending via `list(el, l)` and then reversing.


But is this recursion fast enough? We can rewrite foldl to loop and run benchmarks (for it I use test of @medv/list).

```js
const foldl = (l, acc, fn) => {
  while (l) {
    acc = fn(head(l), acc)
    l = tail(l)
  }
  return acc
}
```

Results are as the same as recursive implementation  with `--harmony-tailcalls`:

```
$ time npm test

> node --harmony-tailcalls node_modules/.bin/ava

  15 passed

real	0m32,747s
user	0m31,353s
sys	0m2,032s
```

And without recursion:

```
$ time npm test

> node node_modules/.bin/ava

  15 passed

real	0m32,861s
user	0m31,556s
sys	0m2,137s
```

Btw, Are there more performance implementations of immutable list? Definitely.

For example:

```js
const list = (head, tail) => Object.freeze({head, tail})
```

This implementation, on same benchmarks, 6 time faster. But it's not so awesome as stack for storing head and tail.

### Links

* [@medv/list](https://github.com/antonmedv/list) — immutable list library
* [tto](https://github.com/antonmedv/tto) — tic-tak-toe build with this library

