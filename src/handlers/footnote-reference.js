
import u from 'unist-builder'

export default function footnoteReference (h, node) {
  const footnoteOrder = h.footnoteOrder
  const identifier = node.identifier

  if (!footnoteOrder.includes(identifier)) {
    footnoteOrder.push(identifier)
  }

  return h(node.position, 'sup', { id: 'fnref-' + identifier }, [
    h(node, 'a', { href: '#fn-' + identifier, className: ['footnote-ref'] }, [
      u('text', node.label || identifier)
    ])
  ])
}
