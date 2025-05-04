import { Request } from 'express'
import { LoginUserBody } from '../dto'

export type LoginRequest = Request<{}, any, LoginUserBody>

export type MeRequest = Request<{}, any, { }>
