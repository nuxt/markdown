import all from 'mdast-util-to-hast/lib/all'

function extractText (node) {
  let text = ''
  for (const child of node.children) {
    if (child.children && child.children.length) {
      text += extractText(child)
      continue
    }
    if (!child.value) {
      continue
    }
    text += child.value
  }
  return text
}

export default function heading (h, node) {
  let link

  const _link = node.children.find(c => c.type === 'link')
  if (_link && _link.url.startsWith('#')) {
    link = _link.url
  }

  const text = extractText(node)
  if (this.toc && text && link) {
    this.toc.push([node.depth, text, link])
  }

  return h(node, `h${node.depth}`, all(h, node))
}
