import Markdown from '../../src'
import { getFixture } from '../utils'

describe('toc', () => {
  test('basic toc', async () => {
    const content = await getFixture('toc.md')

    const md = new Markdown({ toc: true, sanitize: false })
    const { html, toc } = await md.toMarkup(content)

    expect(html).toEqual(`<h1 id="title"><a href="#title" aria-hidden="true"><span class="icon icon-link"></span></a>Title</h1>
<p>Intro</p>
<h2 id="header"><a href="#header" aria-hidden="true"><span class="icon icon-link"></span></a>Header</h2>
<p>Text</p>`)

    expect(toc).toBeInstanceOf(Array)
    expect(toc.length).toBe(2)
    expect(toc).toEqual([
      [1, 'Title', '#title'],
      [2, 'Header', '#header']
    ])
  })
})
