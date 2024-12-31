export function customSort<T>(
  array: T[],
  key: keyof T = 'createdAt' as keyof T,
  sortDirection: 'asc' | 'desc' = 'desc',
): T[] {
  return [...array].sort((a, b) => {
    const valA = a[key]
    const valB = b[key]

    // Determine comparison result
    let comparison = 0

    if (typeof valA === 'string' && typeof valB === 'string') {
      comparison = valA.localeCompare(valB)
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      comparison = valA - valB
    }

    // Adjust for descending order
    return sortDirection === 'desc' ? -comparison : comparison
  })
}
