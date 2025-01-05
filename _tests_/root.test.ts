import { superRequest } from './testHelpers'
import { HTTP_STATUS_CODES, PATHS } from '../src/common'
import { runDB, setDB } from '../src/db'
import { dataSet } from './datasets'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'

config()

const version = process.env.VERSION

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

  it('should get the version', async () => {
    const responseRoot = await superRequest.get('/').expect(HTTP_STATUS_CODES.OK_200)

    expect(responseRoot.body).toEqual({
      version,
    })
  })
})
