import path from 'path'
import { readJSONSync } from 'fs-extra'
import commonjsPlugin from 'rollup-plugin-commonjs'
import jsonPlugin from 'rollup-plugin-json'
import autoExternalPlugin from 'rollup-plugin-auto-external'

const rootDir = process.cwd()
const input = 'src/index.js'

const pkg = readJSONSync(path.resolve(rootDir, 'package.json'))
const name = path.basename(pkg.name)

export default {
  input: path.resolve(rootDir, input),
  output: {
    dir: path.resolve(rootDir, 'dist'),
    entryFileNames: `nuxt-${name}.js`,
    chunkFileNames: `nuxt-${name}-[name].js`,
    format: 'cjs',
    preferConst: true
  },
  plugins: [
    autoExternalPlugin(),
    jsonPlugin(),
    commonjsPlugin()
  ]
}
