'use strict'

module.exports = root

var u = require('unist-builder')
var wrap = require('../wrap')
import all from 'mdast-util-to-hast/lib/all'

function root(h, node) {
  return h.augment(node, u('root', wrap(all(h, node))))
}
