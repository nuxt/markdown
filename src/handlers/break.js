import u from 'unist-builder'

export default function hardBreak(h, node) {
  return [h(node, 'br'), u('text', '\n')]
}
