// Based on dimer-markdown
// By Harminder Virk <virk@adonisjs.com>

const unified = require('unified')
const markdown = require('remark-parse')
const slug = require('remark-slug')
const headings = require('remark-autolink-headings')
const squeezeParagraphs = require('remark-squeeze-paragraphs')
const minifyWhiteSpace = require('rehype-minify-whitespace')
const remark2rehype = require('remark-rehype')
const rehypeRaw = require('rehype-raw')
const sanitize = require('rehype-sanitize')
const sortValues = require('rehype-sort-attribute-values')
const sortAttrs = require('rehype-sort-attributes')
const macroEngine = require('remark-macro')()
const all = require('mdast-util-to-hast/lib/all')
const { checklist, relativeLinks } = require('./src/transformers')

require('./src/macros')(macroEngine)

// Proceses the markdown and output it to
// HTML or react components.
class MarkdownProcessor {
  constructor (markdown, options) {
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

  // Returns the stream of mdast
  getStream (handlers = {}) {
    const stream = unified()
      .use(markdown)
      .use(relativeLinks, this.options)
      .use(slug)
      .use(headings)
      .use(macroEngine.transformer)
      .use(squeezeParagraphs)
      .use(checklist, this.options)
      .use(remark2rehype, {
        allowDangerousHTML: true,
        handlers: { ...this.settings.handlers, ...handlers }
      })
      .use(rehypeRaw)
      .use(minifyWhiteSpace)
    return this.options.sanitize
      ? stream.use(sanitize, this.settings.sanitize)
      : stream
  }

  getTocAndMarkup () {
    return new Promise((resolve, reject) => {
      let lastHeader
      const toc = []
      this.getStream({
        heading(h, node) {
          let link
          let text
          for (const child of node.children) {
            switch (child.type) {
              case 'text':
                text = child.value
                break
              case 'link':
                if (child.url.startsWith('#')) {
                  link = child.url
                }
                break
              default:
                break
            }
          }
          if (text && link) {
            toc.push([node.depth, text, link])
          }
          return h(node, `h${node.depth}`, all(h, node))
        }
      })
        .use(require('./src/compilers/html'))
        .process(this.markdown, (error, file) => {
          if (error) {
            return reject(error)
          }
          resolve({ html: file.contents, toc })
        })
    })
  }

  // Converts markdown to HTML
  toHTML () {
    return new Promise((resolve, reject) => {
      this.getStream()
        .use(require('./src/compilers/html'))
        .process(this.markdown, (error, file) => {
          if (error) {
            return reject(error)
          }
          resolve(file)
        })
    })
  }

  // Converts the markdown document to it's JSON structure.
  // Super helpful for JSON API's
  toJSON () {
    return new Promise((resolve, reject) => {
      this.getStream()
        .use(require('./src/compilers/json'))
        .process(this.markdown, (error, file) => {
          if (error) {
            return reject(error)
          }
          resolve(file)
        })
    })
  }
}

module.exports = MarkdownProcessor