import collapse from 'collapse-white-space'
import u from 'unist-builder'

export default function inlineCode (h, node) {
  return h(node, 'code', [u('text', collapse(node.value))])
}
