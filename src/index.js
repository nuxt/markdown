
// NuxtMarkdown
//
// Based on dimer-markdown by Harminder Virk <virk@adonisjs.com>

import unified from 'unified'
import markdown from 'remark-parse'
import slug from 'remark-slug'
import autolinkHeadings from './headings'
import squeezeParagraphs from 'remark-squeeze-paragraphs'
import remark2rehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypePrism from '@mapbox/rehype-prism'
import sanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkMacro from 'remark-macro'
import headingHandler from './src/handlers/_heading'

const macroEngine = remarkMacro()

// Proceses the markdown and output it to native HTML or components.
export default class NuxtMarkdownProcessor {
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

  createPreset ({ settings = {}, handlers } = {}) {
    const _sanitize = this.options.sanitize
      ? [[sanitize, this.settings.sanitize]]
      : []

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
        slug,
        autolinkHeadings,
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

  resetToc () {
    this.toc = []
    return this
  }

  createProcessor (config) {
    if (!this.preset) {
      this.preset = this.createPreset(config)
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
    this._tocReset()

    const { contents: html } = await this.toHTML(markdown)
    return { html, toc: this.toc }
  }

  // Converts markdown to HTML
  async toHTML (markdown) {
    markdown = escapeVueInMarkdown(markdown || this.markdown)
    const file = await this.newProcessor()
      .use(rehypeStringify)
      .process(markdown)

    return file
  }

}
