import { superRequest } from './testHelpers'
import { customSort, HTTP_STATUS_CODES, PATHS } from '../src/common'
import { runDB, setDB } from '../src/db'
import { commentsSetMapped, dataSet } from './datasets'
import { MongoClient, ObjectId } from 'mongodb'
import { config } from 'dotenv'
import { CreateCommentBody, GetArrangedCommentsQuery, UpdateCommentBody } from '../src/types'

config()

// let server: MongoMemoryServer
let client: MongoClient

const dbUrl = process.env.MONGO_URL || ''
const dbName = process.env.DB_NAME || ''

describe('/comments', () => {
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

  it('should get object containing comments', async () => {
    const responseGetArrangedComments = await superRequest
      .get(PATHS.COMMENTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(responseGetArrangedComments.body).toMatchObject({
      pagesCount: expect.any(Number),
      page: expect.any(Number),
      pageSize: expect.any(Number),
      totalCount: expect.any(Number),
      items: expect.any(Array),
    })
  })

  it('should get arranged comments', async () => {
    ////////// case 1: empty query

    const query1: GetArrangedCommentsQuery = {}

    const response1 = await superRequest
      .get(PATHS.COMMENTS)
      .query(query1)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response1.body).toEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 10,
      totalCount: 15,
      items: customSort(commentsSetMapped).slice(0, 10),
    })

    ////////// case 2

    const query2: GetArrangedCommentsQuery = { sortDirection: 'asc' }

    const response2 = await superRequest
      .get(PATHS.COMMENTS)
      .query(query2)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response2.body).toEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 10,
      totalCount: 15,
      items: customSort(commentsSetMapped, 'createdAt', query2.sortDirection).slice(0, 10),
    })

    ////////// case 3

    const query3: GetArrangedCommentsQuery = { pageNumber: 2 }

    const response3 = await superRequest
      .get(PATHS.COMMENTS)
      .query(query3)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response3.body).toEqual({
      pagesCount: 2,
      page: query3.pageNumber,
      pageSize: 10,
      totalCount: 15,
      items: customSort(commentsSetMapped).slice(10, 15),
    })

    ////////// case 4:

    const query4: GetArrangedCommentsQuery = { pageSize: 3 }

    const response4 = await superRequest
      .get(PATHS.COMMENTS)
      .query(query4)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response4.body).toEqual({
      pagesCount: 5,
      page: 1,
      pageSize: query4.pageSize,
      totalCount: 15,
      items: customSort(commentsSetMapped).slice(0, 3),
    })

    ///////// additional case 4.1: too big page size

    const query41: GetArrangedCommentsQuery = { pageSize: commentsSetMapped.length }

    const response41 = await superRequest
      .get(PATHS.COMMENTS)
      .query(query41)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response41.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: query41.pageSize,
      totalCount: 15,
      items: customSort(commentsSetMapped),
    })

    ////////// case with complex query 6

    const query6: GetArrangedCommentsQuery = {
      pageNumber: 2,
      pageSize: 3,
      sortBy: 'id',
    }

    const response6 = await superRequest
      .get(PATHS.COMMENTS)
      .query(query6)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response6.body).toEqual({
      pagesCount: 5,
      page: query6.pageNumber,
      pageSize: query6.pageSize,
      totalCount: 15,
      items: customSort(commentsSetMapped, query6.sortBy).slice(3, 6),
    })

    ////////// case with complex query 7

    const query7: GetArrangedCommentsQuery = {
      pageNumber: 3,
      pageSize: 4,
      sortBy: 'content',
      sortDirection: 'asc',
    }

    const response7 = await superRequest
      .get(PATHS.COMMENTS)
      .query(query7)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response7.body).toEqual({
      pagesCount: 4,
      page: query7.pageNumber,
      pageSize: query7.pageSize,
      totalCount: 15,
      items: customSort(commentsSetMapped, query7.sortBy, 'asc').slice(8, 12),
    })
  })

  it('should get error for wrong query to get arranged comments', async () => {
    ///////// case 1

    const query1: any = {
      pageNumber: -1,
      pageSize: 'a',
      sortBy: 'oyoy',
      sortDirection: 400,
    }

    const response1 = await superRequest
      .get(PATHS.COMMENTS)
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
          message: 'sortBy must be key of comment',
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
      .get(PATHS.COMMENTS)
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
          message: 'sortBy must be key of comment',
          field: 'query',
        },
      ],
    })
  })

  it('should get the comment', async () => {
    const responseGetArrangedCommentss = await superRequest
      .get(PATHS.COMMENTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    for (let i = 0; i < responseGetArrangedCommentss.body.items.length; i++) {
      const responseFindComment = await superRequest
        .get(`${PATHS.COMMENTS}/${responseGetArrangedCommentss.body.items[i].id}`)
        .expect(HTTP_STATUS_CODES.OK_200)

      expect(responseFindComment.body).toEqual(responseGetArrangedCommentss.body.items[i])
    }
  })

  it('send error for not correct format comment id, non-existing comment', async () => {
    ////////// case1: not correct MongoDb _id format for comment id
    const paramsError1 = 'paramsNotCorrect'

    const responseFindCommentError1 = await superRequest
      .get(`${PATHS.COMMENTS}/${paramsError1}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseFindCommentError1.body).toEqual({
      errorsMessages: [
        {
          message: 'comment id must be in a valid format',
          field: 'params',
        },
      ],
    })

    ////////// case2: non-existing comment id (but correct MongoDb _id format for comment id)
    const paramsError2 = new ObjectId()

    const responseFindCommentError2 = await superRequest
      .get(`${PATHS.COMMENTS}/${paramsError2}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseFindCommentError2.body).toEqual({
      errorsMessages: [
        {
          message: 'comment with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })

  it('send error for non-existing credentials (header) in create, update, delete comment', async () => {
    const responseGetComments = await superRequest
      .get(PATHS.COMMENTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    ////////// case2: non-existing credentials (header) in create comment

    const bodyCreate = {
      content: 'content min length 20 name max length 300',
      postId: responseGetComments.body.items[0].id,
    }

    const responseCreateComment = await superRequest
      .post(PATHS.COMMENTS)
      .set('Authorization', '') // setting headers
      .send(bodyCreate)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseCreateComment.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })

    ////////// case2: non-existing credentials (header) in update comment

    const bodyUpdate = {
      content: 'new content min length 20 name max length 300',
      postId: responseGetComments.body.items[0].id,
    }

    const responseUpdateComment = await superRequest
      .put(`${PATHS.COMMENTS}/${responseGetComments.body.items[0].id}`)
      .set('Authorization', '') // setting headers
      .send(bodyUpdate)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseUpdateComment.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })

    ////////// case2: non-existing credentials (header) in update comment

    const responseDeleteComment = await superRequest
      .delete(`${PATHS.COMMENTS}/${responseGetComments.body.items[0].id}`)
      .set('Authorization', '') // setting headers
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseDeleteComment.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })
  })

  it('create a comment', async () => {
    const responseGetArrangedPosts = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const body: CreateCommentBody = {
      content: 'content min length 20 name max length 300',
      postId: responseGetArrangedPosts.body.items[0].id,
    }

    const responseCreateComment = await superRequest
      .post(PATHS.COMMENTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.CREATED_201)

    expect(responseCreateComment.body).toMatchObject({
      id: expect.any(String),
      content: body.content,
      postId: body.postId,
      createdAt: expect.any(String),
    })
  })

  it('send error for non-existing, empty, non-object body in create comment', async () => {
    ////////// case1: non-existing body in create comment

    const bodyNonExisting = undefined

    const responseCreateCommentToBodyNonExisting = await superRequest
      .post(PATHS.COMMENTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyNonExisting)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateCommentToBodyNonExisting.body).toEqual({
      errorsMessages: [
        {
          message: 'content is required',
          field: 'content',
        },
        {
          message: 'postId is required',
          field: 'postId',
        },
      ],
    })

    ////////// case2: empty body in create comment

    const bodyEmpty = {}

    const responseCreateCommentToBodyEmpty = await superRequest
      .post(PATHS.COMMENTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyEmpty)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateCommentToBodyEmpty.body).toEqual({
      errorsMessages: [
        {
          message: 'content is required',
          field: 'content',
        },
        {
          message: 'postId is required',
          field: 'postId',
        },
      ],
    })

    ////////// case3: non-object body in create comment

    const bodyArray = ['element']

    const responseCreateCommentToyBodyArray = await superRequest
      .post(PATHS.COMMENTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyArray)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateCommentToyBodyArray.body).toEqual({
      errorsMessages: [
        {
          message: 'content is required',
          field: 'content',
        },
        {
          message: 'postId is required',
          field: 'postId',
        },
      ],
    })
  })

  it('send error for error body in create comment', async () => {
    ////////// case1
    const bodyError1 = {
      // content: 'content max length 1000', // error message: content is required
      postId: 'formatNotCorrect', // error message: postId must be in a valid format
      unexpectedKey: 'unexpectedValue', // no error message
    }

    const responseCreateCommentError1 = await superRequest
      .post(PATHS.COMMENTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateCommentError1.body).toEqual({
      errorsMessages: [
        {
          message: 'content is required',
          field: 'content',
        },
        {
          message: 'postId must be in a valid format',
          field: 'postId',
        },
      ],
    })

    ////////// case2
    const bodyError2 = {
      content: 'content'.repeat(1000), // error message: content max length is 300
      // postId: 'error postId', // no error message
    }

    const responseCreateCommentError2 = await superRequest
      .post(PATHS.COMMENTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateCommentError2.body).toEqual({
      errorsMessages: [
        {
          message: 'content length is between 20 and 300',
          field: 'content',
        },
        {
          message: 'postId is required',
          field: 'postId',
        },
      ],
    })

    //////// case3
    const bodyError3 = {
      content: '',
      postId: new ObjectId(),
    }

    const responseCreateCommentError3 = await superRequest
      .post(PATHS.COMMENTS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError3)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateCommentError3.body).toEqual({
      errorsMessages: [
        {
          message: 'content is required',
          field: 'content',
        },
        {
          message: 'post with provided id does not exist',
          field: 'postId',
        },
      ],
    })
  })

  it('update comment', async () => {
    const responseGetArrangedPosts = await superRequest
      .get(PATHS.POSTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const randomPosts = Array.from(
      { length: 10 },
      () => responseGetArrangedPosts.body.items[~~(Math.random() * 10)],
    )

    const responseGetArrangedComments = await superRequest
      .get(PATHS.COMMENTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    for (let i = 0; i < responseGetArrangedComments.body.items.length; i++) {
      const body: UpdateCommentBody = {
        content: `new content min length 20 name max length 300${i}`,
        postId: randomPosts[i].id,
      }

      await superRequest
        .put(`${PATHS.COMMENTS}/${responseGetArrangedComments.body.items[i].id}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(body)
        .expect(HTTP_STATUS_CODES.NO_CONTENT_204)
    }

    const responseGetArrangedCommentsAfterUpdate = await superRequest
      .get(PATHS.COMMENTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    for (let i = 0; i < responseGetArrangedCommentsAfterUpdate.body.items.length; i++) {
      expect(responseGetArrangedCommentsAfterUpdate.body.items[i]).toEqual({
        id: responseGetArrangedComments.body.items[i].id,
        content: `new content min length 20 name max length 300${i}`,
        postId: randomPosts[i].id,
        createdAt: responseGetArrangedComments.body.items[i].createdAt,
      })
    }
  })

  it('send error for not correct body in update comment', async () => {
    ///////// case1
    const responseGetArrangedComments = await superRequest
      .get(PATHS.COMMENTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const bodyError1 = {
      content: 'new content min length 20 name max length 300${i}'.repeat(10),
      postId: 'formatNotCorrect',
      unexpectedKey: 'unexpectedValue',
    }

    const responseUpdateCommentError1 = await superRequest
      .put(`${PATHS.COMMENTS}/${responseGetArrangedComments.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseUpdateCommentError1.body).toEqual({
      errorsMessages: [
        {
          message: 'content length is between 20 and 300',
          field: 'content',
        },
        {
          message: 'postId must be in a valid format',
          field: 'postId',
        },
      ],
    })

    ///////// case2
    const bodyError2 = {
      content: 'short content',
      postId: responseGetArrangedComments.body.items[0].postId,
    }

    const responseUpdateCommentError2 = await superRequest
      .put(`${PATHS.COMMENTS}/${responseGetArrangedComments.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseUpdateCommentError2.body).toEqual({
      errorsMessages: [
        {
          message: 'content length is between 20 and 300',
          field: 'content',
        },
      ],
    })

    ///////// case3: non-existing postId (but correct MongoDb -id format) and correct other fields
    const bodyError3 = {
      content: 'content min length 20 name max length 300',
      postId: new ObjectId(),
    }

    const responseUpdateCommentError3 = await superRequest
      .put(`${PATHS.COMMENTS}/${responseGetArrangedComments.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyError3)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseUpdateCommentError3.body).toEqual({
      errorsMessages: [
        {
          message: 'post with provided id does not exist',
          field: 'postId',
        },
      ],
    })
  })

  it('send error for not correct format comment id params, non-existing comment id params in update comment', async () => {
    ////////// case1: comment id params not correct MongoDb _id format
    const paramsUpdateError1 = 'formatNotCorrect'

    const bodyUpdateError1 = {}

    const responseUpdateCommentError1 = await superRequest
      .put(`${PATHS.COMMENTS}/${paramsUpdateError1}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyUpdateError1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseUpdateCommentError1.body).toEqual({
      errorsMessages: [
        {
          field: 'params',
          message: 'comment id must be in a valid format',
        },
        {
          message: 'content is required',
          field: 'content',
        },
        {
          message: 'postId is required',
          field: 'postId',
        },
      ],
    })

    ////////// case2: comment id params non-existing (but correct MongoDb _id format) with correct body

    const responseGetArrangedComments = await superRequest
      .get(PATHS.COMMENTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const paramsUpdateError2 = new ObjectId()

    const bodyUpdateError2 = {
      content: 'content length is between 20 and 300' ,
      postId: responseGetArrangedComments.body.items[0].postId,
    }

    const responseUpdateCommentError2 = await superRequest
      .put(`${PATHS.COMMENTS}/${paramsUpdateError2}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyUpdateError2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseUpdateCommentError2.body).toEqual({
      errorsMessages: [
        {
          field: 'params',
          message: 'comment with provided id does not exist',
        },
      ],
    })
  })

  it('delete comment', async () => {
    const responseGetArrangedComments = await superRequest
      .get(PATHS.COMMENTS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const responseFindComment = await superRequest
      .get(`${PATHS.COMMENTS}/${responseGetArrangedComments.body.items[0].id}`)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(responseFindComment.body.id).toEqual(responseGetArrangedComments.body.items[0].id)

    await superRequest
      .delete(`${PATHS.COMMENTS}/${responseFindComment.body.id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204)

    const responseFindCommentsAfterDelete = await superRequest
      .get(`${PATHS.COMMENTS}/${responseGetArrangedComments.body.items[0].id}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseFindCommentsAfterDelete.body).toEqual({
      errorsMessages: [
        {
          message: 'comment with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })

  it('send error for comment id not correct format, not existing comment id in delete comment', async () => {
    ////////// case1: comment id params not correct format MongoDb id
    const paramsDeleteError1 = 'formatNotCorrect'

    const responseDeletePos1 = await superRequest
      .delete(`${PATHS.COMMENTS}/${paramsDeleteError1}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseDeletePos1.body).toEqual({
      errorsMessages: [
        {
          message: 'comment id must be in a valid format',
          field: 'params',
        },
      ],
    })

    ////////// case1: non-existing comment id params (but correct format MongoDb id)
    const paramsDeleteError2 = new ObjectId()

    const responseDeletePos2 = await superRequest
      .delete(`${PATHS.COMMENTS}/${paramsDeleteError2}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseDeletePos2.body).toEqual({
      errorsMessages: [
        {
          message: 'comment with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })
})
