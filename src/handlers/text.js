'use strict'

module.exports = text

const u = require('unist-builder')
const trimLines = require('trim-lines')

function text (h, node) {
  return h.augment(node, u('text', trimLines(node.value)))
}
