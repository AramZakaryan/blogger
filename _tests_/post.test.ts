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
        {
          message: 'at least one field is required',
          field: 'body',
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
        {
          message: 'at least one field is required',
          field: 'body',
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
    const bodyError = {
      title: 'error title actual length is more than 30 .........', // error message: name max length is 30
      shortDescription: 'shortDescription max length 100',
      // content: 'content max length 1000', // error message: content is required
      blogId: 'error blogId', // error message: blog with this id does not exist
      unexpectedKey: 'unexpectedValue', // error message: unexpected key
    }

    const responseCreatePostError = await superRequest
      .post(PATHS.POSTS)
      .send(bodyError)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreatePostError.body).toEqual({
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
  })

  it('update post', async () => {
    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200)
    const responseGetPosts = await superRequest.get(PATHS.POSTS).expect(200)

    const bodyUpdate0Title = {
      title: 'new title max length 30',
    }
    const bodyUpdate0ShortDescription = {
      shortDescription: 'new shortDescription max length 100"',
    }
    const bodyUpdate0Content = {
      content: 'content max length 1000',
    }
    const bodyUpdate0BlogId = {
      blogId: responseGetBlogs.body[0].id,
    }

    await superRequest
      .put(`${PATHS.POSTS}/${responseGetPosts.body[0].id}`)
      .send(bodyUpdate0Title)
      .expect(204)

    await superRequest
      .put(`${PATHS.POSTS}/${responseGetPosts.body[0].id}`)
      .send(bodyUpdate0ShortDescription)
      .expect(204)

    await superRequest
      .put(`${PATHS.POSTS}/${responseGetPosts.body[0].id}`)
      .send(bodyUpdate0Content)
      .expect(204)

    await superRequest
      .put(`${PATHS.POSTS}/${responseGetPosts.body[0].id}`)
      .send(bodyUpdate0BlogId)
      .expect(204)

    const responseGetPostsAfterUpdate0 = await superRequest.get(PATHS.POSTS).expect(200)

    expect(responseGetPostsAfterUpdate0.body[0]).toBeInstanceOf(Object)

    expect(responseGetPostsAfterUpdate0.body[0].id).toBe(responseGetPosts.body[0].id)
    expect(responseGetPostsAfterUpdate0.body[0].title).toBe(bodyUpdate0Title.title)
    expect(responseGetPostsAfterUpdate0.body[0].shortDescription).toBe(
      bodyUpdate0ShortDescription.shortDescription,
    )
    expect(responseGetPostsAfterUpdate0.body[0].content).toBe(bodyUpdate0Content.content)
    expect(responseGetPostsAfterUpdate0.body[0].blogId).toBe(bodyUpdate0BlogId.blogId)
    expect(responseGetPostsAfterUpdate0.body[0].blogName).toBe(responseGetPosts.body[0].blogName)

    const bodyUpdate7 = {
      title: 'new2 title max length 30',
      shortDescription: 'new2 shortDescription max length 100"',
      content: 'content2 max length 1000',
      blogId: responseGetBlogs.body[7].id,
    }
    await superRequest
      .put(`${PATHS.POSTS}/${responseGetPosts.body[7].id}`)
      .send(bodyUpdate7)
      .expect(204)

    const responseGetPostsAfterUpdate7 = await superRequest.get(PATHS.POSTS).expect(200)

    expect(responseGetPostsAfterUpdate7.body[7]).toBeInstanceOf(Object)

    expect(responseGetPostsAfterUpdate7.body[7].id).toBe(responseGetPostsAfterUpdate7.body[7].id)
    expect(responseGetPostsAfterUpdate7.body[7].title).toBe(bodyUpdate7.title)
    expect(responseGetPostsAfterUpdate7.body[7].shortDescription).toBe(bodyUpdate7.shortDescription)
    expect(responseGetPostsAfterUpdate7.body[7].content).toBe(bodyUpdate7.content)
    expect(responseGetPostsAfterUpdate7.body[7].blogId).toBe(bodyUpdate7.blogId)
    expect(responseGetPostsAfterUpdate7.body[7].blogName).toBe(
      responseGetPostsAfterUpdate7.body[7].blogName,
    )
  })
  it('send error for non-existing, empty, non-object body in update post', async () => {
    const responseGetPosts = await superRequest.get(PATHS.POSTS).expect(200)

    const bodyError = {
      title: 'error title actual length is more than 30', // error message: title max length is 30
      // shortDescription: 'shortDescription max length 100', // error message: shortDescription is required
      content: 'content max length 1000',
      blogId: 'non existing blogId', // error message: blog with provided id does not exist
      unexpectedKey: 'unexpectedValue', // error message: Unexpected key
    }

    const responseUpdatePostError = await superRequest
      .put(`${PATHS.POSTS}/${responseGetPosts.body[0].id}`)
      .send(bodyError)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseUpdatePostError.body).toEqual({
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
          message: 'blog with provided id does not exist',
          field: 'blogId',
        },
      ],
    })
  })
})
