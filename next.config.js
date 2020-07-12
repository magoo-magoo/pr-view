const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const isProd = process.env.NODE_ENV === 'production'
const withImages = require('next-images')

module.exports = (phase, { defaultConfig }) => {
    var config = withImages(defaultConfig)
    config.target = 'serverless'
    return config
}
