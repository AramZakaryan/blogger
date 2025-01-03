import { superRequest } from './testHelpers'
import { PATHS } from '../src/common'
import { runDB, setDB } from '../src/db'
import { dataSet } from './datasets'
import { HTTP_STATUS_CODES } from '../src/common/httpStatusCodes'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'

config()

// let server: MongoMemoryServer
let client: MongoClient

const dbUrl = process.env.MONGO_URL || ''
const dbName = process.env.DB_NAME || ''

describe('/blogs', () => {
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

  it('should get the version', async () => {
    const responseRoot = await superRequest.get('/').expect(HTTP_STATUS_CODES.OK_200)

    expect(responseRoot.body).toEqual({
      version: '1.0.0',
    })
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
