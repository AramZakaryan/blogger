export const customFilter = (field: string, searchFieldTerm: string = ''): boolean =>
  field.toLowerCase().includes(searchFieldTerm?.toLowerCase())
