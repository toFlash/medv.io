import React from 'react'
import {graphql, Link} from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import Posts from '../components/Posts'
import Projects from '../components/Projects'

class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(
      this,
      'props.data.site.siteMetadata.description'
    )
    const posts = get(this, 'props.data.allMarkdownRemark.edges')
    const projects = get(this, 'props.data.githubData.data.user.pinnedRepositories.nodes')

    return (
      <Layout location={this.props.location}>
        <Helmet
          meta={[{name: 'description', content: siteDescription}]}
          title={siteTitle}
        />
        <h3>blog</h3>
        <Posts posts={posts}/>
        <Link to="/blog/">More →</Link>

        <h3>projects</h3>
        <Projects projects={projects}/>
        <Link to="/projects/">More →</Link>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 7) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMM YYYY")
            title
            link
          }
        }
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
