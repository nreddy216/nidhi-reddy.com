module.exports = {
  siteMetadata: {
    title: `Nidhi Reddy`,
    description: `Nidhi Reddy's Portfolio`,
    author: `Nidhi Reddy`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-preact`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {
        devMode: false,
      },
    },
    {
      resolve: "gatsby-remark-embed-video",
      options: {
        ratio: 1.77,
        related: false,
        noIframeBorder: true,
      },
    },
    `gatsby-remark-responsive-iframe`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/data`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 768,
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-personal-website-starter`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#ed64a6`,
        theme_color: `#ed64a6`,
        display: `minimal-ui`,
        icon: `src/assets/images/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-tailwindcss`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        tailwind: true,
        purgeOnly: [`src/assets/styles/global.css`],
      },
    },
  ],
};
