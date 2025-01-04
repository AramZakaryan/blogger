import {
  BlogViewModel,
  GetArrangedBlogsQuery,
  GetArrangedUsersQuery,
  UserDbType,
  UserViewModel,
} from '../types'
import { blogCollection, userCollection } from '../db'
import { blogMap, toObjectId, userMap } from '../common'
import { ObjectId } from 'mongodb'

export const userQueryRepository = {
  getArrangedUsers: async (
    queryNormalized: Required<GetArrangedUsersQuery>,
  ): Promise<UserViewModel[] | null> => {
    const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } =
      queryNormalized

    const skip = (pageNumber - 1) * pageSize // skip users for previous pages

    try {
      const users = await userCollection
        .find({
          login: { $regex: searchLoginTerm, $options: 'i' },
          email: { $regex: searchEmailTerm, $options: 'i' },
        })
        .sort({ [sortBy === 'id' ? '_id' : sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray()

      return users.map(userMap)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  getUsersCount: async (
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<number | null> => {
    try {
      return await userCollection.countDocuments({
        login: { $regex: searchLoginTerm, $options: 'i' },
        email: { $regex: searchEmailTerm, $options: 'i' },
      })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findUserById: async (id: string): Promise<UserViewModel | null> => {
    try {
      const _id = toObjectId(id)

      const user = await userCollection.findOne({ _id })

      if (!user) return null

      return userMap(user)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findUserByEmail: async (email: string): Promise<UserViewModel | null> => {
    try {
      const user = await userCollection.findOne({ email })

      if (!user) return null

      return userMap(user)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findUserByLogin: async (login: string): Promise<UserViewModel | null> => {
    try {
      const user = await userCollection.findOne({ login })

      if (!user) return null

      return userMap(user)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findUserByLoginOrEmail: async (loginOrEmail: string): Promise<UserDbType | null> => {
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
}
