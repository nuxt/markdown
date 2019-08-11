'use strict'

const normalize = require('mdurl/encode')

module.exports = image

function image (h, node) {
  const props = { src: normalize(node.url), alt: node.alt }

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  return h(node, 'img', props)
}
