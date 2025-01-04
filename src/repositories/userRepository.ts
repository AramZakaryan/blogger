import {
  ArrangedBlogsViewModel,
  ArrangedPostsViewModel,
  BlogType,
  CreateBlogBody,
  GetArrangedBlogsQuery,
  GetArrangedPostsByBlogQuery,
  UpdateBlogBody,
  UserType,
  UserViewModel,
} from '../types'
import { blogCollection, postCollection, userCollection } from '../db'
import { blogMap, postMap } from '../common'
import { ObjectId, WithId } from 'mongodb'
import { userQueryRepository } from '../queryRepositories'

export const userRepository = {
  createUser: async (user: UserType): Promise<string | null> => {
    try {
      const insertOneInfo = await userCollection.insertOne(user)

      if (!insertOneInfo.acknowledged) return null

      return insertOneInfo.insertedId.toString()
    } catch (err) {
      // console.log(err)s
      return null
    }
  },

  updateBlog: async (id: string, body: UpdateBlogBody): Promise<WithId<BlogType> | null> => {
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
  deleteUser: async (id: string): Promise<UserViewModel | null> => {
    try {
      const user = await userQueryRepository.findUserById(id)

      const _id = new ObjectId(id)

      const deleteOneInfo = await userCollection.deleteOne({ _id })

      if (!deleteOneInfo.acknowledged) return null

      return user
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
