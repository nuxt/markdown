# @nuxt/markdown

A Nuxt-flavoured fork of [`@dimerapp/markdown`](https://github.com/dimerapp/markdown) that features granular control [unified](https://github.com/unifiedjs/unified) stream.

## Install

```sh
npm i @nuxt/markdown --save
```

## Usage

```js
import Markdown from '@nuxt/markdown'

const md = new Markdown({ toc: false, sanitize: false })
const contents = await md.toHTML(markdownSourceString)
```

## Processing layers

```js
import Markdown from '@nuxt/markdown'
import remarkContainer from 'remark-container'

const md = new Markdown({
  extend({ layers }) {
    layers['remark-container'] = remarkContainer
  }
})

const rendered = await md.toMarkup(markdownSourceString)
```

Assigning is equivalent to **pushing** to the **last second position** of the internal `layers` Array. 

This is because the last step is `rehype-stringify`, responsible for the final HTML output, but we still want to be able to customize/remove that if needed.

You can also use Array methods directly:

```js
const md = new Markdown({
  extend({ layers }) {
    layers.splice(pos, 0, ['remark-container', remarkContainer])
  }
})
```

This is the default `layers` Array provided to a `@nuxt/markdown` instance:

```js
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
```

Each layer begins with an arbitrary id, to make addressing specific layers easier.

## Custom remark-rehype handlers

You can also pass in a `handlers` object to the `Markdown` constructor to define custom [remark-rehype](https://github.com/remarkjs/remark-rehype) handlers.

See a [list of available overridable handlers here](https://github.com/nuxt/markdown/tree/develop/src/handlers).

## Adding macros

**@nuxt/markdown** includes [remark-macro](https://github.com/dimerapp/remark-macro), a nifty library that adds macro support to Markdown files. To add macros, use the `extend()` function like in the previous examples:

```js
import Markdown from '@nuxt/markdown'

const md = new Markdown({
  extend({ macros }) {
    macros.alert = (content, props, { transformer, eat }) => {
      return {
        type: 'AlertNode',
        data: {
          hName: 'div',
          hClassNames: ['alert alert-note'],
          hChildren: transformer.tokenizeBlock(content, eat.now())
        }
      } 
    }
  }
})

const markdown = `
# Hello world

[alert]
This is an alert
[/alert]
`

const rendered = await md.toMarkup(markdown)
```

Example taken from [dimerapp/remark-macro](https://github.com/dimerapp/remark-macro).

## NuxtPress roadmap

@nuxt/markdown was created mainly for [NuxtPress](https://nuxt.press) and is part of its **[roadmap](https://nuxt.press/en/roadmap/#roadmap)**.
