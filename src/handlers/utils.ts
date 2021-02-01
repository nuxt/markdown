const logger = require('consola').withScope('@nuxt/markdown')
import path from 'path'
import { camelCase } from 'change-case'
import { MarkdownOptions } from '../types'

/**
 * Parses the value defined next to 3 back ticks
 * in a codeblock and set line-highlights or
 * filename from it
 *
 * @param {String} lang
 */
export const parseThematicBlock = function (lang: string) {
  /**
   * Language property on node is missing
   */
  if (!lang) {
    return {
      language: null,
      lineHighlights: null,
      fileName: null
    }
  }

  const language = lang.replace(/[{|[](.+)/, '').match(/^[^ \t]+(?=[ \t]|$)/)
  const lineHighlightTokens = lang.replace(/[[](.+)/, '').split('{')
  const filenameTokens = lang.match(/\[(.+)\]/)

  return {
    language: language ? language[0] : null,
    lineHighlights: lineHighlightTokens[1] ? lineHighlightTokens[1].replace(/}.*/, '') : null,
    fileName: Array.isArray(filenameTokens) ? filenameTokens[1] : null
  }
}

const TAG_NAME_REGEXP = /^<\/?([A-Za-z0-9-_]+) ?[^>]*>/
export const getTagName = function (value: string) {
  const result = String(value).match(TAG_NAME_REGEXP)

  return result && result[1]
}

export const processMarkdownPlugins = function (type: "remark" | "rehype", options: MarkdownOptions) {
  const plugins = []

  for (const plugin of (options as any)[`${type}Plugins`]) {
    let name
    let options
    let instance

    if (typeof plugin === 'string') {
      name = plugin
      options = (options as any)[camelCase(name)]
    } else if (Array.isArray(plugin)) {
      [name, options] = plugin
    }

    try {
      instance = require(path.resolve(name))

      plugins.push({ instance, name, options })
    } catch (e) {
      logger.error(e.toString())
    }
  }

  return plugins
}