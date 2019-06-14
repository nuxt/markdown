const normalize = require('mdurl/encode')

function link(h, node) {
  let tagName
  const url = normalize(node.url)
  const props = {}

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  if (url.startsWith('#')) {
    props['href'] = url
    tagName = 'a'
  } else {
    props['to'] = url
    tagName = 'nuxt-link'    
  }

  return h(node.position, tagName, props)
}

module.exports = link
