module.exports = {
  siteMetadata: {
    title: 'Anton Medvedev',
    author: 'Anton Medvedev',
    description: 'A personal blog about programming.',
    siteUrl: 'https://medv.io',
  },
  pathPrefix: '/',
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-72806543-1`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Anton Medvedev Blog`,
        short_name: `medv.io`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#462cff`,
        display: `minimal-ui`,
        icon: `src/assets/logo.svg`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Roboto Mono`,
          `Rubik:700&amp;subset=cyrillic`
        ]
      }
    },
    {
      resolve: `gatsby-source-github-api`,
      options: {
        token: process.env.GITHUB_TOKEN,
        graphQLQuery: `
        {
          user(login: "antonmedv") {
            pinnedRepositories(first: 6) {
              nodes {
                name
                description
                url
                stargazers {
                  totalCount
                }
                languages(first: 1) {
                  nodes {
                    name
                    color
                  }
                }
              }
            }
            repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, isFork: false, affiliations: OWNER) {
              nodes {
                name
                description
                url
                stargazers {
                  totalCount
                }
                languages(first: 1) {
                  nodes {
                    name
                    color
                  }
                }
              }
            }
          }
        }
        `,
      }
    }
  ],
}
