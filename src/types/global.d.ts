// src/types/global.d.ts

import { UserViewForMeModel } from './auth.type'

export {}

declare global {
  namespace Express {
    export interface Request {
      user: UserViewForMeModel
    }
  }
}
