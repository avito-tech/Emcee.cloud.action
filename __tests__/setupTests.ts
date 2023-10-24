import * as core from '@actions/core'

beforeAll(() => {
  jest.spyOn(core, 'debug').mockImplementation(() => {})
  jest.spyOn(core, 'info').mockImplementation(() => {})
})
