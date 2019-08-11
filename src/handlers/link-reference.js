import revert from 'mdast-util-to-hast/lib/revert'
import all from 'mdast-util-to-hast/lib/all'
'use strict'

module.exports = linkReference

const normalize = require('mdurl/encode')

function linkReference (h, node) {
  const def = h.definition(node.identifier)
  let props

  if (!def) {
    return revert(h, node)
  }

  props = { href: normalize(def.url || '') }

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return h(node, 'a', props, all(h, node))
}
