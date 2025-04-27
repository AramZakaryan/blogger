import { UserViewModel } from '../types'
import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { config } from 'dotenv'

config()

const jwtSecret: Secret = process.env.JWT_SECRET || 'gsddgsdgrtgrwterttf'
const jwtExpiresIn: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1h'

export const JwtService = {
  createToken: (userId: UserViewModel['id']): any => {
    return jwt.sign({ userId }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    })
  },
}
