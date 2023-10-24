/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import * as params from '../src/params'
import * as artifacts from '../src/artifacts'
import * as client from '../src/emcee-client'
import * as waiter from '../src/waiter'
import { DefaultParams } from './data'

// Mock the GitHub Actions core library
const setOutputMock = jest.spyOn(core, 'setOutput')
const setFailedMock = jest.spyOn(core, 'setFailed')

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock internal methods
const paramsMock = jest.spyOn(params, 'parseParams')
const artifactsMock = jest.spyOn(artifacts, 'prepareArtifacts')
const createRunMock = jest.spyOn(client, 'createRun')
const startRunMock = jest.spyOn(client, 'startRun')
const downloadReportMock = jest.spyOn(client, 'downloadReports')
const waiterMock = jest.spyOn(waiter, 'waitForRunEnd')

describe('action', () => {
  const runId = 'run_id'
  const jobId = 'job_1'
  const reportPath = './local/emcee'
  beforeEach(() => {
    jest.clearAllMocks()
    artifactsMock.mockImplementation(async () => [])
    createRunMock.mockImplementation(async () => runId)
    startRunMock.mockImplementation(async () => [jobId])
    waiterMock.mockImplementation(async () => {})
    downloadReportMock.mockImplementation(async () => reportPath)
  })

  it('action success without waiting', async () => {
    paramsMock.mockImplementation(() => DefaultParams)

    await main.run()

    expect(runMock).toHaveReturned()
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'run_id',
      expect.stringMatching(runId)
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      2,
      'run_url',
      expect.stringMatching(`https://emcee.cloud/run/${runId}`)
    )
    expect(waiterMock).not.toHaveBeenCalled()
  })

  it('action success with waiting and report', async () => {
    const param = { ...DefaultParams, waitForEnd: true }
    paramsMock.mockImplementation(() => param)

    await main.run()

    expect(runMock).toHaveReturned()
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'reports_path',
      expect.stringMatching(reportPath)
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      2,
      'run_id',
      expect.stringMatching(runId)
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      3,
      'run_url',
      expect.stringMatching(`https://emcee.cloud/run/${runId}`)
    )
    expect(waiterMock).toHaveBeenCalled()
  })

  it('action success with waiting and no report', async () => {
    const param = { ...DefaultParams, waitForEnd: true, downloadReports: [] }
    paramsMock.mockImplementation(() => param)

    await main.run()

    expect(runMock).toHaveReturned()
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'run_id',
      expect.stringMatching(runId)
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      2,
      'run_url',
      expect.stringMatching(`https://emcee.cloud/run/${runId}`)
    )
    expect(waiterMock).toHaveBeenCalled()
    expect(downloadReportMock).not.toHaveBeenCalled()
  })

  it('action error', async () => {
    const param = { ...DefaultParams, waitForEnd: true, downloadReports: [] }
    paramsMock.mockImplementation(() => param)
    setFailedMock.mockImplementationOnce(() => {})

    const err = new TypeError('test error')
    createRunMock.mockImplementation(async () => {
      throw err
    })

    await main.run()

    expect(runMock).toHaveReturned()
    expect(setFailedMock).toHaveBeenCalledWith(err.message)
  })
})
