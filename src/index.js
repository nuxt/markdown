
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
import builtinHandlers from './handlers'
import sanitizeOptions from './sanitize.json'
import { escapeVueInMarkdown } from './utils'

const macroEngine = remarkMacro()
const layers = [
  ['remark-parse', remarkParse],
  ['remark-slug', remarkSlug],
  ['remark-autolink-headings', autolinkHeadings],
  ['remark-macro', macroEngine.transformer],
  ['remark-squeeze-paragraphs', squeezeParagraphs],
  ['remark-rehype', remarkRehype, { allowDangerousHTML: true }],
  ['rehype-raw', rehypeRaw],
  ['rehype-prism', rehypePrism, { ignoreMissing: true }],
  ['rehype-stringify', rehypeStringify]
]

export default class NuxtMarkdown {
  constructor (config = {}) {
    const { toc, sanitize, handlers, extend } = {
      toc: false,
      sanitize: false,
      handlers: {},
      extend: () => {},
      ...config
    }

    this.layers = [ ...layers ]

    const extendLayerProxy = new Proxy(this.layers, {
      get: (_, prop) => {
        if (['push', 'splice', 'unshift', 'shift', 'pop', 'slice'].includes(prop)) {
          return (...args) => this.layers[prop](...args)
        }
        return this.layers.find(l => l[0] === prop)
      },
      set: (_, prop, value) => {
        if (!Array.isArray(value)) {
          value = [prop, value, {}]
        } else {
          value.unshift(prop)
        }
        this.layers.splice(this.layers.length - 1, 0, value)
        return value
      }
    })

    const registerMacroProxy = new Proxy({}, {
      get: (_, name) => {
        if (name === 'inline') {
          return (callback) => {
            macroEngine.addMacro(name, callback, true)
          }
        }
        return (callback) => {
          macroEngine.addMacro(name, callback, false)
        }
      }
    })

    const remarkRehypeOptions = extendLayerProxy['remark-rehype'][2]
    remarkRehypeOptions.handlers = {
      ...builtinHandlers,
      ...handlers
    }

    for (const handler in remarkRehypeOptions.handlers) {
      remarkRehypeOptions.handlers[handler] = remarkRehypeOptions.handlers[handler].bind(this)
    }

    if (sanitize) {
      this.layers.splice(this.layers.length - 1, 0, ['rehype-sanitize', rehypeSanitize, sanitizeOptions])
    }

    this.options = { toc }

    extend({
      layers: extendLayerProxy,
      macros: registerMacroProxy
    })
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
      .use({ plugins: this.layers.map(l => l.slice(1)) })

    return this._processor
  }

  async toMarkup (markdown) {
    // explictly set to false to nothing is added in ./handlers/heading
    this.toc = this.options.toc ? [] : undefined

    let html = ''
    if (markdown) {
      markdown = escapeVueInMarkdown(markdown)

      const { contents } = await this.processor.process(markdown)
      html = contents
    }

    if (this.options.toc) {
      return {
        html,
        toc: this.toc
      }
    }

    return { html }
  }
}
