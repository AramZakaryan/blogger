import { superRequest } from './testHelpers'
import { PATHS } from '../src/common'
import { setDB } from '../src/db'
import { dataSet1 } from './datasets'

describe('/blogs', () => {
  beforeEach(async () => {
    await setDB(dataSet1)
  })

  it('should get the version', async () => {
    const responseRoot = await superRequest.get('/').expect(200)

    expect(responseRoot.body).toBeInstanceOf(Object)
    expect(responseRoot.body).toEqual({
      version: '1.0.0',
    })
  })

  it('should clear db', async () => {
    await superRequest.delete(PATHS.TESTING).expect(204)

    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200)

    expect(responseGetBlogs.body).toBeInstanceOf(Array)
    expect(responseGetBlogs.body.length).toBe(0)
  })
})
