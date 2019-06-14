const Markdown = require('./index')

const source = `
# foobar

foobar <nuxt-link to="/foobar">foobar</nuxt-link>

[foobar][xx]

[xx]: https://nuxtjs.org

<random-component :data="data">
</random-component>

## other header

<ol>foobar</ol>
`

;(async function () {
  const md = new Markdown(source, { skipToc: true })
  const dimerHTML = await md.toHTML()
  console.log(dimerHTML.contents)
})()