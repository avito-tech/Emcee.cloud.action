import { Platform, type TParams } from './types'
import * as core from '@actions/core'

export const toArray = (str: string): string[] =>
  str.split(',').map(i => i.trim())
export const toMap = (str: string): Map<string, string> => {
  const envs = toArray(str)
  const map = new Map()
  for (const env of envs) {
    const data = env.split('=')
    map.set(data[0], data[1])
  }
  return map
}

export const parseParams = (): TParams => {
  const params: TParams = {
    apps: toArray(core.getInput('app_path')),
    tests: toArray(core.getInput('tests_path')),
    runners: toArray(core.getInput('runner_path')),
    plan: core.getInput('test_plan_path'),
    platform: core.getInput('platform') as Platform,
    deviceOs: core.getInput('device_os_version'),
    envs: toMap(core.getInput('device_os_version')),
    waitForEnd: core.getBooleanInput('wait_for_end'),
    downloadReports: toArray(core.getInput('download_reports'))
  }
  if (params.platform === Platform.android) {
    params.deviceOs = Number(params.deviceOs)
  }
  return params
}
