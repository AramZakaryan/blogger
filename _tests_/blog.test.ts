import { superRequest } from './testHelpers'
import { customFilter, customSort, HTTP_STATUS_CODES, PATHS } from '../src/common'
import { runDB, setDB } from '../src/db'
import { blogsSetMapped, dataSet } from './datasets'
import { MongoClient, ObjectId } from 'mongodb'
import { config } from 'dotenv'
import {
  CreateBlogBody,
  CreatePostOfBlogBody,
  GetArrangedBlogsQuery,
  GetArrangedPostsQuery,
  PostViewModel,
  UpdateBlogBody,
} from '../src/types'

config()

// let server: MongoMemoryServer
let client: MongoClient

const dbUrl = process.env.MONGO_URL || ''
const dbName = process.env.DB_NAME || ''

describe('/blogs', () => {
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

  it('should get object containing blogs', async () => {
    const responseGetArrangedBlogs = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(responseGetArrangedBlogs.body).toMatchObject({
      pagesCount: expect.any(Number),
      page: expect.any(Number),
      pageSize: expect.any(Number),
      totalCount: expect.any(Number),
      items: expect.any(Array),
    })
  })

  it('should get arranged blogs', async () => {
    ////////// case 1: empty query

    const query1: GetArrangedBlogsQuery = {}

    const response1 = await superRequest
      .get(PATHS.BLOGS)
      .query(query1)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response1.body).toEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 10,
      totalCount: 15,
      items: customSort(blogsSetMapped).slice(0, 10),
    })

    ////////// case 2

    const query2: GetArrangedBlogsQuery = { sortDirection: 'asc' }

    const response2 = await superRequest
      .get(PATHS.BLOGS)
      .query(query2)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response2.body).toEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 10,
      totalCount: 15,
      items: customSort(blogsSetMapped, 'createdAt', query2.sortDirection).slice(0, 10),
    })

    ////////// case 3

    const query3: GetArrangedBlogsQuery = { pageNumber: 2 }

    const response3 = await superRequest
      .get(PATHS.BLOGS)
      .query(query3)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response3.body).toEqual({
      pagesCount: 2,
      page: query3.pageNumber,
      pageSize: 10,
      totalCount: 15,
      items: customSort(blogsSetMapped).slice(10, 15),
    })

    ////////// case 4:

    const query4: GetArrangedBlogsQuery = { pageSize: 3 }

    const response4 = await superRequest
      .get(PATHS.BLOGS)
      .query(query4)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response4.body).toEqual({
      pagesCount: 5,
      page: 1,
      pageSize: query4.pageSize,
      totalCount: 15,
      items: customSort(blogsSetMapped).slice(0, 3),
    })

    ///////// additional case 4.1: too big page size

    const query41: GetArrangedBlogsQuery = { pageSize: blogsSetMapped.length }

    const response41 = await superRequest
      .get(PATHS.BLOGS)
      .query(query41)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response41.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: query41.pageSize,
      totalCount: 15,
      items: customSort(blogsSetMapped),
    })

    ////////// case 5:

    const query5: GetArrangedBlogsQuery = { searchNameTerm: 'AbCd' }

    const response5 = await superRequest
      .get(PATHS.BLOGS)
      .query(query5)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response5.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 4,
      items: customSort(blogsSetMapped)
        .filter(({ name }) => customFilter(name, query5.searchNameTerm))
        .slice(0, 10),
    })

    ////////// case with complex query 6

    const query6: GetArrangedBlogsQuery = {
      pageNumber: 2,
      pageSize: 2,
      sortBy: 'id',
      sortDirection: 'asc',
      searchNameTerm: 'AbCd',
    }

    const response6 = await superRequest
      .get(PATHS.BLOGS)
      .query(query6)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response6.body).toEqual({
      pagesCount: 2,
      page: query6.pageNumber,
      pageSize: query6.pageSize,
      totalCount: 4,
      items: customSort(blogsSetMapped, query6.sortBy, query6.sortDirection)
        .filter(({ name }) => customFilter(name, query6.searchNameTerm))
        .slice(2, 4),
    })

    ////////// case with complex query 7

    const query7: GetArrangedBlogsQuery = {
      pageNumber: 1,
      pageSize: 2,
      sortBy: 'isMembership',
      searchNameTerm: 'mnOP',
    }

    const response7 = await superRequest
      .get(PATHS.BLOGS)
      .query(query7)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(response7.body).toEqual({
      pagesCount: 2,
      page: query7.pageNumber,
      pageSize: query7.pageSize,
      totalCount: 3,
      items: customSort(blogsSetMapped, query7.sortBy)
        .filter(({ name }) => customFilter(name, query7.searchNameTerm))
        .slice(0, 2),
    })
  })

  it('should get error for wrong query to get arranged blogs', async () => {
    ///////// case 1

    const query1: any = {
      pageNumber: -1,
      pageSize: 'a',
      sortBy: 'oyoy',
      sortDirection: 400,
    }

    const response1 = await superRequest
      .get(PATHS.BLOGS)
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
      .get(PATHS.BLOGS)
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

  it('should get the blog', async () => {
    const responseGetArrangedBlogs = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    for (let i = 0; i < responseGetArrangedBlogs.body.items.length; i++) {
      const responseFindBlog = await superRequest
        .get(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[i].id}`)
        .expect(HTTP_STATUS_CODES.OK_200)

      expect(responseFindBlog.body).toEqual(responseGetArrangedBlogs.body.items[i])
    }
  })

  it('should get arranged posts of blog', async () => {
    const queryGetArrangedBlogs: GetArrangedBlogsQuery = {
      pageSize: 15,
    }

    const responseGetArrangedBlogs = await superRequest
      .get(PATHS.BLOGS)
      .query(queryGetArrangedBlogs)
      .expect(HTTP_STATUS_CODES.OK_200)

    ////////// case 1

    for (let i = 0; i < responseGetArrangedBlogs.body.items.length; i++) {
      const queryGetArrangedPosts: GetArrangedPostsQuery = {
        pageSize: 15,
      }

      const responseGetArrangedPosts = await superRequest
        .get(PATHS.POSTS)
        .query(queryGetArrangedPosts)
        .expect(HTTP_STATUS_CODES.OK_200)

      const queryGetArrangedPostsOfBlog: GetArrangedPostsQuery = {
        pageSize: 15,
      }

      const responseGetArrangedPostsOfBlog = await superRequest
        .get(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[i].id}/posts`)
        .query(queryGetArrangedPostsOfBlog)
        .expect(HTTP_STATUS_CODES.OK_200)

      expect(
        responseGetArrangedPosts.body.items.filter((item: PostViewModel) => {
          return item.blogId === responseGetArrangedBlogs.body.items[i].id
        }),
      ).toEqual(responseGetArrangedPostsOfBlog.body.items)
    }

    ////////// case 2

    for (let i = 0; i < responseGetArrangedBlogs.body.items.length; i++) {
      const queryGetArrangedPosts: GetArrangedPostsQuery = {
        pageSize: 15,
        sortDirection: 'asc',
      }

      const responseGetArrangedPosts = await superRequest
        .get(PATHS.POSTS)
        .query(queryGetArrangedPosts)
        .expect(HTTP_STATUS_CODES.OK_200)

      const queryGetArrangedPostsOfBlog: GetArrangedPostsQuery = {
        pageSize: 15,
        sortDirection: 'asc',
      }

      const responseGetArrangedPostsOfBlog = await superRequest
        .get(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[i].id}/posts`)
        .query(queryGetArrangedPostsOfBlog)
        .expect(HTTP_STATUS_CODES.OK_200)

      expect(
        responseGetArrangedPosts.body.items.filter(
          (item: PostViewModel) => item.blogId === responseGetArrangedBlogs.body.items[i].id,
        ),
      ).toEqual(responseGetArrangedPostsOfBlog.body.items)
    }

    ////////// case 3

    for (let i = 0; i < responseGetArrangedBlogs.body.items.length; i++) {
      const queryGetArrangedPosts: GetArrangedPostsQuery = {
        pageSize: 15,
        sortBy: 'id',
      }

      const responseGetArrangedPosts = await superRequest
        .get(PATHS.POSTS)
        .query(queryGetArrangedPosts)
        .expect(HTTP_STATUS_CODES.OK_200)

      const queryGetArrangedPostsOfBlog: GetArrangedPostsQuery = {
        pageSize: 15,
        sortBy: 'id',
      }

      const responseGetArrangedPostsOfBlog = await superRequest
        .get(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[i].id}/posts`)
        .query(queryGetArrangedPostsOfBlog)
        .expect(HTTP_STATUS_CODES.OK_200)

      expect(
        responseGetArrangedPosts.body.items.filter(
          (item: PostViewModel) => item.blogId === responseGetArrangedBlogs.body.items[i].id,
        ),
      ).toEqual(responseGetArrangedPostsOfBlog.body.items)
    }

    ////////// case with complex query 4

    for (let i = 0; i < responseGetArrangedBlogs.body.items.length; i++) {
      const queryGetArrangedPosts: GetArrangedPostsQuery = {
        pageSize: 15,
        sortBy: 'id',
        sortDirection: 'asc',
      }

      const responseGetArrangedPosts = await superRequest
        .get(PATHS.POSTS)
        .query(queryGetArrangedPosts)
        .expect(HTTP_STATUS_CODES.OK_200)

      const queryGetArrangedPostsOfBlog: GetArrangedPostsQuery = {
        pageSize: 15,
        sortBy: 'id',
        sortDirection: 'asc',
      }

      const responseGetArrangedPostsOfBlog = await superRequest
        .get(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[i].id}/posts`)
        .query(queryGetArrangedPostsOfBlog)
        .expect(HTTP_STATUS_CODES.OK_200)

      expect(
        responseGetArrangedPosts.body.items.filter(
          (item: PostViewModel) => item.blogId === responseGetArrangedBlogs.body.items[i].id,
        ),
      ).toEqual(responseGetArrangedPostsOfBlog.body.items)
    }

    ////////// case with complex query 5


    for (let i = 0; i < responseGetArrangedBlogs.body.items.length; i++) {
      const queryGetArrangedPosts: GetArrangedPostsQuery = {
        pageSize: 15,
        sortBy: 'content',
        sortDirection: 'asc',
      }

      const responseGetArrangedPosts = await superRequest
        .get(PATHS.POSTS)
        .query(queryGetArrangedPosts)
        .expect(HTTP_STATUS_CODES.OK_200)

      const queryGetArrangedPostsOfBlog: GetArrangedPostsQuery = {
        pageSize: 15,
        sortBy: 'content',
        sortDirection: 'asc',
      }

      const responseGetArrangedPostsOfBlog = await superRequest
        .get(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[i].id}/posts`)
        .query(queryGetArrangedPostsOfBlog)
        .expect(HTTP_STATUS_CODES.OK_200)

      expect(
        responseGetArrangedPosts.body.items.filter(
          (item: PostViewModel) => item.blogId === responseGetArrangedBlogs.body.items[i].id,
        ),
      ).toEqual(responseGetArrangedPostsOfBlog.body.items)
    }
  })

  it('send error for not correct format blog id, non-existing blog', async () => {
    ////////// case1: blog id is not MongoDb _id format
    const paramsIdNonExisting1 = 'paramsNotCorrect'

    const responseFindBlogError1 = await superRequest
      .get(`${PATHS.BLOGS}/${paramsIdNonExisting1}`)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseFindBlogError1.body).toMatchObject({
      errorsMessages: [
        {
          message: 'blog id must be in a valid format',
          field: 'params',
        },
      ],
    })

    ////////// case2: non-existing blog id (blog id is correct format of MongoDb _id)
    const paramsIdNonExisting2 = new ObjectId()

    const responseFindBlogError2 = await superRequest
      .get(`${PATHS.BLOGS}/${paramsIdNonExisting2}`)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseFindBlogError2.body).toMatchObject({
      errorsMessages: [
        {
          message: 'blog with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })

  it('send error for non-existing credentials (header) in create, update, delete blog', async () => {
    ////////// case: create blog

    const bodyCreate = {
      name: 'name max len 15',
      description: 'description max length 500',
      websiteUrl: 'https://someurl.com',
    }

    const responseCreateBlog = await superRequest
      .post(PATHS.BLOGS)
      .set('Authorization', '') // setting headers
      .send(bodyCreate)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseCreateBlog.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })

    ////////// case: create post of blog

    const responseGetArrangedBlogs = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const bodyCreatePostOfBlog: CreatePostOfBlogBody = {
      title: 'new title',
      shortDescription: 'new shortDescription',
      content: 'new content',
    }

    const responseCreatePostOfBlog = await superRequest
      .post(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[0].id}/posts`)
      .set('Authorization', '') // setting headers
      .send(bodyCreatePostOfBlog)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseCreatePostOfBlog.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })

    ////////// case: update blog

    const bodyUpdate: UpdateBlogBody = {
      name: 'new name',
      description: 'new description',
      websiteUrl: 'https://someurl.com',
    }

    const responseUpdateBlog = await superRequest
      .put(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[0].id}`)
      .set('Authorization', '') // setting headers
      .send(bodyUpdate)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseUpdateBlog.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })

    ////////// case: delete blog

    const responseDeleteBlog = await superRequest
      .delete(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[0].id}`)
      .set('Authorization', '') // setting headers
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401)

    expect(responseDeleteBlog.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })
  })

  it('create a blog', async () => {
    const body: CreateBlogBody = {
      name: 'name max len 15',
      description: 'description max length 500',
      websiteUrl: 'https://someurl.com',
    }

    const responseCreateBlog = await superRequest
      .post(PATHS.BLOGS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.CREATED_201)

    expect(responseCreateBlog.body).toMatchObject({
      id: expect.any(String),
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
    })
  })

  it('create a post of blog', async () => {
    const responseGetArrangedBlogs = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const body: CreatePostOfBlogBody = {
      title: 'new title',
      shortDescription: 'new shortDescription',
      content: 'new content',
    }

    const responseCreatePost = await superRequest
      .post(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[0].id}/posts`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.CREATED_201)

    expect(responseCreatePost.body).toMatchObject({
      id: expect.any(String),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: responseGetArrangedBlogs.body.items[0].id,
      blogName: responseGetArrangedBlogs.body.items[0].name,
      createdAt: expect.any(String),
    })
  })

  it('send error for not correct format blog id, non-existing blog in create a post of blog', async () => {
    ////////// case1: blog id is not MongoDb _id format with correct body
    const paramsIdNonExisting1 = 'paramsNotCorrect'

    const body1: CreatePostOfBlogBody = {
      title: 'new title',
      shortDescription: 'new shortDescription',
      content: 'new content',
    }

    const responseCreatePostError1 = await superRequest
      .post(`${PATHS.BLOGS}/${paramsIdNonExisting1}/posts`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(body1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseCreatePostError1.body).toMatchObject({
      errorsMessages: [
        {
          message: 'blog id must be in a valid format',
          field: 'params',
        },
      ],
    })

    ////////// case2: non-existing blog id (blog id is correct format of MongoDb _id) with correct body

    const paramsIdNonExisting2 = new ObjectId()

    const body2: CreatePostOfBlogBody = {
      title: 'new title',
      shortDescription: 'new shortDescription',
      content: 'new content',
    }

    const responseCreatePostError2 = await superRequest
      .post(`${PATHS.BLOGS}/${paramsIdNonExisting2}/posts`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(body2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseCreatePostError2.body).toMatchObject({
      errorsMessages: [
        {
          message: 'blog with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })

  it('send error for empty, non-object body in create blog', async () => {
    const bodyNonExisting = undefined

    const responseCreateBlogToBodyNonExisting = await superRequest
      .post(PATHS.BLOGS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyNonExisting)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateBlogToBodyNonExisting.body).toEqual({
      errorsMessages: [
        {
          message: 'name is required',
          field: 'name',
        },
        {
          message: 'description is required',
          field: 'description',
        },
        {
          message: 'websiteUrl is required',
          field: 'websiteUrl',
        },
      ],
    })

    const bodyEmpty = {}

    const responseCreateBlogToBodyEmpty = await superRequest
      .post(PATHS.BLOGS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyEmpty)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateBlogToBodyEmpty.body).toEqual({
      errorsMessages: [
        {
          message: 'name is required',
          field: 'name',
        },
        {
          message: 'description is required',
          field: 'description',
        },
        {
          message: 'websiteUrl is required',
          field: 'websiteUrl',
        },
      ],
    })

    const bodyArray = ['element']

    const responseCreateBlogToyBodyArray = await superRequest
      .post(PATHS.BLOGS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyArray)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateBlogToyBodyArray.body).toEqual({
      errorsMessages: [
        {
          message: 'name is required',
          field: 'name',
        },
        {
          message: 'description is required',
          field: 'description',
        },
        {
          message: 'websiteUrl is required',
          field: 'websiteUrl',
        },
      ],
    })
  })

  it('send error for error body in create blog', async () => {
    const bodyErrorV1 = {
      name: 'error name actual length is more than 15', // error message: name max length is 15
      // description: 'description max length 500', // error message: description is required
      websiteUrl: 'incorrect websiteUrl', // error message: websiteUrl incorrect format
      unexpectedKey: 'unexpectedValue', // no error message
    }

    const responseCreateBlogErrorV1 = await superRequest
      .post(PATHS.BLOGS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateBlogErrorV1.body).toEqual({
      errorsMessages: [
        {
          message: 'name max length is 15',
          field: 'name',
        },
        {
          message: 'description is required',
          field: 'description',
        },
        {
          field: 'websiteUrl',
          message: 'websiteUrl incorrect format',
        },
      ],
    })

    const bodyErrorV2 = {
      name: '       ', // error message: name is empty
      description: 'description'.repeat(500), // error message: description max length is 500
      websiteUrl: 'https://' + 'someUrl'.repeat(100) + '.com', // error message: websiteUrl max length is 100
    }

    const responseCreateBlogErrorV2 = await superRequest
      .post(PATHS.BLOGS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseCreateBlogErrorV2.body).toEqual({
      errorsMessages: [
        {
          message: 'name is required',
          field: 'name',
        },
        {
          field: 'description',
          message: 'description max length is 500',
        },
        {
          field: 'websiteUrl',
          message: 'websiteUrl max length is 100',
        },
      ],
    })
  })

  it('update blog', async () => {
    const responseGetArrangedBlogs = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    for (let i = 0; i < responseGetArrangedBlogs.body.items.length; i++) {
      const body: UpdateBlogBody = {
        name: `new name ${i}`,
        description: `new description ${i}`,
        websiteUrl: `https://newurl${i}.com`,
      }

      await superRequest
        .put(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[i].id}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(body)
        .expect(HTTP_STATUS_CODES.NO_CONTENT_204)
    }

    const responseGetArrangedBlogsAfterUpdate = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    for (let i = 0; i < responseGetArrangedBlogsAfterUpdate.body.items.length; i++) {
      expect(responseGetArrangedBlogsAfterUpdate.body.items[i]).toEqual({
        id: responseGetArrangedBlogs.body.items[i].id,
        name: `new name ${i}`,
        description: `new description ${i}`,
        websiteUrl: `https://newurl${i}.com`,
        createdAt: responseGetArrangedBlogs.body.items[i].createdAt,
        isMembership: responseGetArrangedBlogs.body.items[i].isMembership,
      })
    }
  })

  it('send error for non-existing, empty, non-object body in update blog', async () => {
    const responseGetArrangedBlogs = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const bodyErrorV1 = {
      name: 'error name actual length is more than 15', // error message: name max length is 15
      // description: 'description max length 500', // error message: description is required
      websiteUrl: 'incorrect websiteUrl', // error message: websiteUrl incorrect format
      unexpectedKey: 'unexpectedValue', // no error message
    }

    const responseUpdateBlogErrorV1 = await superRequest
      .put(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseUpdateBlogErrorV1.body).toEqual({
      errorsMessages: [
        {
          message: 'name max length is 15',
          field: 'name',
        },
        {
          field: 'description',
          message: 'description is required',
        },
        {
          field: 'websiteUrl',
          message: 'websiteUrl incorrect format',
        },
      ],
    })

    const bodyErrorV2 = {
      name: '       ', // error message: name is empty
      description: 'description'.repeat(500), // error message: description max length is 500
      websiteUrl: 'https://' + 'someUrl'.repeat(100) + '.com', // error message: websiteUrl max length is 100
    }

    const responseUpdateBlogErrorV2 = await superRequest
      .put(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[0].id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400)

    expect(responseUpdateBlogErrorV2.body).toEqual({
      errorsMessages: [
        {
          message: 'name is required',
          field: 'name',
        },
        {
          field: 'description',
          message: 'description max length is 500',
        },
        {
          field: 'websiteUrl',
          message: 'websiteUrl max length is 100',
        },
      ],
    })
  })

  it('send error for not correct format blog id, non-existing params in update blog', async () => {
    ///////// case1: blog id params is not correct MongoDb _id and empty body

    const paramsError1 = 'paramsNotCorrect'

    const bodyUpdateError1 = {}

    const responseUpdateBlogError1 = await superRequest
      .put(`${PATHS.BLOGS}/${paramsError1}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyUpdateError1)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseUpdateBlogError1.body).toEqual({
      errorsMessages: [
        {
          field: 'params',
          message: 'blog id must be in a valid format',
        },
        {
          message: 'name is required',
          field: 'name',
        },
        {
          field: 'description',
          message: 'description is required',
        },
        {
          field: 'websiteUrl',
          message: 'websiteUrl is required',
        },
      ],
    })

    ///////// case2: blog id non-existing (but correct MongoDb _id) and with correct body

    // const paramsError2 = new ObjectId()
    const paramsError2 = '678bf09bb7324c4b1f61c4ba'

    const bodyUpdateError2 = {
      name: `new name`,
      description: `new description`,
      websiteUrl: `https://newurl.com`,
    }

    const responseUpdateBlogError2 = await superRequest
      .put(`${PATHS.BLOGS}/${paramsError2}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyUpdateError2)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseUpdateBlogError2.body).toEqual({
      errorsMessages: [
        {
          field: 'params',
          message: 'blog with provided id does not exist',
        },
      ],
    })
  })

  it('delete blog', async () => {
    const responseGetArrangedBlogs = await superRequest
      .get(PATHS.BLOGS)
      .expect(HTTP_STATUS_CODES.OK_200)

    const responseFindBlog = await superRequest
      .get(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[0].id}`)
      .expect(HTTP_STATUS_CODES.OK_200)

    expect(responseFindBlog.body.id).toEqual(responseGetArrangedBlogs.body.items[0].id)

    await superRequest
      .delete(`${PATHS.BLOGS}/${responseFindBlog.body.id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204)

    const responseFindBlogAfterDelete = await superRequest
      .get(`${PATHS.BLOGS}/${responseGetArrangedBlogs.body.items[0].id}`)
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseFindBlogAfterDelete.body).toEqual({
      errorsMessages: [
        {
          message: 'blog with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })

  it('send error for not correct format blog id, non-existing params in delete blog', async () => {
    ///////// case1: blog id params is not correct MongoDb _id
    const paramsError1 = 'paramsNotCorrect'

    const responseDeleteBlogError1 = await superRequest
      .delete(`${PATHS.BLOGS}/${paramsError1}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseDeleteBlogError1.body).toEqual({
      errorsMessages: [
        {
          message: 'blog id must be in a valid format',
          field: 'params',
        },
      ],
    })

    ///////// case2: non-existing blog id params (but correct MongoDb _id)
    const paramsError2 = new ObjectId()

    const responseDeleteBlogError2 = await superRequest
      .delete(`${PATHS.BLOGS}/${paramsError2}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404)

    expect(responseDeleteBlogError2.body).toEqual({
      errorsMessages: [
        {
          message: 'blog with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })
})
