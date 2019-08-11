import all from 'mdast-util-to-hast/lib/all'
import wrap from 'mdast-util-to-hast/lib/wrap'
import u from 'unist-builder'

export default function root (h, node) {
  return h.augment(node, u('root', wrap(all(h, node))))
}
