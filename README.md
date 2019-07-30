# @nuxt/markdown

A Nuxt-flavoured fork of [`@dimerapp/markdown`][dm], based on the
[`unified`](https://unified.js.org/) set of utilities.

[dm]: https://github.com/dimerapp/markdown

## Differences between dimerapp/markdown

- Most transformers are removed (only `checklist` and `relativeLinks` kept)
- **Code block** handler removed, **heading**, **link** and **image** handlers added
- HTML sanitization is now configurable via a flag
- Added syntax highlighting via [`rehype-prism`](https://github.com/mapbox/rehype-prism)
- Vue markup is escaled with **zero-width white spaces** in code blocks
- Added API that allows for custom processor steps

## Install and usage examples

```sh
npm i @nuxt/markdown --save
```

### Basic processor

```js
import Markdown from '@nuxt/markdown'

const md = Markdown({ skipToc: true, sanitize: false }).createProcessor()
const { contents } = await md.toHTML(markdownSourceString)
```

### Custom stream

```js
import customContainer from 'remark-container'

const md = Markdown().createProcessor()
md.use(customContainer)
const { contents } = await md.toHTML(markdownSourceString)
```
