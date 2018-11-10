import React from 'react'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import '../styles/about.scss'

const video = require('../assets/video.mp4')

class About extends React.Component {
  constructor(props) {
    super(props)
    this.video = React.createRef()
  }

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(this, 'props.data.site.siteMetadata.description')

    return (
      <Layout location={this.props.location}>
        <Helmet
          meta={[{name: 'description', content: siteDescription}]}
          title={`About | ${siteTitle}`}
        />
        <section className="about">
          <video style={{maxWidth: 350, width: '100%'}} ref={this.video}>
            <source src={video} type="video/mp4"/>
          </video>
          <div className="about-text">

            <h4>Hi</h4>

            <p>
              My name is Anton and I'm a developer at <a href="https://aviasales.ru">Aviasales</a>. I do backend and
              frontend there. Currently living in Thailand, Phuket.
            </p>

            <p>
              I love doing open source and creating human friendly tools.
            </p>

            <p>
              You can find me on <a href="https://twitter.com/antonmedv">twitter</a>, <a
              href="https://github.com/antonmedv">github</a>, or reach me via <a
              href="mailto:anton+blog@medv.io">email</a>.
            </p>

            <p>
              If you are interested in hiring me, here is my <a href="">cv</a>.
            </p>

          </div>
        </section>
      </Layout>
    )
  }

  playVideo = () => {
    this.video.current.muted = true
    this.video.current.play()
  }

  componentDidMount() {
    this.intervalId = setInterval(this.playVideo, 3e3)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }
}

export default About

export const pageQuery = graphql`
  query {
    site {
    siteMetadata {
    title
    description
  }
  }
  }
  `
