/**
 * Unit tests for the utils functionality, src/utils.ts
 */

import { isURL, pathToFileName } from '../src/utils'

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it.each([
    ['http://google.com', true],
    ['https://local', true],
    ['local', false],
    ['/local/', false]
  ])('%p isURL %p', async (str: string, expected) => {
    expect(isURL(str)).toEqual(expected)
  })

  it.each([
    ['http://google.com/test#123', '123'],
    ['https://local/test', 'test'],
    ['', '']
  ])('%p pathToFileName %p', async (str: string, expected) => {
    expect(pathToFileName(str)).toEqual(expected)
  })
})
