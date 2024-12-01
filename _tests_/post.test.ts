import { superRequest } from './testHelpers'
import { PATH } from '../src/common'
import { setDB } from '../src/db'
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

  it('create a post', async () => {
    const body = {
      title: 'title max length 30',
      shortDescription: 'shortDescription max length 100',
      content: 'content max length 1000',
      blogId: dataSet1.blogs[0].id,
    }

    const responseCreatePost = await superRequest
      .post(PATH.POSTS)
      .send(body)
      .expect('Content-Type', /json/)
      .expect(201)

    expect(responseCreatePost.body).toBeInstanceOf(Object)

    expect(responseCreatePost.body.id).not.toBe('')
    expect(responseCreatePost.body.title).toBe(body.title)
    expect(responseCreatePost.body.shortDescription).toBe(body.shortDescription)
    expect(responseCreatePost.body.content).toBe(body.content)
    expect(responseCreatePost.body.blogId).toBe(body.blogId)
    expect(responseCreatePost.body.blogName).toBe(dataSet1.blogs[0].name)
  })

  it('send error for non-existing, empty, non-object body in create post', async () => {
    const bodyNonExisting = undefined

    const responseCreatePostToBodyNonExisting = await superRequest
      .post(PATH.POSTS)
      .send(bodyNonExisting)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreatePostToBodyNonExisting.body).toEqual({
      errorsMessages: [
        {
          message: 'at least one field is required',
          field: 'body',
        },
      ],
    })

    const bodyEmpty = {}

    const responseCreatePostToBodyEmpty = await superRequest
      .post(PATH.POSTS)
      .send(bodyEmpty)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreatePostToBodyEmpty.body).toEqual({
      errorsMessages: [
        {
          message: 'at least one field is required',
          field: 'body',
        },
      ],
    })

    const bodyArray = ['element']

    const responseCreatePostToyBodyArray = await superRequest
      .post(PATH.POSTS)
      .send(bodyArray)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreatePostToyBodyArray.body).toEqual({
      errorsMessages: [
        {
          message: 'body must be an object',
          field: 'body',
        },
      ],
    })
  })

  it('send error for error body in create post', async () => {
    const bodyError = {
      title: 'error title actual length is more than 30 .........', // error message: name max length is 30
      shortDescription: 'shortDescription max length 100',
      // content: 'content max length 1000', // error message: content is required
      blogId: 'error blogId', // error message: blog with this id does not exist
      unexpectedKey: 'unexpectedValue', // error message: unexpected key
    }

    const responseCreateBlogError = await superRequest
      .post(PATH.POSTS)
      .send(bodyError)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreateBlogError.body).toEqual({
      errorsMessages: [
        {
          field: 'unexpectedKey',
          message: "unexpected key 'unexpectedKey' found",
        },
        {
          message: 'title max length is 30',
          field: 'title',
        },
        {
          message: 'content is required',
          field: 'content',
        },
        {
          message: 'blog with provided id does not exist',
          field: 'blogId',
        },
      ],
    })
  })
})
