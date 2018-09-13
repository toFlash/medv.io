import React from 'react'
import {Link} from 'gatsby'
import {Location} from '@reach/router'

import '../styles/layout.scss'
import 'prismjs/themes/prism-solarizedlight.css'

class Layout extends React.Component {
  render() {
    return (
      <div className="container">
        <header>
          <div className="logo">
            <Logo/>
            <Link to={'/'}>medv.io</Link>
          </div>
          <nav>
            <Link to="/blog/" activeClassName="active">/blog/</Link>
            <Link to="/projects/" activeClassName="active">/projects/</Link>
            <Link to="/about/" activeClassName="active">/about/</Link>
          </nav>
        </header>
        {this.props.children}
      </div>
    )
  }
}

const Logo = () => {
  const emoji = ['🥝', '🧀', '🔥', '🎀', '🤩', '🌳']
  return (
    <svg width="40" height="50" viewBox="0 0 140 150" xmlns="http://www.w3.org/2000/svg">
      <title>Anton Medvedev</title>
      <g fill="none" fillRule="evenodd">
        <path fill="#50E3C2" d="M70 0l70 37.466v74.798L70 74.932z"/>
        <path fill="#B8E986" d="M70 0L0 37.466v74.794l70-37.332z"/>
        <text fontSize="92" fill="#4A4A4A">
          <Location>{({location}) => <tspan x="23" y="116">{emoji[hash(location) % emoji.length]}</tspan>}</Location>
        </text>
        <path fillOpacity=".5" fill="#04B8DE" d="M140 37.465L70 74.929 70 149.586l70-37.333z"/>
        <path fillOpacity=".5" fill="#1CF8B4" d="M0 37.465l70 37.46v74.67L0 112.263z"/>
        <path fillOpacity=".4" fill="#BD10E0" d="M70 0l70 37.465L70 74.93 0 37.465z"/>
      </g>
    </svg>
  )
}

function hash(location) {
  function hashCode(str) {
    let hash = 0, i, chr
    if (str.length === 0) {
      return hash
    }
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

  return Math.abs((new Date()).getHours() + hashCode(location.pathname))
}

export default Layout
