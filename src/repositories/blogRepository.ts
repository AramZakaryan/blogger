import { BlogDbType, CreateBlogBody, UpdateBlogBody } from '../types'
import { blogCollection } from '../db/mongo'
import { ObjectId } from 'mongodb'

export const blogRepository = {
  getBlogs: async (): Promise<BlogDbType[] | null> => {
    try {
      return await blogCollection.find({}).toArray()
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findBlog: async (id: string): Promise<BlogDbType | null> => {
    try {
      const _id = new ObjectId(id)
      return await blogCollection.findOne({ _id })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  createBlog: async (body: CreateBlogBody): Promise<BlogDbType | null> => {
    try {
      const blog = {
        _id: new ObjectId(),
        ...body,
        createdAt: new Date(),
      }

      const insertOneInfo = await blogCollection.insertOne(blog)

      if (!insertOneInfo.acknowledged) return null

      return await blogCollection.findOne({ _id: insertOneInfo.insertedId })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  updateBlog: async (id: string, body: UpdateBlogBody): Promise<BlogDbType | null> => {
    try {
      const _id = new ObjectId(id)

      const updateOneInfo = await blogCollection.updateOne({ _id }, { $set: { ...body } })

      if (!updateOneInfo.acknowledged) return null

      return await blogCollection.findOne({ _id })
    } catch (err) {
      // console.log(err)
      return null
    }
  },
  deleteBlog: async (id: string): Promise<BlogDbType | null> => {
    try {
      const _id = new ObjectId(id)

      const blog = await blogCollection.findOne({ _id })

      const deleteOneInfo = await blogCollection.deleteOne({ _id })

      if (!deleteOneInfo.acknowledged) return null

      return blog
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
