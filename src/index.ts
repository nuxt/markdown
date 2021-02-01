import defu from 'defu'
import matter from 'gray-matter'
import unified from 'unified'
import parse from 'remark-parse'
import remark2rehype from 'remark-rehype'

import handlers from './handlers'
import jsonCompiler from './compilers/json'

import { MarkdownOptions, HighlighterFactory, Highlighter, JSONContent } from './types'
import { processMarkdownPlugins } from './handlers/utils'


const defaultOptions: MarkdownOptions = {
  tocTags: ['h2', 'h3'],
  tocDepth: 3,
  remarkPlugins: [
    'remark-squeeze-paragraphs',
    'remark-slug',
    'remark-autolink-headings',
    'remark-external-links',
    'remark-footnotes',
    'remark-gfm'
  ],
  rehypePlugins: [
    'rehype-sort-attribute-values',
    'rehype-sort-attributes',
    'rehype-raw'
  ],
  prism: {
    theme: 'prismjs/themes/prism.css'
  }
}

class Markdown {
  options: MarkdownOptions
  constructor (options : Partial<MarkdownOptions> = {}) {
    this.options = defu(options, defaultOptions) as MarkdownOptions

    options.rehypePlugins = processMarkdownPlugins('rehype', this.options)
    options.remarkPlugins = processMarkdownPlugins('remark', this.options)
  }

  processPluginsFor (type: "remark" | "rehype", stream: unified.Processor<unified.Settings>) {
    // @ts-ignore
    for (const { instance, options } of this.options[`${type}Plugins`]) {
      stream = stream.use(instance, options)
    }

    return stream
  }

  flattenNodeText (node: JSONContent): string {
    if (node.type === 'text') {
      return node.value
    } else {
      return node.children.reduce((text, child) => {
        return text.concat(this.flattenNodeText(child))
      }, '')
    }
  }

  /**
   * Generate table of contents
   * @param {object} body - JSON AST generated from markdown.
   * @returns {array} List of headers
   */
  generateToc (body: JSONContent) {
    const { tocTags } = this.options

    return body.children.filter((node) => tocTags.includes(node.tag)).map((node) => {
      const id = node.props.id

      const depth = Object.keys(this.options.tocTags).indexOf(node.tag) + 2

      const text = this.flattenNodeText(node)

      return {
        id,
        depth,
        text
      }
    })
  }

  /**
   * Generate json body
   * @param {string} content - markdown string
   * @returns {object} JSON AST body
   */
  async generateBody (content: string): Promise<JSONContent> {
    let { highlighter } = this.options
    if (typeof highlighter === 'function' && highlighter.length === 0) {
      highlighter = await (highlighter as HighlighterFactory)()
    }
    
    return new Promise((resolve, reject) => {
      let stream = unified().use(parse)

      stream = this.processPluginsFor('remark', stream)
      stream = stream.use(remark2rehype, {
        handlers: handlers(highlighter as Highlighter),
        allowDangerousHtml: true
      })
      stream = this.processPluginsFor('rehype', stream)

      stream
        .use(jsonCompiler)
        .process(content, (error, file) => {
          /* istanbul ignore if */
          if (error) {
            return reject(error)
          }

          resolve(file.contents as object as JSONContent)
        })
    })
  }

  /**
   * Generate text excerpt summary
   * @param {string} excerptContent - JSON AST generated from excerpt markdown.
   * @returns {string} concatinated excerpt
   */
  generateDescription (excerptContent: JSONContent) {
    return this.flattenNodeText(excerptContent)
  }

  /**
   * Converts markdown document to it's JSON structure.
   * @param {string} file - Markdown file
   * @return {Object}
   */
  async toJSON (file: string | Buffer) {
    const { data, content, ...rest } = matter(file, { excerpt: true, excerpt_separator: '<!--more-->' })

    // Compile markdown from file content to JSON
    const body = await this.generateBody(content)
    // Generate toc from body
    const toc = this.generateToc(body)

    let excerpt
    let description
    if (rest.excerpt) {
      excerpt = await this.generateBody(rest.excerpt)
      description = this.generateDescription(excerpt)
    }

    return {
      description,
      ...data,
      toc,
      body,
      text: content,
      excerpt
    }
  }
}

export default Markdown
