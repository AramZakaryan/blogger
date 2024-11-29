import { superRequest } from './testHelpers'
import { PATH } from '../src/common/paths'
import { setDB } from '../src/db/db'
import { dataSet1 } from './datasets'

describe('/posts', () => {
  beforeEach(async () => {
    setDB(dataSet1)
  })

  it('should get array of posts', async () => {
    const responseGetBlogs = await superRequest.get(PATH.BLOGS).expect(200) // verifying of existence of the endpoint
    const responseGetPosts = await superRequest.get(PATH.POSTS).expect(200) // verifying of existence of the endpoint

    expect(responseGetPosts.body).toBeInstanceOf(Array)
    expect(responseGetPosts.body.length).toBe(15)

    expect(Object.keys(responseGetPosts.body[0]).length).toBe(6)
    expect(responseGetPosts.body[0].blogId).toBe(responseGetBlogs.body[0].id)

    expect(Object.keys(responseGetPosts.body[7]).length).toBe(6)
    expect(responseGetPosts.body[7].blogId).toBe(responseGetBlogs.body[1].id)

    expect(Object.keys(responseGetPosts.body[14]).length).toBe(6)
    expect(responseGetPosts.body[14].blogId).toBe(responseGetBlogs.body[2].id)
  })

  it('should get the post', async () => {
    const responseGetPosts = await superRequest.get(PATH.POSTS).expect(200) // verifying of existence of the endpoint

    const responseFindPost0 = await superRequest
      .get(`${PATH.POSTS}/${responseGetPosts.body[0].id}`)
      .expect(200) // verifying of existence of the endpoint
    const responseFindPost7 = await superRequest
      .get(`${PATH.POSTS}/${responseGetPosts.body[7].id}`)
      .expect(200) // verifying of existence of the endpoint
    const responseFindPost14 = await superRequest
      .get(`${PATH.POSTS}/${responseGetPosts.body[14].id}`)
      .expect(200) // verifying of existence of the endpoint

    expect(responseFindPost0.body).toBeInstanceOf(Object)
    expect(responseFindPost0.body.id).toBe(responseGetPosts.body[0].id)
    expect(Object.keys(responseFindPost0.body).length).toBe(6)

    expect(responseFindPost7.body).toBeInstanceOf(Object)
    expect(responseFindPost7.body.id).toBe(responseGetPosts.body[7].id)
    expect(Object.keys(responseFindPost7.body).length).toBe(6)

    expect(responseFindPost14.body).toBeInstanceOf(Object)
    expect(responseFindPost14.body.id).toBe(responseGetPosts.body[14].id)
    expect(Object.keys(responseFindPost14.body).length).toBe(6)
  })
})
