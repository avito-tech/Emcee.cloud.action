export const isURL = (str: string): boolean => {
  try {
    // eslint-disable-next-line no-new
    new URL(str)
    return true
  } catch {
    return false
  }
}

export const pathToFileName = (path: string): string => {
  if (path.includes('#')) return path.split('#').pop() as string
  return path.split('/').pop() as string
}
