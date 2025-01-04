import { handleIsString, handleNotEmpty } from './handlers'

export const authBodyValidator = [
  handleIsString('loginOrEmail'),
  handleNotEmpty('loginOrEmail'),
  handleIsString('password'),
  handleNotEmpty('password'),
]
