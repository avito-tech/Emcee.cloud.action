import * as core from '@actions/core'
import { getJobData } from './emcee-client'
import { TestJobStatus } from './types'
import { setTimeout } from 'timers/promises'

export const waitForRunEnd = async (
  jobs: string[],
  timeout = 10000
): Promise<void> => {
  if (jobs.length === 0) {
    return
  }
  let errors = 0
  let finished = false
  core.debug('Waiter started')
  do {
    core.debug(`Waiter errors: ${errors}`)
    core.debug(`Waiter finished: ${finished}`)
    try {
      const statuses = []
      for (const job of jobs) {
        const jobData = await getJobData(job)
        errors = 0
        statuses.push(jobData.status)
        if (
          statuses.length === jobs.length &&
          statuses.every(s => s !== TestJobStatus.inProgress)
        ) {
          finished = true
        }
      }
    } catch (e) {
      errors++
      if (errors >= 5) {
        throw e
      }
      core.debug(`Waiter error: ${e as string}`)
    }
    core.debug(`Waiter: sleep ${timeout / 1000}s`)
    await setTimeout(timeout)
  } while (!finished)
}
