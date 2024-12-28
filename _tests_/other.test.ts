import { superRequest } from './testHelpers'
import { PATHS } from '../src/common'
import { setDB } from '../src/db'
import { dataSet1 } from './datasets'
import { HTTP_STATUS_CODES } from '../src/common/httpStatusCodes'

describe('/blogs', () => {
  beforeEach(async () => {
    await setDB(dataSet1)
  })
  afterAll(async () => {
    await setDB()
  })

  it('should get the version', async () => {
    const responseRoot = await superRequest.get('/').expect(HTTP_STATUS_CODES.OK_200)

    expect(responseRoot.body).toBeInstanceOf(Object)
    expect(responseRoot.body).toEqual({
      version: '1.0.0',
    })
  })

  it('should clear db', async () => {
    await superRequest.delete(PATHS.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204)

    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(HTTP_STATUS_CODES.OK_200)

    expect(responseGetBlogs.body).toBeInstanceOf(Array)
    expect(responseGetBlogs.body.length).toBe(0)
  })
})
