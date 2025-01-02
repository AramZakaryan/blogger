import { PostType, UpdatePostBody } from '../types'
import { postCollection } from '../db'
import { ObjectId, WithId } from 'mongodb'
import { blogQueryRepository } from '../queryRepositories'

export const postRepository = {
  createPost: async (post: PostType): Promise<string | null> => {
    try {
      const insertOneInfo = await postCollection.insertOne(post)

      if (!insertOneInfo.acknowledged) return null

      return insertOneInfo.insertedId.toString()
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  updatePost: async (id: string, body: UpdatePostBody): Promise<WithId<PostType> | null> => {
    try {
      const blog = await blogQueryRepository.findBlog(body.blogId)

      if (!blog) return null

      const blogName = blog.name

      const _id = new ObjectId(id)

      const blogId = new ObjectId(body.blogId)

      const updateOneInfo = await postCollection.updateOne(
        { _id },
        { $set: { ...body, blogId, blogName } },
      )

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
