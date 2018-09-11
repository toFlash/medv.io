import React from 'react'
import {graphql} from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'

class About extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(this, 'props.data.site.siteMetadata.description')

    return (
      <Layout location={this.props.location}>
        <Helmet
          meta={[{name: 'description', content: siteDescription}]}
          title={`About | ${siteTitle}`}
        />
        <section className="about-the-author">
          <div className="polygon">
            <div className="avatar"/>
          </div>
          <div className="about-text">
            <h4>Hi</h4>

            My name is Anton and I'm a developer at <a href="https://aviasales.ru">Aviasales</a>. I do backend and
            frontend there. Currently living in Thailand, Phuket.<br/>
            <br/>

            I love doing open source and creating human friendly tools. <br/>
            <br/>

            You can find me on <a href="https://twitter.com/antonmedv">twitter</a>, <a
            href="https://github.com/antonmedv">github</a>, or reach me via <a href="mailto:anton@medv.io">email</a>.
          </div>
        </section>
      </Layout>
    )
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
