const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const isProd = process.env.NODE_ENV === 'production'
const withCSS = require('@zeit/next-css');
const withImages = require('next-images')

module.exports = (phase, { defaultConfig }) => {
  return withImages(withCSS({
    env: {
        customKey: 'my-value',
      },
    /* config options for all phases except development here */
  }))
}