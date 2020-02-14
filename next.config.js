const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const isProd = process.env.NODE_ENV === 'production'
const withCSS = require('@zeit/next-css');
const withImages = require('next-images')

module.exports = (phase, { defaultConfig }) => {
  var config = withImages(withCSS(defaultConfig))
  config.target = 'serverless'
  console.log({config})
  return config
}