import React from 'react'
import Helmet from 'react-helmet'
import {graphql, Link} from 'gatsby'
import get from 'lodash/get'
import Layout from '../components/Layout'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const postUrl = get(this.props, 'data.site.siteMetadata.siteUrl') + this.props.location.pathname
    const pageViews = get(this.props, 'data.pageViews.totalCount')
    const readingTime = get(this.props, 'data.markdownRemark.fields.readingTime.text')
    const siteDescription = post.excerpt
    const {previous, next} = this.props.pageContext

    return (
      <Layout location={this.props.location}>
        <Helmet
          meta={[{name: 'description', content: siteDescription}]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />

        <h1>{post.frontmatter.title}</h1>
        <div className="meta">
          <div className="created-at" title="Posted at">{post.frontmatter.date}</div>
          {pageViews &&
            <div className="page-views" title="Page views">{pageViews} views</div>
          }
          <div className="reading-time" title="Reading time">{readingTime}</div>
        </div>

        <div dangerouslySetInnerHTML={{__html: post.html}}/>

        <div className="fleuron">❦</div>

        <section className="about-the-author">
          <div className="polygon">
            <div className="avatar"/>
          </div>
          <div className="about-text">
            Hi, I’m Anton. If you liked the post share it
            <span className="share-buttons">
              <a className="btn" href={`https://twitter.com/intent/tweet?text=&url=${postUrl}`}
                 target="_blank" rel="noopener noreferrer">
                <svg className="icon-twitter" width="18" height="15" viewBox="0 0 18 15"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 1.776a7.213 7.213 0 0 1-2.12.596A3.778 3.778 0 0 0 17.503.277a7.273 7.273 0 0 1-2.346.918A3.642 3.642 0 0 0 12.462 0C10.424 0 8.77 1.696 8.77 3.787c0 .296.032.585.095.862-3.069-.158-5.79-1.664-7.612-3.958a3.856 3.856 0 0 0-.5 1.906c0 1.313.652 2.472 1.643 3.152a3.626 3.626 0 0 1-1.673-.473v.047c0 1.835 1.273 3.366 2.963 3.713-.31.089-.636.133-.973.133-.238 0-.47-.023-.695-.067.47 1.504 1.833 2.599 3.45 2.628A7.292 7.292 0 0 1 0 13.3 10.282 10.282 0 0 0 5.66 15c6.794 0 10.508-5.77 10.508-10.774 0-.164-.003-.329-.01-.49A7.58 7.58 0 0 0 18 1.776"
                    fill="#424242" fillRule="evenodd"/>
                </svg>
                Tweet
              </a>
              <a className="btn" href={`http://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
                 target="_blank" rel="noopener noreferrer">
                <svg className="icon-facebook" width="18" height="18" viewBox="0 0 18 18"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.614 18H.994A.993.993 0 0 1 0 17.006V.993C0 .445.445 0 .993 0h16.014c.548 0 .993.445.993.993v16.013a.994.994 0 0 1-.993.994H12.42v-6.97h2.34l.35-2.717h-2.69V6.578c0-.786.218-1.322 1.346-1.322h1.438v-2.43a19.23 19.23 0 0 0-2.096-.107c-2.074 0-3.494 1.266-3.494 3.59v2.004H7.27v2.716h2.345V18z"
                    fill="#424242" fillRule="evenodd"/>
                </svg>
                Share
              </a>
            </span>
            <br/>
            If you found a typo <a href="https://github.com/antonmedv/medv.io">edit
            post</a> on GitHub.
          </div>
        </section>

        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0,
          }}
        >
          {previous && (
            <li>
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            </li>
          )}

          {next && (
            <li>
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            </li>
          )}
        </ul>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "DD MMMM YYYY")
      }
      fields {
        readingTime {
          text
        }
      }
    }
    pageViews(path: {eq: $slug}) {
      totalCount
    }
  }
`
