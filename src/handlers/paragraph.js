'use strict'

module.exports = paragraph

import all from 'mdast-util-to-hast/lib/all'

function paragraph(h, node) {
  return h(node, 'p', all(h, node))
}
