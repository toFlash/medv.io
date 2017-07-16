import "./register-service-worker"
import highlight from "./highlight"

function ready() {
  highlight()

  if (window.navigator.userAgent.indexOf('Windows') !== -1) {
    document.documentElement.className = '-windows'
  } else {
    document.documentElement.className = '-macos'
  }


  const logo = document.querySelector('.logo')
  const people = ['😜', '🙃', '😉', '😂', '😊', '🙂', '😲', '😝', '😋', '😌', '😍', '😳']

  let i = 0
  const next = () => people[i++ % people.length]

  if (logo) {
    const tspan = logo.querySelector('tspan')
    if (tspan) {
      let interval = null
      const roll = () => tspan.textContent = next()
      const start = () => interval = setInterval(roll, 100)
      const stop = () => clearInterval(interval)

      logo.addEventListener('mouseenter', start)
      logo.addEventListener('mouseleave', stop)
    }
  }
}

if (document.readyState !== 'loading') {
  ready()
} else {
  document.addEventListener('DOMContentLoaded', ready)
}
