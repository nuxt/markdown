
// NuxtMarkdown
//
// Based on dimer-markdown by Harminder Virk <virk@adonisjs.com>

import unified from 'unified'
import remarkParse from 'remark-parse'
import remarkSlug from 'remark-slug'
import squeezeParagraphs from 'remark-squeeze-paragraphs'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypePrism from '@mapbox/rehype-prism'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkMacro from 'remark-macro'
import autolinkHeadings from './headings'
import handlers from './handlers'
import sanitizeOptions from './sanitize'
import { escapeVueInMarkdown } from './utils'


export default class NuxtMarkdown {

  static macroEngine = remarkMacro()

  static layers = [
    ['remark-parse', remarkParse],
    ['remark-slug', remarkSlug],
    ['remark-autolink-headings', autolinkHeadings],
    ['remark-macro', NuxtMarkdown.macroEngine.transformer],
    ['remark-squeeze-paragraphs', squeezeParagraphs],
    ['remark-rehype', remarkRehype, { allowDangerousHTML: true }],
    ['rehype-raw', rehypeRaw],
    ['rehype-prism', rehypePrism, { ignoreMissing: true }],
    ['rehype-stringify', rehypeStringify]
  ]

  constructor ({ toc, sanitize, handlers, extend }) {
    this.layers = [ ...this.constructor.layers ]

    const extendLayerProxy = new Proxy(this.layers, {
      get: (_, prop) {
        return this.layers.find(l => l[0] === prop)
      },
      set: (_, prop, value) {
        if (!Array.isArray(value)) {
          value = [prop, value, {}]
        } else {
          value.unshift(prop)
        }
        this.layers.push(value)
        return value
      }
    })

    const registerMacroProxy = new Proxy({}, {
      get: (_, name) => {
        return (callback, inline) => {
          NuxtMarkdown.macroEngine.addMacro(name, callback, inline)
        }
      }
    })

    extendLayerProxy['remark-rehype'][2].handlers = handlers

    if (sanitize) {
      extendLayerProxy['rehype-sanitize'] = [rehypeSanitize, sanitizeOptions]
    }

    this.options = { toc }

    extend({
      layers: extendLayerProxy,
      macros: registerMacroProxy
    })

    return this.processor
  }

  get toc () {
    if (!this.options.toc) {
      return
    }
    return this._toc
  }

  set toc (v) {
    if (!this.options.toc) {
      return
    }
    this._toc = v 
  }
  
  get processor () {
    if (this._processor) {
      return this._processor
    }

    this._processor = unified()
      .use({
        settings: { handlers, ...this.options.sanitize && { sanitize: sanitizeOptions },
        plugins: this.layers.map(l => l.slice(1))
      })

    return this._processor
  }
  
  async toMarkup (markdown) {
    this.toc = []
    markdown = escapeVueInMarkdown(markdown)

    const { contents: html } = await this.processor.process(markdown)

    return { html, ...this.options.toc && { toc: this.toc } }
  }
}
