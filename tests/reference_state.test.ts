import { describe, it, expect } from 'vitest'

describe('Studio Reference Image State Management', () => {
  interface StudioAutoState {
    referenceUrl: string | null
    result: { dataUrl: string; width: number; height: number } | null
  }

  const initialAutoState: StudioAutoState = {
    referenceUrl: null,
    result: null,
  }

  const selectReference = (state: StudioAutoState, url: string): StudioAutoState => ({
    ...state,
    referenceUrl: url,
  })

  const clearReference = (state: StudioAutoState): StudioAutoState => ({
    ...state,
    referenceUrl: null,
    result: null,
  })

  it('initializes with no active reference image', () => {
    expect(initialAutoState.referenceUrl).toBeNull()
    expect(initialAutoState.result).toBeNull()
  })

  it('sets reference URL when an image is uploaded or picked', () => {
    const selected = selectReference(initialAutoState, 'data:image/png;base64,sample')
    expect(selected.referenceUrl).toBe('data:image/png;base64,sample')
  })

  it('clears reference URL and pixelated result on clear action', () => {
    const withResult: StudioAutoState = {
      referenceUrl: 'data:image/png;base64,sample',
      result: { dataUrl: 'data:image/png;base64,pixelated', width: 24, height: 24 },
    }

    const cleared = clearReference(withResult)
    expect(cleared.referenceUrl).toBeNull()
    expect(cleared.result).toBeNull()
  })
})
