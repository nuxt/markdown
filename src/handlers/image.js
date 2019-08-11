import normalize from 'mdurl/encode'

export default function image (h, node) {
  const props = {
    src: normalize(node.url),
    alt: node.alt
  }

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  return h(node, 'img', props)
}
