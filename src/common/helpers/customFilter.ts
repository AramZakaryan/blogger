export const customFilter = (name: string, searchNameTerm: string = ''): boolean =>
  name.toLowerCase().includes(searchNameTerm?.toLowerCase())
