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

## Advanced

```js
import Markdown from '@nuxt/markdown'
import remarkContainer from 'remark-container'

const md = new Markdown({
  extend({ layers }) {
    layers['remark-container'] = remarkContainer
  }
})

const contents = await md.toHTML(markdownSourceString)
```
