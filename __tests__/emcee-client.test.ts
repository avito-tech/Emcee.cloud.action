/**
 * Unit tests for the emcee-client functionality, src/emcee-client.ts
 */

import * as client from '../src/emcee-client'
import { mock } from 'node:test'
import * as fs from 'fs'

// Mock internal methods
const fetchMock = jest.spyOn(global, 'fetch')

describe('emcee-client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mock.reset()
  })

  it('upload file', async () => {
    fetchMock.mockImplementation(async () => {
      return new Response('{}', { status: 200 })
    })

    await client.uploadFile('./__tests__/test.txt')

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('download reports first attempt success', async () => {
    fetchMock.mockImplementation(async () => {
      return new Response('{}', { status: 200 })
    })

    await client.downloadReports('', ['junit'], 0)
    fs.unlinkSync('./emcee_artifacts/junit')

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('download reports second attempt success', async () => {
    fetchMock.mockImplementationOnce(async () => {
      return new Response('{"error":"not ready"}', {
        status: 200,
        headers: { 'content-type': 'application/json' }
      })
    })
    fetchMock.mockImplementationOnce(async () => {
      return new Response('{}', { status: 200 })
    })

    await client.downloadReports('', ['junit'], 0)
    fs.unlinkSync('./emcee_artifacts/junit')

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('download reports unlnown error', async () => {
    fetchMock.mockImplementationOnce(async () => {
      return new Response('{"error":"error"}', {
        status: 200,
        headers: { 'content-type': 'application/json' }
      })
    })

    await client.downloadReports('', ['junit'], 0)

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
