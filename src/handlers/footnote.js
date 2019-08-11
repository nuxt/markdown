import footnoteReference from './footnote-reference'

export default function footnote (h, node) {
  const footnoteById = h.footnoteById
  const footnoteOrder = h.footnoteOrder
  let identifier = 1

  while (identifier in footnoteById) {
    identifier++
  }

  identifier = String(identifier)

  // No need to check if `identifier` exists in `footnoteOrder`, it’s guaranteed
  // to not exist because we just generated it.
  footnoteOrder.push(identifier)

  footnoteById[identifier] = {
    identifier,
    type: 'footnoteDefinition',
    children: [{ type: 'paragraph', children: node.children }],
    position: node.position
  }

  return footnoteReference(h, {
    identifier,
    type: 'footnoteReference',
    position: node.position
  })
}
