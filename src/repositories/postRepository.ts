import { CreatePostBody, PostType, UpdatePostBody } from '../types'
import { blogRepository } from './blogRepository'
import { postCollection } from '../db/db'
import { ObjectId, WithId } from 'mongodb'

export const postRepository = {
  getPosts: async (): Promise<WithId<PostType>[] | null> => {
    try {
      return await postCollection.find({}).toArray()
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findPost: async (id: string): Promise<WithId<PostType> | null> => {
    try {
      const _id = new ObjectId(id)

      return await postCollection.findOne({ _id })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  createPost: async (body: CreatePostBody): Promise<WithId<PostType> | null> => {
    try {
      const blog = await blogRepository.findBlog(body.blogId)

      if (!blog) return null

      const post = {
        ...body,
        blogId: blog._id,
        blogName: blog.name,
        createdAt: new Date(),
      }

      const insertOneInfo = await postCollection.insertOne(post)

      if (!insertOneInfo.acknowledged) return null

      return await postCollection.findOne({ _id: insertOneInfo.insertedId })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  updatePost: async (id: string, body: UpdatePostBody): Promise<WithId<PostType> | null> => {
    try {
      const _id = new ObjectId(id)

      const blogId = new ObjectId(body.blogId)

      const updateOneInfo = await postCollection.updateOne({ _id }, { $set: { ...body, blogId } })

      if (!updateOneInfo.acknowledged) return null

      return await postCollection.findOne({ _id })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  deletePost: async (id: string): Promise<WithId<PostType> | null> => {
    try {
      const _id = new ObjectId(id)

      const post = await postCollection.findOne({ _id })

      const deleteOneInfo = await postCollection.deleteOne({ _id })

      if (!deleteOneInfo.acknowledged) return null

      return post
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
