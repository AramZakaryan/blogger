import { BlogViewModel, CreatePostBody, PostDbType, PostViewModel, UpdatePostBody } from '../types'
import { postCollection } from '../db'
import { ObjectId, WithId } from 'mongodb'
import { blogQueryRepository, postQueryRepository } from '../queryRepositories'

export const postRepository = {
  createPost: async (
    body: CreatePostBody,
    blogName: PostViewModel['blogName'],
  ): Promise<PostViewModel['id'] | null> => {
    try {
      const post = {
        ...body,
        blogId: new ObjectId(body.blogId),
        blogName,
        createdAt: new Date(),
      }

      const insertOneInfo = await postCollection.insertOne(post)

      if (!insertOneInfo.acknowledged) return null

      return insertOneInfo.insertedId.toString()
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  updatePost: async (
    id: PostViewModel['id'],
    body: UpdatePostBody,
    blogName: PostViewModel['blogName'],
  ): Promise<PostViewModel['id'] | null> => {
    try {
      const _id = new ObjectId(id)

      const blogId = new ObjectId(body.blogId)

      const updateOneInfo = await postCollection.updateOne(
        { _id },
        { $set: { ...body, blogId, blogName } },
      )

      if (!updateOneInfo.acknowledged) return null

      return _id.toString()
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  deletePost: async (id: PostViewModel['id']): Promise<PostViewModel['id'] | null> => {
    try {
      const _id = new ObjectId(id)

      const deleteOneInfo = await postCollection.deleteOne({ _id })

      if (!deleteOneInfo.acknowledged) return null

      return _id.toString()
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
