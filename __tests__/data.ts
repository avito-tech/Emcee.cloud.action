import { Platform, type TParams } from '../src/types'

export const DefaultParams: TParams = {
  apps: [],
  deviceOs: 27,
  downloadReports: ['allure'],
  envs: new Map(),
  platform: Platform.android,
  runners: [],
  tests: [],
  waitForEnd: false
}
