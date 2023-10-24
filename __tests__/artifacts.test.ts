/**
 * Unit tests for the artifacts functionality, src/artifacts.ts
 */

import * as client from '../src/emcee-client'
import { prepareArtifacts } from '../src/artifacts'
import { ArtifactType } from '../src/types'

// Mock internal methods
const uploadFileMock = jest.spyOn(client, 'uploadFile')

describe('artifacts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('no artifacts', async () => {
    const result = await prepareArtifacts([], ArtifactType.xcTestRun)

    expect(uploadFileMock).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('empty artifacts', async () => {
    const result = await prepareArtifacts([''], ArtifactType.xcTestRun)

    expect(uploadFileMock).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('remote', async () => {
    const url = 'http://local/artifact'

    const result = await prepareArtifacts([url], ArtifactType.xcTestRun)

    expect(uploadFileMock).not.toHaveBeenCalled()
    expect(result).toEqual([
      {
        type: ArtifactType.xcTestRun,
        data: url
      }
    ])
  })

  it('local', async () => {
    const url = 'http://local/artifact'
    uploadFileMock.mockImplementation(async () => url)

    const result = await prepareArtifacts(['local'], ArtifactType.xcTestRun)

    expect(uploadFileMock).toHaveBeenCalledWith('local')
    expect(result).toEqual([
      {
        type: ArtifactType.xcTestRun,
        data: url
      }
    ])
  })
})
