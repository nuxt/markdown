import all from 'mdast-util-to-hast/lib/all'

'use strict'

module.exports = paragraph

function paragraph (h, node) {
  return h(node, 'p', all(h, node))
}
