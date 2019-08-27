import fs from 'fs'
import path from 'path'
import util from 'util'

export const readFile = util.promisify(fs.readFile)

export const getFixture = (fixturePath) => readFile(path.join(__dirname, '../fixtures', fixturePath), { encoding: 'utf8' })
