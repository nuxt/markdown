import all from 'mdast-util-to-hast/lib/all'
import wrap from 'mdast-util-to-hast/lib/wrap'

export default function list (h, node) {
  const props = {}
  const name = node.ordered ? 'ol' : 'ul'
  let index = -1

  if (typeof node.start === 'number' && node.start !== 1) {
    props.start = node.start
  }

  const items = all(h, node)
  const length = items.length

  // Like GitHub, add a class for custom styling.
  while (++index < length) {
    if (
      items[index].properties.className &&
      items[index].properties.className.includes('task-list-item')
    ) {
      props.className = ['contains-task-list']
      break
    }
  }

  return h(node, name, props, wrap(items, true))
}
