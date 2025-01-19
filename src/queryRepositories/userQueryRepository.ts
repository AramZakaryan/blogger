import { GetArrangedUsersQuery, UserViewModel } from '../types'
import { userCollection } from '../db'
import { toObjectId, userMap } from '../common'

export const userQueryRepository = {
  getArrangedUsers: async (
    queryNormalized: Required<GetArrangedUsersQuery>,
  ): Promise<UserViewModel[] | null> => {
    const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } =
      queryNormalized

    const skip = (pageNumber - 1) * pageSize // skip users for previous pages

    let conditions = []
    if (searchLoginTerm) conditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
    if (searchEmailTerm) conditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
    if (!searchLoginTerm && !searchEmailTerm) conditions.push({})

    try {
      const users = await userCollection
        .find({ $or: conditions })
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
    let conditions = []
    if (searchLoginTerm) conditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
    if (searchEmailTerm) conditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
    if (!searchLoginTerm && !searchEmailTerm) conditions.push({})

    try {
      return await userCollection.countDocuments({ $or: conditions })
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
}
