import { superRequest } from './testHelpers'
import { PATHS } from '../src/common'
import { setDB } from '../src/db'
import { dataSet1 } from './datasets'

describe('/blogs', () => {
  beforeEach(async () => {
    setDB(dataSet1)
  })

  it('should get array of blogs', async () => {
    const response = await superRequest.get(PATHS.BLOGS).expect(200)

    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBe(15)

    expect(Object.keys(response.body[0]).length).toBe(4)
    expect(Object.keys(response.body[7]).length).toBe(4)
    expect(Object.keys(response.body[14]).length).toBe(4)
  })

  it('should get the blog', async () => {
    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200)

    const responseFindBlog0 = await superRequest
      .get(`${PATHS.BLOGS}/${responseGetBlogs.body[0].id}`)
      .expect(200)
    const responseFindBlog7 = await superRequest
      .get(`${PATHS.BLOGS}/${responseGetBlogs.body[7].id}`)
      .expect(200)
    const responseFindBlog14 = await superRequest
      .get(`${PATHS.BLOGS}/${responseGetBlogs.body[14].id}`)
      .expect(200)

    expect(responseFindBlog0.body).toBeInstanceOf(Object)
    expect(responseFindBlog0.body.id).toBe(responseGetBlogs.body[0].id)
    expect(Object.keys(responseFindBlog0.body).length).toBe(4)

    expect(responseFindBlog7.body).toBeInstanceOf(Object)
    expect(responseFindBlog7.body.id).toBe(responseGetBlogs.body[7].id)
    expect(Object.keys(responseFindBlog7.body).length).toBe(4)

    expect(responseFindBlog14.body).toBeInstanceOf(Object)
    expect(responseFindBlog14.body.id).toBe(responseGetBlogs.body[14].id)
    expect(Object.keys(responseFindBlog14.body).length).toBe(4)
  })

  it('create a blog', async () => {
    const body = {
      name: 'name max len 15',
      description: 'description max length 500',
      websiteUrl: 'websiteUrl  max length 500',
    }

    const responseCreateBlog = await superRequest
      .post(PATHS.BLOGS)
      .send(body)
      .expect('Content-Type', /json/)
      .expect(201)

    expect(responseCreateBlog.body).toBeInstanceOf(Object)

    expect(responseCreateBlog.body.id).not.toBe('')
    expect(responseCreateBlog.body.name).toBe(body.name)
    expect(responseCreateBlog.body.description).toBe(body.description)
    expect(responseCreateBlog.body.websiteUrl).toBe(body.websiteUrl)
  })

  it('send error for non-existing, empty, non-object body in create blog', async () => {
    const bodyNonExisting = undefined

    const responseCreateBlogToBodyNonExisting = await superRequest
      .post(PATHS.BLOGS)
      .send(bodyNonExisting)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreateBlogToBodyNonExisting.body).toEqual({
      errorsMessages: [
        {
          message: 'at least one field is required',
          field: 'body',
        },
      ],
    })

    const bodyEmpty = {}

    const responseCreateBlogToBodyEmpty = await superRequest
      .post(PATHS.BLOGS)
      .send(bodyEmpty)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreateBlogToBodyEmpty.body).toEqual({
      errorsMessages: [
        {
          message: 'at least one field is required',
          field: 'body',
        },
      ],
    })

    const bodyArray = ['element']

    const responseCreateBlogToyBodyArray = await superRequest
      .post(PATHS.BLOGS)
      .send(bodyArray)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreateBlogToyBodyArray.body).toEqual({
      errorsMessages: [
        {
          message: 'body must be an object',
          field: 'body',
        },
      ],
    })
  })

  it('send error for error body in create blog', async () => {
    const bodyError = {
      name: 'error name actual length is more than 15', // error message: name max length is 15
      // description: 'description max length 500', // error message: description is required
      websiteUrl: 'websiteUrl max length 500',
      unexpectedKey: 'unexpectedValue', // error message: Unexpected key
    }

    const responseCreateBlogError = await superRequest
      .post(PATHS.BLOGS)
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
          message: 'name max length is 15',
          field: 'name',
        },
        {
          message: 'description is required',
          field: 'description',
        },
      ],
    })
  })

  it('update blog', async () => {
    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200)

    const bodyUpdate0Name = {
      name: 'new name max 15',
    }
    const bodyUpdate0Description = {
      description: 'description max length 500',
    }
    const bodyUpdate0WebsiteUrl = {
      websiteUrl: 'websiteUrl  max length 500',
    }

    await superRequest
      .put(`${PATHS.BLOGS}/${responseGetBlogs.body[0].id}`)
      .send(bodyUpdate0Name)
      .expect(204)

    await superRequest
      .put(`${PATHS.BLOGS}/${responseGetBlogs.body[0].id}`)
      .send(bodyUpdate0Description)
      .expect(204)

    await superRequest
      .put(`${PATHS.BLOGS}/${responseGetBlogs.body[0].id}`)
      .send(bodyUpdate0WebsiteUrl)
      .expect(204)

    const responseGetBlogsAfterUpdate0 = await superRequest.get(PATHS.BLOGS).expect(200)

    expect(responseGetBlogsAfterUpdate0.body[0]).toBeInstanceOf(Object)

    expect(responseGetBlogsAfterUpdate0.body[0].id).toBe(responseGetBlogs.body[0].id)
    expect(responseGetBlogsAfterUpdate0.body[0].name).toBe(bodyUpdate0Name.name)
    expect(responseGetBlogsAfterUpdate0.body[0].description).toBe(
      bodyUpdate0Description.description,
    )
    expect(responseGetBlogsAfterUpdate0.body[0].websiteUrl).toBe(bodyUpdate0WebsiteUrl.websiteUrl)

    const bodyUpdate7 = {
      name: 'new2 name max15',
      description: 'description2 max length 500',
      websiteUrl: 'websiteUrl2 max length 500',
    }

    await superRequest
      .put(`${PATHS.BLOGS}/${responseGetBlogs.body[7].id}`)
      .send(bodyUpdate7)
      .expect(204)

    const responseGetBlogsAfterUpdate7 = await superRequest.get(PATHS.BLOGS).expect(200)

    expect(responseGetBlogsAfterUpdate7.body[7]).toBeInstanceOf(Object)

    expect(responseGetBlogsAfterUpdate7.body[7].id).toBe(responseGetBlogs.body[7].id)
    expect(responseGetBlogsAfterUpdate7.body[7].name).toBe(bodyUpdate7.name)
    expect(responseGetBlogsAfterUpdate7.body[7].description).toBe(bodyUpdate7.description)
    expect(responseGetBlogsAfterUpdate7.body[7].websiteUrl).toBe(bodyUpdate7.websiteUrl)
  })

  it('send error for non-existing, empty, non-object body in update blog', async () => {
    const responseGetBlogs = await superRequest.get(PATHS.BLOGS).expect(200)

    const bodyError = {
      name: 'error name actual length is more than 15', // error message: name max length is 15
      // description: 'description max length 500', // error message: description is required
      websiteUrl: 'websiteUrl max length 500',
      unexpectedKey: 'unexpectedValue', // error message: Unexpected key
    }

    const responseUpdateBlogError = await superRequest
      .put(`${PATHS.BLOGS}/${responseGetBlogs.body[0].id}`)
      .send(bodyError)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseUpdateBlogError.body).toEqual({
      errorsMessages: [
        {
          field: 'unexpectedKey',
          message: "unexpected key 'unexpectedKey' found",
        },
        {
          message: 'name max length is 15',
          field: 'name',
        },
      ],
    })
  })
})
