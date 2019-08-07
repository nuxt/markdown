
// Parses the value defined next to 3 back ticks
// in a codeblock and set line-highlights or filename from it
export function parseThematicBlock(lang) {
  if (!lang) {
    return {
      lang: null,
      lineHighlights: null,
      fileName: null
    }
  }

  const tokens = lang.split('{')
  const language = tokens[0].match(/^[^ \t]+(?=[ \t]|$)/)

  return {
    lang: language ? `language-${tokens[0].match(/^[^ \t]+(?=[ \t]|$)/)}` : null,
    lineHighlights: tokens[1] ? tokens[1].replace('}', '') : null,
    fileName: tokens[2] ? tokens[2].replace('}', '') : null
  }
}


// Safely escape {{ }} in code blocks using zero-width whitespace
function escapeVueInMarkdown (raw) {
  let c
  let i = 0
  let escaped = false
  let r = ''
  for (i = 0; i < raw.length; i++) {
    c = raw.charAt(i)
    if (c === '`' && raw.slice(i, i + 3) === '```' && raw.charCodeAt(i - 1) !== 92) {
      escaped = !escaped
      r += raw.slice(i, i + 3)
      i += 2
      continue
    } else if (c === '\`' && raw.charCodeAt(i - 1) !== 92) {
      escaped = !escaped
      r += c
      continue
    }
    if (!escaped) {
      r += c
    } else if (c === '{' && raw.charAt(i + 1) === '{' && raw.charCodeAt(i - 1) !== 92) {
      i += 1
      r += '{\u200B{' // zero width white space character
    } else {
      r += c
    }
  }
  return r
}

export default {
  parseThematicBlock,
  escapeVueInMarkdown
}
