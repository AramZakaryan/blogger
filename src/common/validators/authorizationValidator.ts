import { Request, Response, NextFunction } from 'express'
import { config } from 'dotenv'
import { HTTP_STATUS_CODES } from '../httpStatusCodes'

config()

const encodeBasicAuth = (username?: string, password?: string) => {
  if (!username || !password) return
  const credentials = `${username}:${password}`
  return Buffer.from(credentials) // Converting to binary representation stored in a Buffer object (e.g. <Buffer 61 64 6d 69 6e 3a 71 77 65 72 74 79>)
    .toString('base64') // Base64 encode
}

const username = process.env.USERNAME
const password = process.env.PASSWORD
const encodeBasicCredentials = encodeBasicAuth(username, password)

export const authorizationValidator = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith(`Basic ${encodeBasicCredentials}`)) {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED_401).json({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })
  } else {
    next()
  }
}
