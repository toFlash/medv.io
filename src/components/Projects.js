import React from 'react'

class Projects extends React.Component {
  render() {
    return (
      <div className="projects">
        {this.props.projects.map(project => {
          if (project.stargazers.totalCount === 0) {
            return null
          }
          return (
            <div key={project.url}>
              <a className="project-link" href={project.url}>
                {project.name}
              </a>
              <span className="stars">(★{project.stargazers.totalCount})</span>
              {project.languages.nodes.map(n => <span key={n.name} className="tech" style={{color: n.color}}>{n.name}</span>)}
              <div className="desc">{project.description}</div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Projects
