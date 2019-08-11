import u from 'unist-builder'
import trimLines from 'trim-lines'

export default function text (h, node) {
  return h.augment(node, u('text', trimLines(node.value)))
}
