import all from 'mdast-util-to-hast/lib/all'

export default function emphasis(h, node) {
  return h(node, 'em', all(h, node))
}
