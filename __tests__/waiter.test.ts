/**
 * Unit tests for the waiter functionality, src/waiter.ts
 */

import * as client from '../src/emcee-client'
import { TestJobStatus } from '../src/types'
import { waitForRunEnd } from '../src/waiter'

// Mock internal methods
const getJobDataMock = jest.spyOn(client, 'getJobData')

describe('waiter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('already finished', async () => {
    getJobDataMock.mockImplementation(async job => {
      return { status: TestJobStatus.finished, jobId: job }
    })

    await waitForRunEnd(['job_id'], 0)

    expect(getJobDataMock).toHaveBeenCalledTimes(1)
  })

  it('no jobs', async () => {
    getJobDataMock.mockImplementation(async job => {
      return { status: TestJobStatus.finished, jobId: job }
    })

    await waitForRunEnd([], 0)

    expect(getJobDataMock).not.toHaveBeenCalled()
  })

  it('finished after one wait', async () => {
    getJobDataMock.mockImplementationOnce(async job => {
      return { status: TestJobStatus.inProgress, jobId: job }
    })
    getJobDataMock.mockImplementationOnce(async job => {
      return { status: TestJobStatus.finished, jobId: job }
    })

    await waitForRunEnd(['job_id'], 0)

    expect(getJobDataMock).toHaveBeenCalledTimes(2)
  })

  it('finished after 5 error', async () => {
    const err = new TypeError('test error')
    getJobDataMock.mockImplementation(async () => {
      throw err
    })

    await expect(waitForRunEnd(['job_id'], 0)).rejects.toThrow(err)
    expect(getJobDataMock).toHaveBeenCalledTimes(5)
  })
})
