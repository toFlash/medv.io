import React from 'react'
import Layout from '../components/Layout'
import Helmet from 'react-helmet'

const NotFoundPage = (props) => (
  <Layout location={props.location}>
    <Helmet title="Not found"/>
    <div align="center">
      <svg width="160" height="200" viewBox="0 0 140 150" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <path fill="#50E3C2" d="M70 0l70 37.466v74.798L70 74.932z"/>
          <path fill="#B8E986" d="M70 0L0 37.466v74.794l70-37.332z"/>
          <text fontSize="52" fill="#4A4A4A">
            <tspan x="23" y="116">404</tspan>
          </text>
          <path fillOpacity=".5" fill="#04B8DE" d="M140 37.465L70 74.929 70 149.586l70-37.333z"/>
          <path fillOpacity=".5" fill="#1CF8B4" d="M0 37.465l70 37.46v74.67L0 112.263z"/>
          <path fillOpacity=".4" fill="#BD10E0" d="M70 0l70 37.465L70 74.93 0 37.465z"/>
        </g>
      </svg>
      <br/>
      <h1>Not found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>
  </Layout>
)

export default NotFoundPage
