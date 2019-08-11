
import u from 'unist-builder'
import wrap from 'mdast-util-to-hast/lib/wrap'
import all from 'mdast-util-to-hast/lib/all'

export default function listItem (h, node, parent) {
  const children = node.children
  const head = children[0]
  const raw = all(h, node)
  const loose = parent ? listLoose(parent) : listItemLoose(node)
  const props = {}
  let result
  let container
  let index
  let length
  let child

  // Tight lists should not render `paragraph` nodes as `p` elements.
  if (loose) {
    result = raw
  } else {
    result = []
    length = raw.length
    index = -1

    while (++index < length) {
      child = raw[index]

      if (child.tagName === 'p') {
        result = result.concat(child.children)
      } else {
        result.push(child)
      }
    }
  }

  if (typeof node.checked === 'boolean') {
    if (loose && (!head || head.type !== 'paragraph')) {
      result.unshift(h(null, 'p', []))
    }

    container = loose ? result[0].children : result

    if (container.length !== 0) {
      container.unshift(u('text', ' '))
    }

    container.unshift(
      h(null, 'input', {
        type: 'checkbox',
        checked: node.checked,
        disabled: true
      })
    )

    // According to github-markdown-css, this class hides bullet.
    // See: <https://github.com/sindresorhus/github-markdown-css>.
    props.className = ['task-list-item']
  }

  if (loose && result.length !== 0) {
    result = wrap(result, true)
  }

  return h(node, 'li', props, result)
}

function listLoose (node) {
  let loose = node.spread
  const children = node.children
  const length = children.length
  let index = -1

  while (!loose && ++index < length) {
    loose = listItemLoose(children[index])
  }

  return loose
}

function listItemLoose (node) {
  const spread = node.spread

  return spread === undefined || spread === null
    ? node.children.length > 1
    : spread
}
