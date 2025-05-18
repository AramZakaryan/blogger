import { BlogDbType, UpdateBlogBody, UserDbType, UserViewModel } from '../types'
import { blogCollection, userCollection } from '../db'
import { ObjectId, WithId } from 'mongodb'
import { userQueryRepository } from '../queryRepositories'
import { userMap } from '../common'

export const userRepository = {
  registerUser: async (user: UserDbType): Promise<string | null> => {
    try {
      const insertOneResult = await userCollection.insertOne(user)

      if (!insertOneResult.acknowledged) return null

      return insertOneResult.insertedId.toString()
    } catch (err) {
      // console.log(err)s
      return null
    }
  },

  deleteUser: async (id: string): Promise<UserViewModel['id'] | null> => {
    try {
      const _id = new ObjectId(id)

      const deleteOneInfo = await userCollection.deleteOne({ _id })

      if (!deleteOneInfo.acknowledged) return null

      return _id.toString()
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
