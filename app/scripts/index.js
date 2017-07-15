import "./register-service-worker"
import highlight from "./highlight"

function ready() {
  highlight();
}

if (document.readyState !== 'loading') {
  ready()
} else {
  document.addEventListener('DOMContentLoaded', ready)
}
