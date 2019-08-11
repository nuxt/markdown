import all from 'mdast-util-to-hast/lib/all'

export default function strong (h, node) {
  return h(node, 'strong', all(h, node))
}
