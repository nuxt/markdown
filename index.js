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

const {
  checklist,
  relativeLinks,
  toc
} = require('./src/transformers')

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
  getStream () {
    const stream = unified()
      .use(markdown)
      .use(toc, this.options)
      .use(relativeLinks, this.options)
      .use(slug)
      .use(headings)
      .use(macroEngine.transformer)
      .use(squeezeParagraphs)
      .use(checklist, this.options)
      .use(remark2rehype, {
        allowDangerousHTML: true,
        handlers: this.settings.handlers
      })
      .use(rehypeRaw)
      .use(minifyWhiteSpace)
    return this.options.sanitize
      ? stream.use(sanitize, this.settings.sanitize)
      : stream
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