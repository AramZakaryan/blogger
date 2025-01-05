import { superRequest } from './testHelpers'
import { customFilter, customSort, HTTP_STATUS_CODES, PATHS } from '../src/common'
import { runDB, setDB } from '../src/db'
import { usersSetMapped, dataSet } from './datasets'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import {
  CreateUserBody,
  GetArrangedUsersQuery,
  GetArrangedPostsQuery,
  PostViewModel,
} from '../src/types'

config()

// let server: MongoMemoryServer
let client: MongoClient

const dbUrl = process.env.MONGO_URL || ''
const dbName = process.env.DB_NAME || ''

describe('/users', () => {
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

  it('should get object containing users', async () => {
    const responseGetArrangedUsers = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(responseGetArrangedUsers.body).toMatchObject({
      pagesCount: expect.any(Number),
      page: expect.any(Number),
      pageSize: expect.any(Number),
      totalCount: expect.any(Number),
      items: expect.any(Array),
    })
  })

  it('should get arranged users', async () => {
    ////////// case 1: empty query

    const query1: GetArrangedUsersQuery = {}

    const response1 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query1)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response1.body).toEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 10,
      totalCount: 15,
      items: customSort(usersSetMapped).slice(0, 10),
    })

    ////////// case 2

    const query2: GetArrangedUsersQuery = { sortDirection: 'asc' }

    const response2 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query2)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response2.body).toEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 10,
      totalCount: 15,
      items: customSort(usersSetMapped, 'createdAt', query2.sortDirection).slice(0, 10),
    })

    ////////// case 3

    const query3: GetArrangedUsersQuery = { pageNumber: 2 }

    const response3 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query3)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response3.body).toEqual({
      pagesCount: 2,
      page: query3.pageNumber,
      pageSize: 10,
      totalCount: 15,
      items: customSort(usersSetMapped).slice(10, 15),
    })

    ////////// case 4:

    const query4: GetArrangedUsersQuery = { pageSize: 3 }

    const response4 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query4)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response4.body).toEqual({
      pagesCount: 5,
      page: 1,
      pageSize: query4.pageSize,
      totalCount: 15,
      items: customSort(usersSetMapped).slice(0, 3),
    })

    ///////// additional case 4.1: too big page size

    const query41: GetArrangedUsersQuery = { pageSize: usersSetMapped.length }

    const response41 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query41)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response41.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: query41.pageSize,
      totalCount: 15,
      items: customSort(usersSetMapped),
    })

    ////////// case 5.1:

    const query5_1: GetArrangedUsersQuery = { searchLoginTerm: 'wxy' }

    const response5_1 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query5_1)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response5_1.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 7,
      items: customSort(usersSetMapped)
        .filter(({ login }) => customFilter(login, query5_1.searchLoginTerm))
        .slice(0, 10),
    })

    ////////// case 5.2:

    const query5_2: GetArrangedUsersQuery = { searchEmailTerm: 'yYzz' }

    const response5_2 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query5_2)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response5_2.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 4,
      items: customSort(usersSetMapped)
        .filter(({ email }) => customFilter(email, query5_2.searchEmailTerm))
        .slice(0, 10),
    })

    ////////// complex case 5.3: elements of { searchLoginTerm: 'wxy' } are 7,
    // elements of { searchEmailTerm: 'yYzz' } are 4, but these two conditions at the same time are 9
    // since there are 2 elements that satisfies two conditions at the same time

    const query5_3: GetArrangedUsersQuery = { searchLoginTerm: 'wxy', searchEmailTerm: 'yYzz' }

    const response5_3 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query5_3)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response5_3.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 9,
      items: customSort(usersSetMapped)
        .filter(
          ({ email, login }) =>
            customFilter(login, query5_3.searchLoginTerm) ||
            customFilter(email, query5_3.searchEmailTerm),
        )
        .slice(0, 10),
    })

    ////////// case with complex query 6

    const query6: GetArrangedUsersQuery = {
      pageNumber: 2,
      pageSize: 4,
      sortBy: 'id',
      sortDirection: 'asc',
      searchLoginTerm: 'qrs',
      searchEmailTerm: 'qrst',
    }

    const response6 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query6)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response6.body).toEqual({
      pagesCount: 3,
      page: query6.pageNumber,
      pageSize: query6.pageSize,
      totalCount: 9,
      items: customSort(usersSetMapped, query6.sortBy, query6.sortDirection)
        .filter(
          ({ email, login }) =>
            customFilter(login, query6.searchLoginTerm) ||
            customFilter(email, query6.searchEmailTerm),
        )
        .slice(4, 8),
    })

    ////////// case with complex query 7

    const query7: GetArrangedUsersQuery = {
      pageNumber: 2,
      pageSize: 3,
      sortBy: 'login',
      searchLoginTerm: 'tuv',
      searchEmailTerm: 'uvwx',
    }

    const response7 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query7)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response7.body).toEqual({
      pagesCount: 2,
      page: query7.pageNumber,
      pageSize: query7.pageSize,
      totalCount: 5,
      items: customSort(usersSetMapped, query7.sortBy)
        .filter(
          ({ email, login }) =>
            customFilter(login, query7.searchLoginTerm) ||
            customFilter(email, query7.searchEmailTerm),
        )
        .slice(3, 5),
    })
  })
  //
  it('should get error for wrong query to get arranged users', async () => {
    ///////// case 1

    const query1: any = {
      pageNumber: -1,
      pageSize: 'a',
      sortBy: 'oyoy',
      sortDirection: 400,
    }

    const response1 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query1)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(response1.body).toEqual({
      errorsMessages: [
        {
          message: 'pageNumber must contain only numeric digits',
          field: 'query',
        },
        {
          message: 'pageSize must contain only numeric digits',
          field: 'query',
        },
        {
          message: 'sortDirection must be key of asc or desc',
          field: 'query',
        },
        {
          message: 'sortBy must be key of user',
          field: 'query',
        },
      ],
    })

    ///////// case 2

    const query2: any = {
      pageNumber: 0,
      pageSize: 'a',
      sortBy: null,
      sortDirection: ['a'],
    }

    const response2 = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .query(query2)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(response2.body).toEqual({
      errorsMessages: [
        {
          message: 'pageNumber must be greater than 0',
          field: 'query',
        },
        {
          message: 'pageSize must contain only numeric digits',
          field: 'query',
        },
        {
          message: 'sortDirection must be key of asc or desc',
          field: 'query',
        },
        {
          message: 'sortBy must be key of user',
          field: 'query',
        },
      ],
    })
  })

  it('should get the user', async () => {
    const responseGetArrangedUsers = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.OK_200)

    for (let i = 0; i < responseGetArrangedUsers.body.items.length; i++) {
      const responseFindUser = await superRequest
        .get(`${PATHS.USERS}/${responseGetArrangedUsers.body.items[i].id}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(HTTP_STATUS_CODES.OK_200)

      expect(responseFindUser.body).toEqual(responseGetArrangedUsers.body.items[i])
    }
  })

  it('send error for non-existing user', async () => {
    const paramsIdNonExisting = 'paramsNonExisting'

    const responseFindUserError = await superRequest
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .get(`${PATHS.USERS}/${paramsIdNonExisting}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseFindUserError.body).toEqual({
      errorsMessages: [
        {
          message: 'user with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })

  it('send error for non-existing credentials (header) in get arranged users, create, delete user', async () => {
    const responseCorrectGetArrangedUsers = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5') // correct headers
      .expect(HTTP_STATUS_CODES.OK_200)

    ////////// case: get arranged users

    const responseGetArrangedUsers = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', '') // wrong headers
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseGetArrangedUsers.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })

    ////////// case: create user

    const bodyCreate: CreateUserBody = {
      login: 'some_login',
      email: 'some@email.com',
      password: 'some password',
    }

    const responseCreateUser = await superRequest
      .post(PATHS.USERS)
      .set('Authorization', '') // wrong headers
      .send(bodyCreate)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseCreateUser.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })
    ////////// case: delete user

    const responseDeleteUser = await superRequest
      .delete(`${PATHS.USERS}/${responseCorrectGetArrangedUsers.body.items[0].id}`)
      .set('Authorization', '') // wrong headers
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseDeleteUser.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })
  })

  it('create a user', async () => {
    const body: CreateUserBody = {
      login: 'some_login',
      email: 'some@email.com',
      password: 'some password',
    }

    const responseCreateUser = await superRequest
      .post(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.CREATED_201)

    expect(responseCreateUser.body).toMatchObject({
      id: expect.any(String),
      login: body.login,
      email: body.email,
      createdAt: expect.any(String),
    })
  })

  it('send error for empty, non-object body in create user', async () => {
    const bodyNonExisting = undefined

    const responseCreateUserToBodyNonExisting = await superRequest
      .post(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyNonExisting)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateUserToBodyNonExisting.body).toEqual({
      errorsMessages: [
        {
          message: 'login is required',
          field: 'login',
        },
        {
          message: 'email is required',
          field: 'email',
        },
        {
          message: 'password is required',
          field: 'password',
        },
      ],
    })

    const bodyEmpty = {}

    const responseCreateUserToBodyEmpty = await superRequest
      .post(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyEmpty)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateUserToBodyEmpty.body).toEqual({
      errorsMessages: [
        {
          message: 'login is required',
          field: 'login',
        },
        {
          message: 'email is required',
          field: 'email',
        },
        {
          message: 'password is required',
          field: 'password',
        },
      ],
    })

    const bodyArray = ['element']

    const responseCreateUserToyBodyArray = await superRequest
      .post(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyArray)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateUserToyBodyArray.body).toEqual({
      errorsMessages: [
        {
          message: 'login is required',
          field: 'login',
        },
        {
          message: 'email is required',
          field: 'email',
        },
        {
          message: 'password is required',
          field: 'password',
        },
      ],
    })
  })

  // todo: with same login and with same email

  it('send error for error body in create user', async () => {
    ///////// case 1

    const bodyErrorV1 = {
      login: 'login_more_than_10', // error message: login length is between 3 and 10
      email: 'wrong format email', // error message: email must satisfy the pattern ^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$
      password: '', // error message: password is required`
      unexpectedKey: 'unexpectedValue', // no error message
    }

    const responseCreateUserErrorV1 = await superRequest
      .post(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateUserErrorV1.body).toEqual({
      errorsMessages: [
        {
          message: 'login length is between 3 and 10',
          field: 'login',
        },
        {
          message: 'email must satisfy the pattern ^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
          field: 'email',
        },
        {
          message: 'password is required',
          field: 'password',
        },
      ],
    })

    ///////// case 2

    const bodyErrorV2 = {
      login: 'lo', // error message: login length is between 3 and 10
      email: ['some@email.com'], // error message: email must be a string
      password: ['some password'], // error message: password is required
    }

    const responseCreateUserErrorV2 = await superRequest
      .post(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateUserErrorV2.body).toEqual({
      errorsMessages: [
        {
          message: 'login length is between 3 and 10',
          field: 'login',
        },
        {
          message: 'email must be a string',
          field: 'email',
        },
        {
          message: 'password must be a string',
          field: 'password',
        },
      ],
    })

    ///////// case 3

    const bodyErrorV3 = {
      login: 'wrong lo', // error message: login must satisfy the pattern ^[a-zA-Z0-9_-]*$
      // email: 'some@email.com', // error message: email must be a string
      password: 'some very very very long password', // error message: password is required
    }

    const responseCreateUserErrorV3 = await superRequest
      .post(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV3)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateUserErrorV3.body).toEqual({
      errorsMessages: [
        {
          message: 'login must satisfy the pattern ^[a-zA-Z0-9_-]*$',
          field: 'login',
        },
        {
          message: 'email is required',
          field: 'email',
        },
        {
          message: 'password length is between 6 and 20',
          field: 'password',
        },
      ],
    })

    //////// case 4: with existing login

    const responseGetArrangedUsers = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.OK_200)

    const bodyError4: CreateUserBody = {
      login: responseGetArrangedUsers.body.items[0].login, // error message: login should be unique
      email: 'someUnique@email.com',
      password: 'some password',
    }

    const responseCreateUserError4 = await superRequest
      .post(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError4)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.CONFLICT_409)

    expect(responseCreateUserError4.body).toEqual({
      errorsMessages: [
        {
          message: 'login should be unique',
          field: 'login',
        },
      ],
    })

    //////// case 5: with existing login

    const bodyError5: CreateUserBody = {
      login: 'unique_lo',
      email: responseGetArrangedUsers.body.items[0].email, // error message: email should be unique
      password: 'some password',
    }

    const responseCreateUserError5 = await superRequest
      .post(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError5)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.CONFLICT_409)

    expect(responseCreateUserError5.body).toEqual({
      errorsMessages: [
        {
          message: 'email should be unique',
          field: 'email',
        },
      ],
    })

    //////// case 6: with existing login and email

    const bodyError6: CreateUserBody = {
      login: responseGetArrangedUsers.body.items[0].login, // no message since this will be ignored if there is error of email
      email: responseGetArrangedUsers.body.items[0].email, // error message: email should be unique
      password: 'some password',
    }

    const responseCreateUserError6 = await superRequest
      .post(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError6)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.CONFLICT_409)

    expect(responseCreateUserError6.body).toEqual({
      errorsMessages: [
        {
          message: 'email should be unique',
          field: 'email',
        },
      ],
    })
  })

  it('delete user', async () => {
    const responseGetArrangedUsers = await superRequest
      .get(PATHS.USERS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.OK_200)

    const responseFindUser = await superRequest
      .get(`${PATHS.USERS}/${responseGetArrangedUsers.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(responseFindUser.body.id).toEqual(responseGetArrangedUsers.body.items[0].id)

    await superRequest
      .delete(`${PATHS.USERS}/${responseFindUser.body.id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204)

    const responseFindUserAfterDelete = await superRequest
      .get(`${PATHS.USERS}/${responseGetArrangedUsers.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseFindUserAfterDelete.body).toEqual({
      errorsMessages: [
        {
          message: 'user with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })
})
