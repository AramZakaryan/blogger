import { superRequest } from './testHelpers'
import { customSort, HTTP_STATUS_CODES, PATHS } from '../src/common'
import { runDB, setDB } from '../src/db'
import { dataSet, postsSetMapped } from './datasets'
import { MongoClient, ObjectId } from 'mongodb'
import { config } from 'dotenv'
import {
  CreateCommentOfPostBody,
  CreatePostBody,
  CreatePostOfBlogBody,
  GetArrangedPostsQuery,
  UpdatePostBody,
} from '../src/types'

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
      .get(PATHS.POSTS)
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
    ///////// case 1

    const query1: any = {
      pageNumber: -1,
      pageSize: 'a',
      sortBy: 'oyoy',
      sortDirection: 400,
    }

    const response1 = await superRequest
      .get(PATHS.POSTS)
      .query(query1)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(response1.body).toEqual({
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

    ///////// case 2

    const query2: any = {
      pageNumber: 0,
      pageSize: 'a',
      sortBy: null,
      sortDirection: ['a'],
    }

    const response2 = await superRequest
      .get(PATHS.POSTS)
      .query(query2)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(response2.body).toEqual({
      errorsMessages: [
        {
          message: 'pageNumber must be greater than 0',
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

  it('send error for not correct format post id, non-existing post', async () => {
    ////////// case1: not correct MongoDb _id format fo post id
    const paramsError1 = 'paramsNotCorrect'

    const responseFindPostError1 = await superRequest
      .get(`${PATHS.POSTS}/${paramsError1}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseFindPostError1.body).toEqual({
      errorsMessages: [
        {
          message: 'post id must be in a valid format',
          field: 'params',
        },
      ],
    })

    ////////// case2: non-existing post id (but correct MongoDb _id format fo post id)
    const paramsError2 = new ObjectId()

    const responseFindPostError2 = await superRequest
      .get(`${PATHS.POSTS}/${paramsError2}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseFindPostError2.body).toEqual({
      errorsMessages: [
        {
          message: 'post with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })

  it('send error for non-existing credentials (header) in create, update, delete post', async () => {
    ////////// case: create post

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

    ////////// case: create comment of post

    const responseGetArrangedPosts = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const bodyCreateCommentOfPost: CreateCommentOfPostBody = {
      content: 'content length is between 20 and 300',
    }

    const responseCreateCommentOfPost = await superRequest
      .post(`${PATHS.POSTS}/${responseGetArrangedPosts.body.items[0].id}/comments`)
      .set('Authorization', '') // setting headers
      .send(bodyCreateCommentOfPost)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseCreateCommentOfPost.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })

    ////////// case: update post

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

    ////////// case: delete post

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

    const body: CreatePostBody = {
      title: 'new title',
      shortDescription: 'new shortDescription',
      content: 'new content',
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
    ////////// case1
    const bodyError1 = {
      title: 'title'.repeat(30), // error message: name max length is 30
      shortDescription: 'shortDescription max length 100',
      // content: 'content max length 1000', // error message: content is required
      blogId: 'formatNotCorrect', // error message: blogId must be in a valid format
      unexpectedKey: 'unexpectedValue', // no error message
    }

    const responseCreatePostError1 = await superRequest
      .post(PATHS.POSTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreatePostError1.body).toEqual({
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
          message: 'blogId must be in a valid format',
          field: 'blogId',
        },
      ],
    })

    ////////// case2
    const bodyError2 = {
      title: '         ', // error message: name max length is 30
      shortDescription: 'shortDescription max length 100',
      content: 'content'.repeat(1000), // error message: content max length is 1000
      // blogId: 'error blogId', // no error message
    }

    const responseCreatePostError2 = await superRequest
      .post(PATHS.POSTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreatePostError2.body).toEqual({
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

    //////// case3
    const bodyError3 = {
      title: ['title'],
      // shortDescription: 'shortDescription',
      content: '',
      blogId: new ObjectId(),
    }

    const responseCreatePostError3 = await superRequest
      .post(PATHS.POSTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError3)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreatePostError3.body).toEqual({
      errorsMessages: [
        {
          message: 'title must be a string',
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
          message: 'blog with provided id does not exist',
          field: 'blogId',
        },
      ],
    })
  })

  it('create a comment of post', async () => {
    const responseGetArrangedPosts = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const body: CreateCommentOfPostBody = {
      content: 'content length is between 20 and 300',
    }

    const responseCreateComment = await superRequest
      .post(`${PATHS.POSTS}/${responseGetArrangedPosts.body.items[0].id}/comments`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.CREATED_201)

    expect(responseCreateComment.body).toMatchObject({
      id: expect.any(String),
      content: body.content,
      postId: responseGetArrangedPosts.body.items[0].id,
      createdAt: expect.any(String),
    })
  })

  it('send error for not correct format blog id, non-existing blog in create a comment of post', async () => {
    ////////// case1: post id is not MongoDb _id format with correct body
    const paramsIdNonExisting1 = 'paramsNotCorrect'

    const body1: CreateCommentOfPostBody = {
      content: 'content length is between 20 and 300',
    }

    const responseCreateCommentError1 = await superRequest
      .post(`${PATHS.POSTS}/${paramsIdNonExisting1}/comments`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(body1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseCreateCommentError1.body).toMatchObject({
      errorsMessages: [
        {
          message: 'post id must be in a valid format',
          field: 'params',
        },
      ],
    })

    ////////// case2: non-existing blog id (blog id is correct format of MongoDb _id) with correct body

    const paramsIdNonExisting2 = new ObjectId()

    const body2: CreateCommentOfPostBody = {
      content: 'content length is between 20 and 300',
    }

    const responseCreatePostError2 = await superRequest
      .post(`${PATHS.POSTS}/${paramsIdNonExisting2}/comments`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(body2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseCreatePostError2.body).toMatchObject({
      errorsMessages: [
        {
          message: 'post with provided id does not exist',
          field: 'params',
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

  it('send error for not correct body in update post', async () => {
    ///////// case1
    const responseGetArrangedPosts = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const bodyError1 = {
      title: 'title'.repeat(30),
      // shortDescription: 'shortDescription max length 100',
      content: 'content max length 1000',
      blogId: 'formatNotCorrect',
      unexpectedKey: 'unexpectedValue',
    }

    const responseUpdatePostError1 = await superRequest
      .put(`${PATHS.POSTS}/${responseGetArrangedPosts.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseUpdatePostError1.body).toEqual({
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
          message: 'blogId must be in a valid format',
          field: 'blogId',
        },
      ],
    })

    ///////// case2
    const bodyError2 = {
      title: '       ',
      shortDescription: 'shortDescription max length 100',
      content: 'content'.repeat(1000),
      blogId: responseGetArrangedPosts.body.items[0].blogId,
    }

    const responseUpdatePostError2 = await superRequest
      .put(`${PATHS.POSTS}/${responseGetArrangedPosts.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseUpdatePostError2.body).toEqual({
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

    ///////// case3: non-existing blogId (but correct MongoDb -id format) and correct other fields
    const bodyError3 = {
      title: 'some title',
      shortDescription: 'some shortDescription',
      content: 'some content',
      blogId: new ObjectId(),
    }

    const responseUpdatePostError3 = await superRequest
      .put(`${PATHS.POSTS}/${responseGetArrangedPosts.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError3)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseUpdatePostError3.body).toEqual({
      errorsMessages: [
        {
          message: 'blog with provided id does not exist',
          field: 'blogId',
        },
      ],
    })
  })

  it('send error for not correct format post id params, non-existing post id params in update post', async () => {
    ////////// case1: post id params not correct MongoDb _id format
    const paramsUpdateError1 = 'formatNotCorrect'

    const bodyUpdateError1 = {}

    const responseUpdatePostError1 = await superRequest
      .put(`${PATHS.POSTS}/${paramsUpdateError1}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyUpdateError1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseUpdatePostError1.body).toEqual({
      errorsMessages: [
        {
          field: 'params',
          message: 'post id must be in a valid format',
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

    ////////// case2: post id params non-existing (but correct MongoDb _id format) with correct body

    const responseGetArrangedPosts = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const paramsUpdateError2 = new ObjectId()

    const bodyUpdateError2 = {
      title: 'some title',
      shortDescription: 'some shortDescription',
      content: 'some content',
      blogId: responseGetArrangedPosts.body.items[0].blogId,
    }

    const responseUpdatePostError2 = await superRequest
      .put(`${PATHS.POSTS}/${paramsUpdateError2}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyUpdateError2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseUpdatePostError2.body).toEqual({
      errorsMessages: [
        {
          field: 'params',
          message: 'post with provided id does not exist',
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

  it('send error for post id not correct format, not existing post id in delete post', async () => {
    ////////// case1: post id params not correct format MongoDb id
    const paramsDeleteError1 = 'formatNotCorrect'

    const responseDeletePos1 = await superRequest
      .delete(`${PATHS.POSTS}/${paramsDeleteError1}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseDeletePos1.body).toEqual({
      errorsMessages: [
        {
          message: 'post id must be in a valid format',
          field: 'params',
        },
      ],
    })

    ////////// case1: non-existing post id params (but correct format MongoDb id)
    const paramsDeleteError2 = new ObjectId()

    const responseDeletePos2 = await superRequest
      .delete(`${PATHS.POSTS}/${paramsDeleteError2}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseDeletePos2.body).toEqual({
      errorsMessages: [
        {
          message: 'post with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })
})
