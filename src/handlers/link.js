import all from 'mdast-util-to-hast/lib/all'
import normalize from 'mdurl/encode'

export default function link (h, node) {
  let tagName
  const url = normalize(node.url)
  const props = {}

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  if (url.startsWith('#') || url.match(/^https?:\/\//)) {
    props.href = url
    tagName = 'a'
  } else {
    props.to = url
    tagName = 'nuxt-link'
    props['data-press-link'] = 'true'
  }

  return h(node, tagName, props, all(h, node))
}
