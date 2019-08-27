import Markdown from '../../src'
import { getFixture } from '../utils'

describe('toc', () => {
  test('no error on undefined', async () => {
    const content = undefined

    const md = new Markdown({ toc: true, sanitize: false })
    const { html, toc } = await md.toMarkup(content)

    expect(toc).toBeInstanceOf(Array)
    expect(toc.length).toEqual(0)
    expect(html).toEqual(``)
  })

  test('basic toc', async () => {
    const content = await getFixture('basic.md')

    const md = new Markdown({ toc: false, sanitize: false })
    const { html, toc } = await md.toMarkup(content)

    expect(toc).toBeUndefined()
    expect(html).toEqual(`<h1 id="hello-world"><a href="#hello-world" aria-hidden="true"><span class="icon icon-link"></span></a>Hello world</h1>
<p>Go to <nuxt-link to="/subpage" data-press-link="true">/subpage</nuxt-link></p>
<p>Go to <nuxt-link to="/subpage/other" data-press-link="true">/subpage/other</nuxt-link></p>
<p>Msg: {{ $press.source.someText }}</p>
<p>Msg: <strong>{{ $press.source.someOtherText }}</strong></p>`)

  })
})
