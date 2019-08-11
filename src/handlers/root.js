import all from 'mdast-util-to-hast/lib/all'
'use strict'

module.exports = root

const u = require('unist-builder')
const wrap = require('../wrap')

function root (h, node) {
  return h.augment(node, u('root', wrap(all(h, node))))
}
