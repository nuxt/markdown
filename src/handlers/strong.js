'use strict'

module.exports = strong

import all from 'mdast-util-to-hast/lib/all'

function strong(h, node) {
  return h(node, 'strong', all(h, node))
}
