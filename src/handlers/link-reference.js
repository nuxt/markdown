import revert from 'mdast-util-to-hast/lib/revert'
import all from 'mdast-util-to-hast/lib/all'
import normalize from 'mdurl/encode'

export default function linkReference (h, node) {
  const def = h.definition(node.identifier)

  if (!def) {
    return revert(h, node)
  }

  const props = { href: normalize(def.url || '') }

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return h(node, 'a', props, all(h, node))
}
