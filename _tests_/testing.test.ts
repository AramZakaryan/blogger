import { superRequest } from './testHelpers'
import { HTTP_STATUS_CODES, PATHS } from '../src/common'
import { runDB, setDB } from '../src/db'
import { dataSet } from './datasets'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'

config()

// let server: MongoMemoryServer
let client: MongoClient

const dbUrl = process.env.MONGO_URL || ''
const dbName = process.env.DB_NAME || ''

describe('other tests', () => {
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

  it('should clear db', async () => {
    await superRequest.delete(PATHS.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204)

    const responseGetArrangedBlogs = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(responseGetArrangedBlogs.body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    })

    const responseGetArrangedPosts = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(responseGetArrangedPosts.body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    })
  })
})
