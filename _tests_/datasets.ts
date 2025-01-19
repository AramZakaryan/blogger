import { Db } from '../src/db'
import {
  BlogType,
  BlogViewModel,
  PostDbType,
  PostViewModel,
  UserType,
  UserViewModel,
} from '../src/types'
import { ObjectId, WithId } from 'mongodb'
import { blogMap, postMap, userMap } from '../src/common'
import bcrypt from 'bcrypt'

const blogNameAppendices = [
  'IjKL',
  'iJKL',
  'IJKl',
  'EFgh',
  'abCd',
  'AbCD',
  'Mnop',
  'AbCd',
  'IJkL',
  'eFGh',
  'mNop',
  'EFGh',
  'ABcd',
  'MnOP',
  'eFGH',
]
// frequencies { ijkl: 4, efgh: 4, abcd: 4, mnop: 3 }

const userLoginAppendices = [
  'wXY',
  'Qrs',
  'tuv',
  'wXy',
  'WXY',
  'tuV',
  'QRS',
  'wxY',
  'Wxy',
  'qrs',
  'wxY',
  'qrS',
  'WXy',
  'Qrs',
  'TUV',
  'WxY',
]
// frequencies  { wxy: 8, qrs: 5, tuv: 3 }}

const userEmailAppendices = [
  'yYzz',
  'QRst',
  'UVWX',
  'qRsT',
  'YyZz',
  'uVwX',
  'QrST',
  'qRST',
  'QrsT',
  'YYzz',
  'uVWx',
  'qrst',
  'UvWx',
  'yYZz',
  'QrSt',
]
// { qrst: 7, uvwx: 4, yyzz: 4 }

export const blogsSet: WithId<BlogType>[] = Array.from({ length: 15 }, (_, i) => ({
  _id: new ObjectId(),
  name: `blog name ${i} ${blogNameAppendices[i]}`,
  description: `blog description ${i}`,
  websiteUrl: `https://someblogurl${i}.com`,
  createdAt: new Date(Date.now() + i * 1000),
  isMembership: i % 3 === 0 && true,
}))

export const postsSet: WithId<PostDbType>[] = Array.from({ length: 15 }, (_, i) => ({
  _id: new ObjectId(),
  title: `post title ${i}`,
  shortDescription: `post short description ${i}`,
  content: `post content ${i}`,
  blogId: blogsSet[~~(i / 5)]._id,
  blogName: blogsSet[~~(i / 5)].name,
  createdAt: new Date(Date.now() + i * 1000),
}))

export const usersSet: WithId<UserType>[] = Array.from({ length: 15 }, (_, i) => ({
  _id: new ObjectId(),
  login: `login${i}${userLoginAppendices[i]}`,
  email: `user@email${i}${userEmailAppendices[i]}.com`,
  password: bcrypt.hashSync(`user password ${i}`, 1),
  createdAt: new Date(Date.now() + i * 1000),
}))

export const dataSet: Db = {
  blogs: blogsSet,
  posts: postsSet,
  users: usersSet,
}

export const blogsSetMapped = blogsSet.map(blogMap)

export const postsSetMapped = postsSet.map(postMap)

export const usersSetMapped = usersSet.map(userMap)

export const dataSetMapped: DbMapped = {
  blogs: blogsSetMapped,
  posts: postsSetMapped,
  users: usersSetMapped,
}

type DbMapped = {
  blogs: BlogViewModel[]
  posts: PostViewModel[]
  users: UserViewModel[]
}

const createPasswordHash = async (passwordPlainText: string) => {}
