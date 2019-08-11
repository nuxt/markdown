'use strict'

module.exports = inlineCode

const collapse = require('collapse-white-space')
const u = require('unist-builder')

function inlineCode (h, node) {
  return h(node, 'code', [u('text', collapse(node.value))])
}
