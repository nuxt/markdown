import all from 'mdast-util-to-hast/lib/all'

export default function strikethrough (h, node) {
  return h(node, 'del', all(h, node))
}
