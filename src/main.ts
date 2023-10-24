import * as core from '@actions/core'
import { parseParams } from './params'
import { prepareArtifacts } from './artifacts'
import { ArtifactType, Platform } from './types'
import { createRun, downloadReports, startRun } from './emcee-client'
import { waitForRunEnd } from './waiter'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.info('Parsing input params')
    const params = parseParams()

    core.info('Preparing artifacts')
    const isIosRun = params.platform === Platform.ios
    const apps = await prepareArtifacts(params.apps, ArtifactType.appArchive)
    const tests = await prepareArtifacts(
      params.tests,
      ArtifactType.testsArchive
    )
    const runners = await prepareArtifacts(
      params.runners,
      isIosRun ? ArtifactType.runnerArchive : ArtifactType.runnerClass
    )
    const plans =
      isIosRun && params.plan != null
        ? await prepareArtifacts([params.plan], ArtifactType.xcTestRun)
        : []

    core.info('Creating emcee.cloud Test Run')
    const runId = await createRun({
      platform: params.platform,
      artifacts: apps.concat(tests).concat(runners).concat(plans),
      deviceOsVersion: params.deviceOs,
      environment: params.envs
    })

    core.info(`Starting emcee.cloud Test Run. id: ${runId}`)
    const jobs = await startRun(runId)

    if (params.waitForEnd) {
      core.info(`Waiting for the run to complete. id: ${runId}`)
      await waitForRunEnd(jobs)
      if (params.downloadReports.length !== 0) {
        core.info('Downloading reports')
        const reportsPath = await downloadReports(runId, params.downloadReports)
        core.setOutput('reports_path', reportsPath)
      }
    }

    core.setOutput('run_id', runId)
    core.setOutput('run_url', `https://emcee.cloud/run/${runId}`)
    core.info('Action completed')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
