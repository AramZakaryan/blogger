import { UserViewModel } from '../types'
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken'
import { config } from 'dotenv'

config()

const jwtSecret: Secret = process.env.JWT_SECRET || 'gsddgsdgrtgrwterttf'
const jwtExpiresIn: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1h'

export const JwtService = {
  createToken: (userId: UserViewModel['id']): string => {
    return jwt.sign({ userId }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    })
  },
  parseToken: (token: string):  string | null => {
    try {
      const payload = jwt.verify(token, jwtSecret) as JwtPayload & { userId: string }
      return payload.userId
    } catch (err) {
      return null
    }
  },
}
