import React from 'react'
import {graphql} from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import Projects from '../components/Projects'

class ProjectsIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(
      this,
      'props.data.site.siteMetadata.description'
    )
    const a = get(this, 'props.data.githubData.data.user.repositories.nodes')
    const b = get(this, 'props.data.githubData.data.user.pinnedRepositories.nodes')
    const projects = merge(b, a, 'name')

    return (
      <Layout location={this.props.location}>
        <Helmet
          meta={[{name: 'description', content: siteDescription}]}
          title={`Projects | ${siteTitle}`}
        />
        <Projects projects={projects}/>
      </Layout>
    )
  }
}

export default ProjectsIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    githubData {
      data {
        user {
          pinnedRepositories {
            nodes {
              name
              description
              url
              stargazers {
                totalCount
              }
              languages {
                nodes {
                  name
                }
              }              
            }
          }
          repositories {
            nodes {
              name
              description
              url
              stargazers {
                totalCount
              }
              languages {
                nodes {
                  name
                  color
                }
              }              
            }
          }
        }
      }
    }
  }
`

function merge(a, b, key) {
  function x(a) {
    a.forEach(function (b) {
      if (!(b[key] in obj)) {
        obj[b[key]] = obj[b[key]] || {}
        array.push(obj[b[key]])
      }
      Object.keys(b).forEach(function (k) {
        obj[b[key]][k] = b[k]
      })
    })
  }

  let array = [], obj = {}

  x(a)
  x(b)
  return array
}
