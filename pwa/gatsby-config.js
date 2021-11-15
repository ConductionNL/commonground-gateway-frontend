require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  pathPrefix: "/commonground-gateway-frontend",
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "pwa",
  },
  plugins: [
    `gatsby-plugin-ts`,
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        pathToEmotionCacheProps: `src/emotion-cache-props`,
      },
    },
    {
      resolve: `gatsby-plugin-csp`,
      options: {
        disableOnDev: true,
        mergeScriptHashes: true,
        mergeStyleHashes: true,
        directives: {
          "script-src": "'self' 'unsafe-eval' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/ https://unpkg.com/@conductionnl/ https://unpkg.com/@utrecht/ https://unpkg.com/@nl-design-system-unstable/",
          "style-src": "'self' 'nonce-true' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/ https://unpkg.com/@conductionnl/ https://unpkg.com/@utrecht/ https://unpkg.com/@nl-design-system-unstable/",
          "img-src": "'self' https://demodam.nl/ data:"
        }
      }
    }
  ]
};
