import normalize from 'mdurl/encode'
import revert from 'mdast-util-to-hast/lib/revert'

export default function imageReference (h, node) {
  const def = h.definition(node.identifier)

  if (!def) {
    return revert(h, node)
  }

  const props = { src: normalize(def.url || ''), alt: node.alt }

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return h(node, 'img', props)
}
