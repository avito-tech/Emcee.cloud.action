/**
 * Unit tests for the params functionality, src/params.ts
 */

import { parseParams, toArray, toMap } from '../src/params'
import * as core from '@actions/core'

const getInputMock = jest.spyOn(core, 'getInput')
const getBooleanInputMock = jest.spyOn(core, 'getBooleanInput')

describe('params', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'platform':
          return 'android'
        default:
          return '27'
      }
    })
  })
  getBooleanInputMock.mockImplementation(() => true)

  it.each([
    ['1,2,3', ['1', '2', '3']],
    ['1 ,  2, 3', ['1', '2', '3']]
  ])('%p toArray', async (str: string, expected) => {
    expect(toArray(str)).toEqual(expected)
  })
  it.each([
    [
      'ENV1=1,ENV2=2',
      new Map([
        ['ENV1', '1'],
        ['ENV2', '2']
      ])
    ],
    [
      'ENV1=1,     ENV2=2',
      new Map([
        ['ENV1', '1'],
        ['ENV2', '2']
      ])
    ]
  ])('%p toMap', async (str: string, expected) => {
    expect(toMap(str)).toEqual(expected)
  })

  it('params android', async () => {
    const params = parseParams()

    expect(params.deviceOs).toEqual(27)
  })
})
