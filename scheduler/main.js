let vDom

function* render(iter, parentDom) {
  let next
  while (!(next = iter.next()).done) {
    yield
  }
  const input = next.value

  if (vDom) {
    yield* patch(
      vDom,
      input,
      parentDom
    )
  } else {
    yield* mount(input, parentDom)
  }
  vDom = input
}

function* mount(vNode, parentDom) {
  const dom =
    vNode.type === 'text' ?
      document.createTextNode(vNode.textContent) :
      document.createElement(vNode.type)

  if (parentDom) {
    yield () => parentDom.appendChild(dom)
  }

  vNode.dom = dom

  for (let child of vNode.children) {
    yield* mount(child, dom)
  }
}

function* unmount(vNode, parentDom) {
  const node = vNode.dom
  yield () => parentDom.removeChild(node)
}

function* patch(lastVNode, nextVNode, parentDom) {
  let dom

  if (nextVNode.type !== lastVNode.type) {
    yield* mount(nextVNode, null)
    yield () => parentDom.replaceChild(nextVNode.dom, lastVNode.dom)
  } else if (nextVNode.textContent !== lastVNode.textContent) {
    dom = lastVNode.dom
    yield () => parentDom.firstChild.nodeValue = nextVNode.textContent
  } else {
    dom = lastVNode.dom
    yield* patchChildren(lastVNode.children, nextVNode.children, lastVNode.dom)
  }

  nextVNode.dom = dom
}

function* patchChildren(lastChildren, nextChildren, parentDom) {
  const commonLength =
    lastChildren.length > nextChildren.length
      ? nextChildren.length
      : lastChildren.length

  let i = 0

  for (; i < commonLength; i++) {
    let nextChild = nextChildren[i]
    yield* patch(
      lastChildren[i],
      nextChild,
      parentDom
    )
  }

  if (lastChildren.length < nextChildren.length) {
    for (i = commonLength; i < nextChildren.length; i++) {
      let nextChild = nextChildren[i]
      yield* mount(nextChild, parentDom)
    }
  } else if (lastChildren.length > nextChildren.length) {
    for (i = commonLength; i < lastChildren.length; i++) {
      yield* unmount(lastChildren[i], parentDom)
    }
  }
}

// Scheduler

let log = []
let current = null
let handler = null
let refreshScheduled = false

function enqueueTask(iter) {
  if (!handler) {
    current = iter
    handler = requestIdleCallback(runTaskQueue)
  }
}

function runTaskQueue(timing) {
  while (timing.timeRemaining() > 0 || timing.didTimeout) {
    const {done, value} = current.next()

    if (done) {
      scheduleStatusRefresh()
      current = null
      break
    } else {
      log.push(value)
    }
  }

  if (current) {
    handler = requestIdleCallback(runTaskQueue)
  } else {
    handler = null
  }
}

function scheduleStatusRefresh() {
  if (!refreshScheduled) {
    requestAnimationFrame(commit)
    refreshScheduled = true
  }
}

function commit() {
  let i = 0
  for (; i < log.length && i < 10000; i++) {
    log[i]()
  }

  log.splice(0, i)

  if (log.length) {
    requestAnimationFrame(commit)
  } else {
    log = []
    refreshScheduled = false
  }
}


// App

function convert(children) {
  return children
    .filter(child => child)
    .map(child => typeof child === 'string'
      ? {type: 'text', children: [], textContent: child}
      : child
    )
}

function h(type, ...children) {
  return {type, children: convert(children || [])}
}

function* Tree({level}) {
  let a, b
  if (level > 0) {
    const iter = Tree({level: level - Math.ceil(Math.random() * level)})
    let next
    while (!(next = iter.next()).done) {
      yield
    }
    a = next.value
  }
  if (level > 0) {
    const iter = Tree({level: level - Math.ceil(Math.random() * level)})
    let next
    while (!(next = iter.next()).done) {
      yield
    }
    b = next.value
  }
  return h('div',
    h('span', ''),
    h('section',
      a,
      b
    )
  )
}

function* App({text}) {
  return h('header',
    h('h1', ` ${text} `),
    h('input', ''),
    yield* Tree({level: 10000})
  )
}

let state = {
  text: ''
}

document.addEventListener('keyup', event => {
  const input = document.querySelector('h1')
  const node = event.target
  if (input) {
    input.textContent = state.text = ` ${node.value} `
  }
})

const sync = () => {
  for (let fn of render(App(state), document.body)) {
    fn()
  }
}

const async = () => {
  enqueueTask(render(App(state), document.body))
}

const main = () => {
  async()
  setTimeout(main, 1e3)
}

main()
