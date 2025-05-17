import { agent } from 'supertest'
import { app } from '../src/app'
import { AccessTokenViewModel, LoginUserBody } from '../src/types'
import { usersSetMapped } from './datasets'
import { HTTP_STATUS_CODES, PATHS } from '../src/common'

export const superRequest = agent(app)

export const loginAndGetAccessToken = async (
  loginOrEmail: LoginUserBody['loginOrEmail'],
): Promise<AccessTokenViewModel> => {
  const indexOfUser = usersSetMapped.findIndex(
    (user) => loginOrEmail === user.login || loginOrEmail === user.email,
  )

  const bodyLogin: LoginUserBody = {
    loginOrEmail: loginOrEmail,
    password: `user password ${indexOfUser}`,
  }

  const response = await superRequest
    .post(`${PATHS.AUTH}/login`)
    .send(bodyLogin)
    .expect('Content-Type', /json/)
    .expect(HTTP_STATUS_CODES.OK_200)

  expect(response.body).toHaveProperty('accessToken')
  const accessToken = response.body.accessToken

  expect(typeof accessToken).toBe('string')
  expect(accessToken.split('.')).toHaveLength(3)

  return accessToken
}
