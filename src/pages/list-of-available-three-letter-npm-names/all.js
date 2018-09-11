import React from 'react'
import Layout from '../../components/Layout'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import {graphql, Link} from 'gatsby'
import './npm-names.scss'

export default class extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(
      this,
      'props.data.site.siteMetadata.description'
    )

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{lang: 'en'}}
          meta={[{name: 'description', content: siteDescription}]}
          title={siteTitle}
        />
        <Link to="/list-of-available-three-letter-npm-names/">← Back to article</Link>
        <div className="npm-names">
          🚀 Loading free npm names...
        </div>
      </Layout>
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

