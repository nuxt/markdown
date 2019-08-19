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

Assigning is equivalent to **pushing** to the internal layers Array. You can also use Array methods directly:

```js
const md = new Markdown({
  extend({ layers }) {
    layers.push(['remark-container', remarkContainer])
  }
})
```

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
