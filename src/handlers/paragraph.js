import all from 'mdast-util-to-hast/lib/all'

export default function paragraph (h, node) {
  return h(node, 'p', all(h, node))
}
