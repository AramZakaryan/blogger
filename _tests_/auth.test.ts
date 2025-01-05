import { superRequest } from './testHelpers'
import { customFilter, customSort, HTTP_STATUS_CODES, PATHS } from '../src/common'
import { runDB, setDB } from '../src/db'
import { blogsSetMapped, dataSet, usersSet } from './datasets'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import {
  CreateBlogBody,
  CreatePostOfBlogBody,
  GetArrangedBlogsQuery,
  GetArrangedPostsQuery,
  LoginUserBody,
  PostViewModel,
  UpdateBlogBody,
} from '../src/types'

config()

// let server: MongoMemoryServer
let client: MongoClient

const dbUrl = process.env.MONGO_URL || ''
const dbName = process.env.DB_NAME || ''

describe('/auth', () => {
  beforeAll(async () => {
    // server = await MongoMemoryServer.create()
    // const dbUrl = server.getUri()

    let clientConnected = await runDB(dbUrl, dbName)
    if (clientConnected) {
      client = clientConnected
    }

    await setDB(dataSet)
  })
  afterAll(async () => {
    // await setDB()
    // await server.stop()
    await client.close()
  })

  it('should login the user', async () => {
    ////////// case 1: with login as loginOrEmail

    for (let i = 0; i < usersSet.length; i++) {
      const body: LoginUserBody = {
        loginOrEmail: usersSet[i].login,
        password: `user password ${i}`,
      }

      await superRequest
        .post(`${PATHS.AUTH}/login`)
        .send(body)
        .expect(HTTP_STATUS_CODES.NO_CONTENT_204)
    }

    ////////// case 2: with email as loginOrEmail

    for (let i = 0; i < usersSet.length; i++) {
      const body: LoginUserBody = {
        loginOrEmail: usersSet[i].email,
        password: `user password ${i}`,
      }

      await superRequest
        .post(`${PATHS.AUTH}/login`)
        .send(body)
        .expect(HTTP_STATUS_CODES.NO_CONTENT_204)
    }
  })

  it('send error for wrong credentials in login user', async () => {
    ////////// case 1: fake loginOrEmail and fake password

    const body1: LoginUserBody = {
      loginOrEmail: 'fake_login',
      password: 'fake password',
    }

    await superRequest
      .post(`${PATHS.AUTH}/login`)
      .send(body1)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    ////////// case 2: existing login as loginOrEmail and fake password

    const body2_1: LoginUserBody = {
      loginOrEmail: usersSet[0].login,
      password: 'fake password',
    }

    await superRequest
      .post(`${PATHS.AUTH}/login`)
      .send(body2_1)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    ////////// case 2.2: existing email as loginOrEmail and fake password

    const body2_2: LoginUserBody = {
      loginOrEmail: usersSet[0].email,
      password: 'fake password',
    }

    await superRequest
      .post(`${PATHS.AUTH}/login`)
      .send(body2_2)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)
  })

  it('send error for wrong body in login user', async () => {
    ////////// these tests will return the same result as wrong credentials
    // since there is no validation of body

    ////////// case 1: short login

    const body1: LoginUserBody = {
      loginOrEmail: 'lo', // short login
      password: 'fake password',
    }

    await superRequest
      .post(`${PATHS.AUTH}/login`)
      .send(body1)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    ////////// case 2: wrong email format

    const body2: LoginUserBody = {
      loginOrEmail: 'some_login', // short login
      password: 'some very very very very long password',
    }

    await superRequest
      .post(`${PATHS.AUTH}/login`)
      .send(body2)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)
  })

  it('send error for empty, non-object body in login user', async () => {
    ///////// case 1

    const body1 = undefined

    const responseLoginUser1 = await superRequest
      .post(`${PATHS.AUTH}/login`)
      .send(body1)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseLoginUser1.body).toEqual({
      errorsMessages: [
        {
          message: 'loginOrEmail must be a string',
          field: 'loginOrEmail',
        },
        {
          message: 'password must be a string',
          field: 'password',
        },
      ],
    })

    ///////// case 2

    const body2 = {}

    const responseLoginUser2 = await superRequest
      .post(`${PATHS.AUTH}/login`)
      .send(body2)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseLoginUser2.body).toEqual({
      errorsMessages: [
        {
          message: 'loginOrEmail must be a string',
          field: 'loginOrEmail',
        },
        {
          message: 'password must be a string',
          field: 'password',
        },
      ],
    })

    ///////// case 3

    const body3 = ['element']

    const responseLoginUser3 = await superRequest
      .post(`${PATHS.AUTH}/login`)
      .send(body3)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseLoginUser3.body).toEqual({
      errorsMessages: [
        {
          message: 'loginOrEmail must be a string',
          field: 'loginOrEmail',
        },
        {
          message: 'password must be a string',
          field: 'password',
        },
      ],
    })
  })
})
