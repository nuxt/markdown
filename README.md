# @nuxt/markdown

A Nuxt-flavoured fork of [`@dimerapp/markdown`](https://github.com/dimerapp/markdown) that features granular control [unified](https://github.com/unifiedjs/unified) stream.

## Install

```sh
npm i @nuxt/markdown --save
```

## Usage

```js
import Markdown from '@nuxt/markdown'

const md = new Markdown()
const {
  toc, // Table Of Content
  body, // JSON AST generated of markdown
  excerpt, // JSON AST generated of excerpt section of markdown
} = await md.toJSON(markdownSourceString)
```

## Options

```js
import Markdown from '@nuxt/markdown'
import remarkContainer from 'remark-container'

// Create Markdown instance with default options
const md = new Markdown({
  tocTags: ['h2', 'h3'],
  tocDepth: 3,
  remarkPlugins: [
    'remark-squeeze-paragraphs',
    'remark-slug',
    'remark-autolink-headings',
    'remark-external-links',
    ['remark-footnotes', { /* remark-footnotes */ }],
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
})

const json = await md.toJSON(markdownSourceString)
```