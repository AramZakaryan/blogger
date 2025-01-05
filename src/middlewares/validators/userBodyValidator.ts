import {
  handleIsString,
  handleIsStringIsLengthMinMax,
  handleMatches,
  handleNotEmpty,
} from './handlers'

export const userBodyValidator = [
  handleNotEmpty('login'),
  handleIsStringIsLengthMinMax('login', 3, 10),
  handleMatches('login', '^[a-zA-Z0-9_-]*$'),
  handleNotEmpty('email'),
  handleIsString('email'),
  handleMatches('email', '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
  handleNotEmpty('password'),
  handleIsStringIsLengthMinMax('password', 6, 20),
]
