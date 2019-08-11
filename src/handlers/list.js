import all from 'mdast-util-to-hast/lib/all'
'use strict'

module.exports = list

const wrap = require('../wrap')

function list (h, node) {
  const props = {}
  const name = node.ordered ? 'ol' : 'ul'
  let items
  let index = -1
  let length

  if (typeof node.start === 'number' && node.start !== 1) {
    props.start = node.start
  }

  items = all(h, node)
  length = items.length

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
