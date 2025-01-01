import { superRequest } from './testHelpers'
import { PATHS } from '../src/common'
import { runDB, setDB } from '../src/db'
import { dataSet, postsSetMapped } from './datasets'
import { HTTP_STATUS_CODES } from '../src/common/httpStatusCodes'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import { GetArrangedPostsQuery, UpdatePostBody } from '../src/types'
import { customSort } from '../src/common/helpers/customSort'

config()

// let server: MongoMemoryServer
let client: MongoClient

const dbUrl = process.env.MONGO_URL || ''
const dbName = process.env.DB_NAME || ''

describe('/posts', () => {
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

  it('should get object containing posts', async () => {
    const responseGetArrangedPosts = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(responseGetArrangedPosts.body).toMatchObject({
      pagesCount: expect.any(Number),
      page: expect.any(Number),
      pageSize: expect.any(Number),
      totalCount: expect.any(Number),
      items: expect.any(Array),
    })
  })

  it('should get arranged posts', async () => {
    ////////// case 1: empty query

    const query1: GetArrangedPostsQuery = {}

    const response1 = await superRequest
      .get(PATHS.POSTS)
      .query(query1)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response1.body).toEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 10,
      totalCount: 15,
      items: customSort(postsSetMapped).slice(0, 10),
    })

    ////////// case 2

    const query2: GetArrangedPostsQuery = { sortDirection: 'asc' }

    const response2 = await superRequest
      .get(PATHS.POSTS)
      .query(query2)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response2.body).toEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 10,
      totalCount: 15,
      items: customSort(postsSetMapped, 'createdAt', query2.sortDirection).slice(0, 10),
    })

    ////////// case 3

    const query3: GetArrangedPostsQuery = { pageNumber: 2 }

    const response3 = await superRequest
      .get(PATHS.POSTS)
      .query(query3)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response3.body).toEqual({
      pagesCount: 2,
      page: query3.pageNumber,
      pageSize: 10,
      totalCount: 15,
      items: customSort(postsSetMapped).slice(10, 15),
    })

    ////////// case 4:

    const query4: GetArrangedPostsQuery = { pageSize: 3 }

    const response4 = await superRequest
      .get(PATHS.POSTS)
      .query(query4)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response4.body).toEqual({
      pagesCount: 5,
      page: 1,
      pageSize: query4.pageSize,
      totalCount: 15,
      items: customSort(postsSetMapped).slice(0, 3),
    })

    ///////// additional case 4.1: too big page size

    const query41: GetArrangedPostsQuery = { pageSize: postsSetMapped.length }

    const response41 = await superRequest
      .get(PATHS.POSTS)
      .query(query41)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response41.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: query41.pageSize,
      totalCount: 15,
      items: customSort(postsSetMapped),
    })

    ////////// case with complex query 6

    const query6: GetArrangedPostsQuery = {
      pageNumber: 2,
      pageSize: 3,
      sortBy: 'id',
    }

    const response6 = await superRequest
      .get(PATHS.POSTS)
      .query(query6)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response6.body).toEqual({
      pagesCount: 5,
      page: query6.pageNumber,
      pageSize: query6.pageSize,
      totalCount: 15,
      items: customSort(postsSetMapped, query6.sortBy).slice(3, 6),
    })

    ////////// case with complex query 7

    const query7: GetArrangedPostsQuery = {
      pageNumber: 3,
      pageSize: 4,
      sortBy: 'content',
      sortDirection: 'asc',
    }

    const response7 = await superRequest
      .get(PATHS.POSTS)
      .query(query7)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response7.body).toEqual({
      pagesCount: 4,
      page: query7.pageNumber,
      pageSize: query7.pageSize,
      totalCount: 15,
      items: customSort(postsSetMapped, query7.sortBy, 'asc').slice(8, 12),
    })
  })

  it('should get error for wrong query to get arranged posts', async () => {
    ///////// case 1: too big page size

    const query1: any = {
      pageNumber: -1,
      pageSize: 'a',
      sortBy: 'oyoy',
      sortDirection: 400,
    }

    const response2 = await superRequest
      .get(PATHS.POSTS)
      .query(query1)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(response2.body).toEqual({
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
          message: 'sortBy must be key of post',
          field: 'query',
        },
      ],
    })
  })

  it('should get the post', async () => {
    const responseGetArrangedPosts = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    for (let i = 0; i < responseGetArrangedPosts.body.items.length; i++) {
      const responseFindPost = await superRequest
        .get(`${PATHS.POSTS}/${responseGetArrangedPosts.body.items[i].id}`)
        .expect(HTTP_STATUS_CODES.OK_200)

      expect(responseFindPost.body).toEqual(responseGetArrangedPosts.body.items[i])
    }
  })

  it('send error for non-existing post', async () => {
    const paramsIdNonExisting = 'paramsNonExisting'

    const responseFindPostError = await superRequest
      .get(`${PATHS.POSTS}/${paramsIdNonExisting}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseFindPostError.body).toEqual({
      errorsMessages: [
        {
          message: 'post with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })

  it('send error for non-existing credentials (header) in create, update, delete post', async () => {
    const bodyCreate = {
      name: 'name max len 15',
      description: 'description max length 500',
      websiteUrl: 'https://someurl.com',
    }

    const responseCreatePost = await superRequest
      .post(PATHS.POSTS)
      .set('Authorization', '') // setting headers
      .send(bodyCreate)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseCreatePost.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })

    const responseGetPosts = await superRequest.get(PATHS.POSTS).expect(HTTP_STATUS_CODES.OK_200)

    const bodyUpdate0 = {
      name: 'new2 name max15',
      description: 'description2 max length 500',
      websiteUrl: 'https://someurl2.com',
    }

    const responseUpdatePost = await superRequest
      .put(`${PATHS.POSTS}/${responseGetPosts.body.items[0].id}`)
      .set('Authorization', '') // setting headers
      .send(bodyUpdate0)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseUpdatePost.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })

    const responseDeletePost = await superRequest
      .delete(`${PATHS.POSTS}/${responseGetPosts.body.items[0].id}`)
      .set('Authorization', '') // setting headers
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseDeletePost.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })
  })

  it('create a post', async () => {
    const responseGetArrangedBlogs = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const body = {
      title: 'title max length 30',
      shortDescription: 'shortDescription max length 100',
      content: 'content max length 1000',
      blogId: responseGetArrangedBlogs.body.items[0].id,
    }

    const responseCreatePost = await superRequest
      .post(PATHS.POSTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.CREATED_201)

    expect(responseCreatePost.body).toMatchObject({
      id: expect.any(String),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: body.blogId,
      blogName: responseGetArrangedBlogs.body.items[0].name,
      createdAt: expect.any(String),
    })
  })

  it('send error for non-existing, empty, non-object body in create post', async () => {
    const bodyNonExisting = undefined

    const responseCreatePostToBodyNonExisting = await superRequest
      .post(PATHS.POSTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyNonExisting)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreatePostToBodyNonExisting.body).toEqual({
      errorsMessages: [
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
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyEmpty)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreatePostToBodyEmpty.body).toEqual({
      errorsMessages: [
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
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyArray)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreatePostToyBodyArray.body).toEqual({
      errorsMessages: [
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
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreatePostErrorV1.body).toEqual({
      errorsMessages: [
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
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreatePostErrorV2.body).toEqual({
      errorsMessages: [
        {
          message: 'title is required',
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
    const responseGetArrangedBlogs = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const randomBlogs = Array.from(
      { length: 10 },
      () => responseGetArrangedBlogs.body.items[~~(Math.random() * 10)],
    )

    const responseGetArrangedPosts = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    for (let i = 0; i < responseGetArrangedPosts.body.items.length; i++) {
      const body: UpdatePostBody = {
        title: `new title ${i}`,
        shortDescription: `new shortDescription ${i}`,
        content: `new content ${i}`,
        blogId: randomBlogs[i].id,
      }

      await superRequest
        .put(`${PATHS.POSTS}/${responseGetArrangedPosts.body.items[i].id}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(body)
        .expect(HTTP_STATUS_CODES.NO_CONTENT_204)
    }

    const responseGetArrangedPostsAfterUpdate = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    for (let i = 0; i < responseGetArrangedPostsAfterUpdate.body.items.length; i++) {
      expect(responseGetArrangedPostsAfterUpdate.body.items[i]).toEqual({
        id: responseGetArrangedPosts.body.items[i].id,
        title: `new title ${i}`,
        shortDescription: `new shortDescription ${i}`,
        content: `new content ${i}`,
        blogId: randomBlogs[i].id,
        blogName: randomBlogs[i].name,
        createdAt: responseGetArrangedPosts.body.items[i].createdAt,
      })
    }
  })

  it('send error for non-existing, empty, non-object body in update post', async () => {
    const responseGetArrangedPosts = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const bodyErrorV1 = {
      title: 'title'.repeat(30), // error message: title max length is 30
      // shortDescription: 'shortDescription max length 100', // error message: shortDescription is required
      content: 'content max length 1000',
      blogId: 'non existing blogId', // error message: blog with provided id does not exist
      unexpectedKey: 'unexpectedValue', // no error message
    }

    const responseUpdatePostErrorV1 = await superRequest
      .put(`${PATHS.POSTS}/${responseGetArrangedPosts.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseUpdatePostErrorV1.body).toEqual({
      errorsMessages: [
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
      blogId: responseGetArrangedPosts.body.items[0].blogId, // no error message
    }

    const responseUpdatePostErrorV2 = await superRequest
      .put(`${PATHS.POSTS}/${responseGetArrangedPosts.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseUpdatePostErrorV2.body).toEqual({
      errorsMessages: [
        {
          message: 'title is required',
          field: 'title',
        },
        {
          message: 'content max length is 1000',
          field: 'content',
        },
      ],
    })
  })

  it('send error for non-existing params in update post', async () => {
    const paramsIdNonExisting = 'paramsNonExisting'

    const bodyUpdateError = {}

    const responseUpdatePostError = await superRequest
      .put(`${PATHS.POSTS}/${paramsIdNonExisting}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyUpdateError)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseUpdatePostError.body).toEqual({
      errorsMessages: [
        {
          field: 'params',
          message: 'post with provided id does not exist',
        },
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
  })

  it('delete post', async () => {
    const responseGetArrangedPosts = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const responseFindPost = await superRequest
      .get(`${PATHS.POSTS}/${responseGetArrangedPosts.body.items[0].id}`)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(responseFindPost.body.id).toEqual(responseGetArrangedPosts.body.items[0].id)

    await superRequest
      .delete(`${PATHS.POSTS}/${responseFindPost.body.id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204)

    const responseFindPostsAfterDelete = await superRequest
      .get(`${PATHS.POSTS}/${responseGetArrangedPosts.body.items[0].id}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

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
