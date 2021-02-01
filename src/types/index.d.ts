export interface HighlighterArg4 {
    h: any
    node: any
    u: any
}
export type Highlighter = (rawCode: string, lang: string, options: any, arg4: HighlighterArg4) => string | Promise<string>
export type HighlighterFactory = () => Highlighter | Promise<Highlighter>
  
export interface MarkdownOptions {
    tocDepth: number
    highlighter?: Highlighter | HighlighterFactory
    rehypePlugins: Array<any>
    remarkPlugins: Array<any>
    tocTags: Array<string>
    prism: {
      theme: string
    }
}

export interface JSONContent {
  type: string,
  tag: string,
  props: {
    [key: string]: any
  },
  value: string
  children: Array<JSONContent>
}