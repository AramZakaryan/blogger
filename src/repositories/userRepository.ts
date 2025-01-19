import { BlogType, UpdateBlogBody, UserType, UserViewModel } from '../types'
import { blogCollection, userCollection } from '../db'
import { ObjectId, WithId } from 'mongodb'
import { userQueryRepository } from '../queryRepositories'
import { userMap } from '../common'

export const userRepository = {
  findUserByEmail: async (email: string): Promise<WithId<UserType> | null> => {
    try {
      return await userCollection.findOne({ email })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findUserByLogin: async (login: string): Promise<WithId<UserType> | null> => {
    try {
      return await userCollection.findOne({ login })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findUserByLoginOrEmail: async (loginOrEmail: string): Promise<WithId<UserType> | null> => {
    try {
      const user = await userCollection.findOne({
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      })

      if (!user) return null

      return user
    } catch (err) {
      // console.log(err)
      return null
    }
  },

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
