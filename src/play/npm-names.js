import React from 'react'
import './npm-names.scss'

export default class extends React.Component {
  render() {
    return (
      <div className="npm-names">
        Loading free npm names...
      </div>
    )
  }

  componentDidMount() {
    function show(data) {
      const html = data.split('\n').map(name => `<a href="https://www.npmjs.com/package/${name}" target="_blank">${name}</a>`)
      document.querySelector('.npm-names').innerHTML = html.join(' ')
    }

    fetch('https://raw.githubusercontent.com/antonmedv/find-npm-name/master/available.txt?1')
      .then(res => res.text())
      .then(data => show(data))
  }
}
