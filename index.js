// Based on dimer-markdown
// By Harminder Virk <virk@adonisjs.com>

const unified = require('unified')
const markdown = require('remark-parse')
const slug = require('remark-slug')
const headings = require('remark-autolink-headings')
const squeezeParagraphs = require('remark-squeeze-paragraphs')
const remark2rehype = require('remark-rehype')
const rehypeRaw = require('rehype-raw')
const rehypePrism = require('@mapbox/rehype-prism')
const sanitize = require('rehype-sanitize')
const macroEngine = require('remark-macro')()
const headingHandler = require('./src/handlers/_heading')
const { checklist, relativeLinks } = require('./src/transformers')
require('./src/macros')(macroEngine)

// Safely escape {{ }} in code blocks using zero-width whitespace
function escapeVueInMarkdown(raw) {
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

// Proceses the markdown and output it to native HTML or components.
class NuxtMarkdownProcessor {
  constructor (markdown, options) {
    // backwards compatibility but tests still fails due to different white space handling
    if (
      arguments.length === 1 &&
      typeof markdown === 'object' &&
      (!markdown.constructor || markdown.constructor.name !== 'VFile')
    ) {
      options = markdown
      markdown = undefined
    }

    this.markdown = markdown

    this.settings = {
      sanitize: require('./sanitize.json'),
      handlers: require('./src/handlers')
    }

    this.options = options || {}
  }

  // Register a custom macro with the markdown engine
  static addMacro (name, callback, inline) {
    macroEngine.addMacro(name, callback, inline)
  }

  _createPreset ({ settings = {}, handlers } = {}) {
    const _sanitize = this.options.sanitize ? [[sanitize, this.settings.sanitize]] : []

    if (this.options.toc) {
      handlers = {
        ...handlers,
        heading: headingHandler.bind(this)
      }
    }

    return {
      settings,
      plugins: [
        markdown,
        [relativeLinks, this.options],
        slug,
        headings,
        macroEngine.transformer,
        squeezeParagraphs,
        [checklist, this.options],
        [remark2rehype, {
          allowDangerousHTML: true,
          handlers: {
            ...this.settings.handlers,
            ...handlers
          }
        }],
        rehypeRaw,
        [rehypePrism, { ignoreMissing: true }],
        ..._sanitize
      ]
    }
  }

  _tocReset () {
    this.toc = []

    return this
  }

  createProcessor (config) {
    if (!this.preset) {
      this.preset = this._createPreset(config)
    }

    this.processor = unified().use(this.preset)

    return new Proxy(this, {
      get (target, prop) {
        if (target.processor[prop]) {
          return target.processor[prop]
        }

        return target[prop]
      }
    })
  }

  newProcessor () {
    if (!this.processor) {
      this.createProcessor()
    }

    return this.processor()
  }

  async toMarkup (markdown) {
    markdown = escapeVueInMarkdown(markdown)
    this._tocReset()

    const { contents: html } = await this.toHTML(markdown)

    return { html, toc: this.toc }
  }

  // Converts markdown to HTML
  async toHTML (markdown) {
    markdown = escapeVueInMarkdown(markdown)
    const file = await this.newProcessor()
      .use(require('./src/compilers/html'))
      .process(markdown || this.markdown)

    return file
  }

  // Converts the markdown document to it's JSON structure.
  // Super helpful for JSON API's
  async toJSON (markdown) {
    const file = await this.newProcessor()
      .use(require('./src/compilers/json'))
      .process(markdown || this.markdown)

    return file
  }
}

module.exports = NuxtMarkdownProcessor
