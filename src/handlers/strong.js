import all from 'mdast-util-to-hast/lib/all'

'use strict'

module.exports = strong

function strong (h, node) {
  return h(node, 'strong', all(h, node))
}
