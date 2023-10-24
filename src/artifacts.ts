import { type ArtifactType, type TTestRunArtifact } from './types'
import { isURL } from './utils'
import { uploadFile } from './emcee-client'
import * as core from '@actions/core'

export const prepareArtifacts = async (
  artifacts: string[],
  artifactType: ArtifactType
): Promise<TTestRunArtifact[]> => {
  const testArtifacts: TTestRunArtifact[] = []

  for (const a of artifacts) {
    if (a === '') continue

    let url = a

    if (!isURL(a)) {
      core.debug(`Local artifact found ${a}`)
      core.debug(`Uploading artifact ${a} to emcee.cloud`)
      url = await uploadFile(a)
      core.debug(`Artifact ${a} uploaded`)
    }
    testArtifacts.push({
      type: artifactType,
      data: url
    })
  }

  return testArtifacts
}
