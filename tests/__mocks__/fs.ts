import path from 'path'
import fs from 'fs'

// https://jestjs.io/docs/en/manual-mocks#examples

const fsMock = jest.genMockFromModule<typeof fs>('fs')

const MOCK_FILES = {
  'path/to/config-1.json': JSON.stringify(
    require('../__fixtures__/grant.config.json')
  ),
  'path/to/files/error.json': 'malformedJSon'
}

let mockFiles = Object.create(null)

function __setMockFiles(newMockFiles: { [key: string]: string }): void {
  mockFiles = Object.create(null)
  for (const file in newMockFiles) {
    const dir = path.dirname(file)

    if (!mockFiles[dir]) {
      mockFiles[dir] = {}
    }
    mockFiles[dir][path.basename(file)] = newMockFiles[file]
  }
}

function readFileSync(filePath: string): void {
  const dir = path.dirname(filePath)
  const file = path.basename(filePath)
  if (mockFiles[dir] && mockFiles[dir][file]) return mockFiles[dir][file]
  throw new Error('file not found')
}

__setMockFiles(MOCK_FILES)
;(fsMock as any).readFileSync = readFileSync

module.exports = fsMock
