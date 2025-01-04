export const toObjectIfJson = (value: any) => {
  if (typeof value === 'object' && value !== null) {
    return value
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch (err: any) {
      return null
    }
  }

  return null
}
