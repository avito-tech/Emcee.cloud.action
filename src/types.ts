export interface TParams {
  apps: string[]
  tests: string[]
  runners: string[]
  plan?: string
  platform: Platform
  deviceOs: string | number
  envs: Map<string, string>
  waitForEnd: boolean
  downloadReports: string[]
}

export enum ArtifactType {
  appArchive = 'appArchive',
  testsArchive = 'testsArchive',
  runnerArchive = 'runnerArchive',
  runnerClass = 'runnerClass',
  packageName = 'packageName',
  xcTestRun = 'xcTestRun'
}

export interface TTestRunArtifact {
  type: ArtifactType
  data: string
}

export interface TCreateRunPayload {
  platform: Platform
  artifacts: TTestRunArtifact[]
  deviceOsVersion: string | number
  environment: Map<string, string>
}

export enum Platform {
  ios = 'ios',
  android = 'android'
}

export enum TestJobStatus {
  created = 'created',
  inProgress = 'inProgress',
  finished = 'finished',
  failed = 'failed',
  deleted = 'deleted'
}

export interface TTestJob {
  jobId: string
  status: TestJobStatus
}
