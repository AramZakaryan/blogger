import { superRequest } from './testHelpers'
import { PATH } from '../src/common/paths'
import { setDB } from '../src/db/db'
import { dataSet1 } from './datasets'
// import {setDB} from '../src/db/db'
// import {dataset1} from './datasets'

describe('/blogs', () => {
  beforeEach(async () => {
    setDB(dataSet1)
  })

  it('should get array of blogs', async () => {
    const response = await superRequest.get(PATH.BLOGS).expect(200)

    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBe(15)

    expect(Object.keys(response.body[0]).length).toBe(4)
    expect(Object.keys(response.body[7]).length).toBe(4)
    expect(Object.keys(response.body[14]).length).toBe(4)
  })

  it('should get the blog', async () => {
    const responseGetBlogs = await superRequest.get(PATH.BLOGS).expect(200)

    const responseFindBlog0 = await superRequest
      .get(`${PATH.BLOGS}/${responseGetBlogs.body[0].id}`)
      .expect(200)
    const responseFindBlog7 = await superRequest
      .get(`${PATH.BLOGS}/${responseGetBlogs.body[7].id}`)
      .expect(200)
    const responseFindBlog14 = await superRequest
      .get(`${PATH.BLOGS}/${responseGetBlogs.body[14].id}`)
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
      .post(PATH.BLOGS)
      .send(body)
      .expect('Content-Type', /json/)
      .expect(201)

    expect(responseCreateBlog.body).toBeInstanceOf(Object)

    expect(responseCreateBlog.body.id).not.toBe('')
    expect(responseCreateBlog.body.name).toBe(body.name)
    expect(responseCreateBlog.body.description).toBe(body.description)
    expect(responseCreateBlog.body.websiteUrl).toBe(body.websiteUrl)
  })

  it('send error for error body', async () => {
    const bodyError = {
      name: 'error name actual length is more than 15', // error message: name max length is 15
      // description: 'description max length 500', // error message: description is required
      websiteUrl: 'websiteUrl  max length 500',
    }

    const responseCreateBlogError = await superRequest
      .post(PATH.BLOGS)
      .send(bodyError)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(responseCreateBlogError.body).toEqual({
      errorsMessages: [
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
})
