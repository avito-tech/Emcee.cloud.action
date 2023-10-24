import { type TCreateRunPayload, type TTestJob } from './types'
import * as fs from 'fs'
import * as stream from 'stream'
import { pathToFileName } from './utils'
import * as core from '@actions/core'
import * as path from 'path'
import type * as streamWeb from 'node:stream/web'
import { setTimeout } from 'timers/promises'

const EMCEE_CLOUD_API = 'https://emcee.cloud/api/v1'
const EMCEE_TOKEN = core.getInput('emcee_token')

export const makeServerRequest = async (
  apiPath: string,
  data: object
): Promise<Response> => {
  const response = await fetch(`${EMCEE_CLOUD_API}${apiPath}`, data)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response
}

const makePostRequest = async (
  apiPath: string,
  payload: object
): Promise<Response> => {
  const requestData = {
    method: 'POST',
    headers: {
      cookie: `emcee_token=${EMCEE_TOKEN};`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }
  return await makeServerRequest(apiPath, requestData)
}

export const makeGetRequest = async (apiPath: string): Promise<Response> => {
  const requestData = {
    method: 'GET',
    headers: {
      cookie: `emcee_token=${EMCEE_TOKEN};`
    }
  }
  return await makeServerRequest(apiPath, requestData)
}

export const createRun = async (
  payload: TCreateRunPayload
): Promise<string> => {
  const data = (await (
    await makePostRequest('/run/create', payload)
  ).json()) as {
    runId: string
  }
  return data.runId
}
export const startRun = async (runId: string): Promise<string[]> => {
  const data = (await (
    await makePostRequest('/run/startJob', { runId })
  ).json()) as {
    jobIds: string[]
  }
  return data.jobIds
}

export const getJobData = async (jobId: string): Promise<TTestJob> => {
  const data = (await (
    await makePostRequest('/job/details', { jobId })
  ).json()) as {
    testJob: TTestJob
  }
  return data.testJob
}

export const downloadReports = async (
  runId: string,
  reports: string[],
  timeout = 5000
): Promise<string> => {
  const dirName = 'emcee_artifacts'
  if (!fs.existsSync(dirName)) await fs.promises.mkdir(dirName)

  const reportToDownload = [...reports]
  while (reportToDownload.length !== 0) {
    await setTimeout(timeout)
    const report = reportToDownload.shift() as string
    const res = await makeGetRequest(`/report/getReport/${runId}/${report}`)

    let jsonBody = {}
    if (res.headers.get('content-type') === 'application/json') {
      jsonBody = await res.json()
    }
    if ('error' in jsonBody) {
      const { error } = jsonBody as { error: string }
      if (error.includes('not ready')) {
        core.debug(error)
        reportToDownload.push(report)
      } else {
        core.error(error)
      }
      continue
    }

    const filename = res.headers
      .get('content-disposition')
      ?.split(';')
      ?.pop()
      ?.split('=')
      ?.pop()
    const destination = path.resolve(`./${dirName}`, filename ?? report)
    const fileStream = fs.createWriteStream(destination, { flags: 'wx' })
    await stream.promises.finished(
      stream.Readable.fromWeb(res.body as streamWeb.ReadableStream).pipe(
        fileStream
      )
    )
    core.info(`${report} downloaded`)
  }

  return path.resolve(`./${dirName}`)
}

export const uploadFile = async (filePath: string): Promise<string> => {
  const file = await fs.openAsBlob(filePath)
  const formData = new FormData()

  formData.append('file', file, pathToFileName(filePath))
  const requestData = {
    method: 'POST',
    headers: {
      cookie: `emcee_token=${EMCEE_TOKEN};`
    },
    body: formData
  }
  const data = (await (
    await makeServerRequest('/file/upload', requestData)
  ).json()) as {
    url: string
  }
  return `${data.url}#${pathToFileName(filePath)}`
}
