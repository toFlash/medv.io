---
layout: post
title: List of available 3 letter npm names
---

Do you want a cool npm name as [ava](https://www.npmjs.com/package/ava), [vue](https://www.npmjs.com/package/vue) or [koa](https://www.npmjs.com/package/koa)?
But can't find one?

I got a list of all _available npm packages_ here. But first consider using a [scope](https://docs.npmjs.com/misc/scope),
like [@medv/list](https://www.npmjs.com/package/@medv/list) or [@cycle](https://github.com/cyclejs/cyclejs). 
It's much cooler, and npm will be completely different, if scopes were mandatory.

Is this list up-to date? Well, almost (🙃) I created a npm [package](https://github.com/antonmedv/find-npm-name) for updating the list.

```
npm install -g fnn
```

And run it

```
fnn
```

After a certain about of time (about a few hours) you will get [available.txt](https://github.com/antonmedv/find-npm-name/blob/master/available.txt) 
file with all available npm packages. Send a PR to update the list.

<div class="npm-names">🚀 Loading free npm names...</div>
<script>
  function load() {
    fetch('https://raw.githubusercontent.com/antonmedv/find-npm-name/master/available.txt?1')
    .then(res => res.text())
    .then(data => show(data))
  }
  
  function show(data) {
    const html = data.split('\n').map(name => `<a href="https://www.npmjs.com/package/${name}" target="_blank">${name}</a>`)
    document.querySelector('.npm-names').innerHTML = html.join(' ')
  }
  
  if (document.readyState !== 'loading') {
    load()
  } else {
    document.addEventListener('DOMContentLoaded', load)
  }
</script>
