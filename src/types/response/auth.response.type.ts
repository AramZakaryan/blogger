import { Response } from 'express'
import { OutputErrorsType } from '../general'
import { AccessTokenViewModel, UserViewForMeModel } from '../auth.type'

export type LoginResponse = Response<AccessTokenViewModel | OutputErrorsType>

export type MeResponse = Response<UserViewForMeModel | OutputErrorsType>
