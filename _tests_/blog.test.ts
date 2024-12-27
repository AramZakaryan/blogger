import { superRequest } from './testHelpers'
import { PATHS } from '../src/common'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Collection, MongoClient } from 'mongodb'
import { BlogDbType, PostDbType } from '../src/types'
import { blogCollection } from '../src/db/mongo'
import { dataSet1 } from './datasets'
import { setDB } from '../src/db'

let mongoServer: MongoMemoryServer
let client: MongoClient

describe('/blogs', () => {
  beforeEach(async () => {
    await setDB(dataSet1)
  })
  afterAll(async () => {
    await setDB(dataSet1)
  })

  it('should get array of blogs', async () => {
    const response = await superRequest.get(PATHS.BLOGS).expect(200)

    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBe(15)

    expect(Object.keys(response.body[0]).length).toBe(5)
    expect(Object.keys(response.body[7]).length).toBe(5)
    expect(Object.keys(response.body[14]).length).toBe(5)
  })

  it('should get the blog', async () => {
    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200)

    const responseFindBlog0 = await superRequest
      .get(`${PATHS.BLOGS}/${responseGetBlogs.body[0]._id}`)
      .expect(200)
    const responseFindBlog7 = await superRequest
      .get(`${PATHS.BLOGS}/${responseGetBlogs.body[7]._id}`)
      .expect(200)
    const responseFindBlog14 = await superRequest
      .get(`${PATHS.BLOGS}/${responseGetBlogs.body[14]._id}`)
      .expect(200)

    expect(responseFindBlog0.body).toBeInstanceOf(Object)
    expect(responseFindBlog0.body._id).toBe(responseGetBlogs.body[0]._id)
    expect(Object.keys(responseFindBlog0.body).length).toBe(5)

    expect(responseFindBlog7.body).toBeInstanceOf(Object)
    expect(responseFindBlog7.body._id).toBe(responseGetBlogs.body[7]._id)
    expect(Object.keys(responseFindBlog7.body).length).toBe(5)

    expect(responseFindBlog14.body).toBeInstanceOf(Object)
    expect(responseFindBlog14.body._id).toBe(responseGetBlogs.body[14]._id)
    expect(Object.keys(responseFindBlog14.body).length).toBe(5)
  })

  it('send error for non-existing blog', async () => {
    const paramsIdNonExisting = 'paramsNonExisting'

    const responseFindBlogError = await superRequest
      .get(`${PATHS.BLOGS}/${paramsIdNonExisting}`)
      .expect(404)

    expect(responseFindBlogError.body).toBeInstanceOf(Object)
    expect(responseFindBlogError.body).toEqual({
      errorsMessages: [
        {
          message: 'blog with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })

  it('send error for non-existing credentials (header) in create, update, delete blog', async () => {
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
      .expect(401)

    expect(responseCreateBlog.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })

    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200)

    const bodyUpdate0 = {
      name: 'new2 name max15',
      description: 'description2 max length 500',
      websiteUrl: 'https://someurl2.com',
    }

    const responseUpdateBlog = await superRequest
      .put(`${PATHS.BLOGS}/${responseGetBlogs.body[0]._id}`)
      .set('Authorization', '') // setting headers
      .send(bodyUpdate0)
      .expect(401)

    expect(responseUpdateBlog.body).toEqual({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })

    const responseDeleteBlog = await superRequest
      .delete(`${PATHS.BLOGS}/${responseGetBlogs.body[0]._id}`)
      .set('Authorization', '') // setting headers
      .expect(401)

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
    const body = {
      name: 'name max len 15',
      description: 'description max length 500',
      websiteUrl: 'https://someurl.com',
    }

    const responseCreateBlog = await superRequest
      .post(PATHS.BLOGS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(201)

    expect(responseCreateBlog.body).toBeInstanceOf(Object)

    expect(responseCreateBlog.body._id).not.toBe('')
    expect(responseCreateBlog.body.name).toBe(body.name)
    expect(responseCreateBlog.body.description).toBe(body.description)
    expect(responseCreateBlog.body.websiteUrl).toBe(body.websiteUrl)
  })

  it('send error for empty, non-object body in create blog', async () => {
    const bodyNonExisting = undefined

    const responseCreateBlogToBodyNonExisting = await superRequest
      .post(PATHS.BLOGS)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyNonExisting)
      .expect('Content-Type', /json/)
      .expect(400)

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
      .expect(400)

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
      .expect(400)

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
      .expect(400)

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
      .expect(400)

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
    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200)

    const bodyUpdate0 = {
      name: 'new2 name max15',
      description: 'description2 max length 500',
      websiteUrl: 'https://someurl2.com',
    }

    await superRequest
      .put(`${PATHS.BLOGS}/${responseGetBlogs.body[0]._id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyUpdate0)
      .expect(204)

    const responseGetBlogsAfterUpdate0 = await superRequest.get(PATHS.BLOGS).expect(200)

    expect(responseGetBlogsAfterUpdate0.body[0]).toBeInstanceOf(Object)

    expect(responseGetBlogsAfterUpdate0.body[0]._id).toBe(responseGetBlogs.body[0]._id)
    expect(responseGetBlogsAfterUpdate0.body[0].name).toBe(bodyUpdate0.name)
    expect(responseGetBlogsAfterUpdate0.body[0].description).toBe(bodyUpdate0.description)
    expect(responseGetBlogsAfterUpdate0.body[0].websiteUrl).toBe(bodyUpdate0.websiteUrl)
  })

  it('send error for non-existing, empty, non-object body in update blog', async () => {
    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200)

    const bodyErrorV1 = {
      name: 'error name actual length is more than 15', // error message: name max length is 15
      // description: 'description max length 500', // error message: description is required
      websiteUrl: 'incorrect websiteUrl', // error message: websiteUrl incorrect format
      unexpectedKey: 'unexpectedValue', // no error message
    }

    const responseUpdateBlogErrorV1 = await superRequest
      .put(`${PATHS.BLOGS}/${responseGetBlogs.body[0]._id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV1)
      .expect('Content-Type', /json/)
      .expect(400)

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
      .put(`${PATHS.BLOGS}/${responseGetBlogs.body[0]._id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyErrorV2)
      .expect('Content-Type', /json/)
      .expect(400)

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

  it('send error for non-existing params in update blog', async () => {
    const paramsIdNonExisting = 'paramsNonExisting'

    const bodyUpdateError = {}

    const responseUpdateBlogError = await superRequest
      .put(`${PATHS.BLOGS}/${paramsIdNonExisting}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(bodyUpdateError)
      .expect('Content-Type', /json/)
      .expect(404)

    expect(responseUpdateBlogError.body).toEqual({
      errorsMessages: [
        {
          field: 'params',
          message: 'blog with provided id does not exist',
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
  })

  it('delete blog', async () => {
    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200)

    const responseFindBlog = await superRequest
      .get(`${PATHS.BLOGS}/${responseGetBlogs.body[0]._id}`)
      .expect(200)

    expect(responseFindBlog.body._id).toEqual(responseGetBlogs.body[0]._id)

    await superRequest
      .delete(`${PATHS.BLOGS}/${responseFindBlog.body._id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(204)

    const responseFindBlogAfterDelete = await superRequest
      .get(`${PATHS.BLOGS}/${responseGetBlogs.body[0]._id}`)
      .expect(404)

    expect(responseFindBlogAfterDelete.body).toEqual({
      errorsMessages: [
        {
          message: 'blog with provided id does not exist',
          field: 'params',
        },
      ],
    })
  })
})
