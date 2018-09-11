import React from 'react'
import get from 'lodash/get'
import {Link} from 'gatsby'

class Posts extends React.Component {
  render() {
    return (
      <div className="posts">
        {this.props.posts.map(({node}) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <span className="date">{node.frontmatter.date}</span>
              {node.frontmatter.link
                ?
                <a href={node.frontmatter.link}>
                  {title}<div className="icon-link"/>
                </a>
                :
                <Link to={node.fields.slug}>{title}</Link>
              }
            </div>
          )
        })}
      </div>
    )
  }
}

export default Posts
