import { superRequest } from './testHelpers'
import { PATHS } from '../src/common'
import { setDB } from '../src/db'
import { dataSet1 } from './datasets'

describe('/posts', () => {
  beforeEach(async () => {
    setDB(dataSet1)
  })

  it('should get array of posts', async () => {
    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200) // verifying existence of the endpoint
    const responseGetPosts = await superRequest.get(PATHS.POSTS).expect(200) // verifying existence of the endpoint

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
    const responseGetPosts = await superRequest.get(PATHS.POSTS).expect(200) // verifying existence of the endpoint

    const responseFindPost0 = await superRequest
      .get(`${PATHS.POSTS}/${responseGetPosts.body[0].id}`)
      .expect(200)
    const responseFindPost7 = await superRequest
      .get(`${PATHS.POSTS}/${responseGetPosts.body[7].id}`)
      .expect(200)
    const responseFindPost14 = await superRequest
      .get(`${PATHS.POSTS}/${responseGetPosts.body[14].id}`)
      .expect(200)

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

  it('send error for non-existing post', async () => {
    const paramsIdNonExisting = 'paramsNonExisting'

    const responseFindPostError = await superRequest
      .get(`${PATHS.POSTS}/${paramsIdNonExisting}`)
      .expect(404)

    expect(responseFindPostError.body).toBeInstanceOf(Object)
    expect(responseFindPostError.body).toEqual({
      errorsMessages: [
        {
          message: 'post with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })

  it('create a post', async () => {
    const body = {
      title: 'title max length 30',
      shortDescription: 'shortDescription max length 100',
      content: 'content max length 1000',
      blogId: dataSet1.blogs[0].id,
    }

    const responseCreatePost = await superRequest
      .post(PATHS.POSTS)
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
      .post(PATHS.POSTS)
      .send(bodyNonExisting)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreatePostToBodyNonExisting.body).toEqual({
      errorsMessages: [
        // {
        //   message: 'at least one field is required',
        //   field: 'body',
        // },
        {
          message: 'title is required',
          field: 'title',
        },
        {
          message: 'shortDescription is required',
          field: 'shortDescription',
        },
        {
          message: 'content is required',
          field: 'content',
        },
        {
          message: 'blogId is required',
          field: 'blogId',
        },
      ],
    })

    const bodyEmpty = {}

    const responseCreatePostToBodyEmpty = await superRequest
      .post(PATHS.POSTS)
      .send(bodyEmpty)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreatePostToBodyEmpty.body).toEqual({
      errorsMessages: [
        // {
        //   message: 'at least one field is required',
        //   field: 'body',
        // },
        {
          message: 'title is required',
          field: 'title',
        },
        {
          message: 'shortDescription is required',
          field: 'shortDescription',
        },
        {
          message: 'content is required',
          field: 'content',
        },
        {
          message: 'blogId is required',
          field: 'blogId',
        },
      ],
    })

    const bodyArray = ['element']

    const responseCreatePostToyBodyArray = await superRequest
      .post(PATHS.POSTS)
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
    const bodyErrorV1 = {
      title: 'title'.repeat(30), // error message: name max length is 30
      shortDescription: 'shortDescription max length 100',
      // content: 'content max length 1000', // error message: content is required
      blogId: 'error blogId', // error message: blog with this id does not exist
      unexpectedKey: 'unexpectedValue', // no error message
    }

    const responseCreatePostErrorV1 = await superRequest
      .post(PATHS.POSTS)
      .send(bodyErrorV1)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreatePostErrorV1.body).toEqual({
      errorsMessages: [
        // {
        //   field: 'unexpectedKey',
        //   message: "unexpected key 'unexpectedKey' found",
        // },
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
    const bodyErrorV2 = {
      title: '         ', // error message: name max length is 30
      shortDescription: 'shortDescription max length 100',
      content: 'content'.repeat(1000), // error message: content max length is 1000
      // blogId: 'error blogId', // no error message
    }

    const responseCreatePostErrorV2 = await superRequest
      .post(PATHS.POSTS)
      .send(bodyErrorV2)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreatePostErrorV2.body).toEqual({
      errorsMessages: [
        // {
        //   field: 'unexpectedKey',
        //   message: "unexpected key 'unexpectedKey' found",
        // },
        {
          message: 'title is empty',
          field: 'title',
        },
        {
          message: 'content max length is 1000',
          field: 'content',
        },
        {
          message: 'blogId is required',
          field: 'blogId',
        },
      ],
    })
  })

  it('update post', async () => {
    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200)
    const responseGetPosts = await superRequest.get(PATHS.POSTS).expect(200)

    const bodyUpdate0 = {
      title: 'new2 title max length 30',
      shortDescription: 'new2 shortDescription max length 100"',
      content: 'content2 max length 1000',
      blogId: responseGetBlogs.body[0].id,
    }
    await superRequest
      .put(`${PATHS.POSTS}/${responseGetPosts.body[0].id}`)
      .send(bodyUpdate0)
      .expect(204)

    const responseGetPostsAfterUpdate0 = await superRequest.get(PATHS.POSTS).expect(200)

    expect(responseGetPostsAfterUpdate0.body[0]).toBeInstanceOf(Object)

    expect(responseGetPostsAfterUpdate0.body[0].id).toBe(responseGetPostsAfterUpdate0.body[0].id)
    expect(responseGetPostsAfterUpdate0.body[0].title).toBe(bodyUpdate0.title)
    expect(responseGetPostsAfterUpdate0.body[0].shortDescription).toBe(bodyUpdate0.shortDescription)
    expect(responseGetPostsAfterUpdate0.body[0].content).toBe(bodyUpdate0.content)
    expect(responseGetPostsAfterUpdate0.body[0].blogId).toBe(bodyUpdate0.blogId)
    expect(responseGetPostsAfterUpdate0.body[0].blogName).toBe(
      responseGetPostsAfterUpdate0.body[0].blogName,
    )
  })

  it('send error for non-existing, empty, non-object body in update post', async () => {
    const responseGetPosts = await superRequest.get(PATHS.POSTS).expect(200)

    const bodyErrorV1 = {
      title: 'title'.repeat(30), // error message: title max length is 30
      // shortDescription: 'shortDescription max length 100', // error message: shortDescription is required
      content: 'content max length 1000',
      blogId: 'non existing blogId', // error message: blog with provided id does not exist
      unexpectedKey: 'unexpectedValue', // no error message
    }

    const responseUpdatePostErrorV1 = await superRequest
      .put(`${PATHS.POSTS}/${responseGetPosts.body[0].id}`)
      .send(bodyErrorV1)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseUpdatePostErrorV1.body).toEqual({
      errorsMessages: [
        // {
        //   field: 'unexpectedKey',
        //   message: "unexpected key 'unexpectedKey' found",
        // },
        {
          message: 'title max length is 30',
          field: 'title',
        },
        {
          message: 'shortDescription is required',
          field: 'shortDescription',
        },
        {
          message: 'blog with provided id does not exist',
          field: 'blogId',
        },
      ],
    })

    const bodyErrorV2 = {
      title: '       ', // error message: title is empty
      shortDescription: 'shortDescription max length 100', // no error message
      content: 'content'.repeat(1000), // error message: content max length is 1000
      blogId: responseGetPosts.body[0].blogId, // no error message
    }

    const responseUpdatePostErrorV2 = await superRequest
      .put(`${PATHS.POSTS}/${responseGetPosts.body[0].id}`)
      .send(bodyErrorV2)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseUpdatePostErrorV2.body).toEqual({
      errorsMessages: [
        // {
        //   field: 'unexpectedKey',
        //   message: "unexpected key 'unexpectedKey' found",
        // },
        {
          message: 'title is empty',
          field: 'title',
        },
        {
          message: 'content max length is 1000',
          field: 'content',
        },
      ],
    })
  })
  it('delete post', async () => {
    const responseGetPosts = await superRequest.get(PATHS.POSTS).expect(200)

    const responseFindPost = await superRequest
      .get(`${PATHS.POSTS}/${responseGetPosts.body[0].id}`)
      .expect(200)

    expect(responseFindPost.body.id).toEqual(responseGetPosts.body[0].id)

    await superRequest.delete(`${PATHS.POSTS}/${responseFindPost.body.id}`).expect(204)

    const responseFindPostsAfterDelete = await superRequest
      .get(`${PATHS.POSTS}/${responseGetPosts.body[0].id}`)
      .expect(404)

    expect(responseFindPostsAfterDelete.body).toEqual({
      errorsMessages: [
        {
          message: 'post with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })
})
