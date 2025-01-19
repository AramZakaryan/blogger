import { BlogDbType, BlogViewModel, UserDbType, UserViewModel } from '../../types'
import { WithId } from 'mongodb'

export const userMap = (user: WithId<UserDbType>): UserViewModel => ({
  id: user._id.toString(),
  login: user.login,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
})
