import { Db } from '../src/db'
import { BlogType, BlogViewModel, PostType, PostViewModel } from '../src/types'
import { ObjectId, WithId } from 'mongodb'
import { blogMap, postMap } from '../src/common'

const blogNamesAppendices = [
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
] // frequencies { 'ijkl': 4, 'efgh': 4, 'abcd': 4, 'mnop': 3 }

export const blogsSet: WithId<BlogType>[] = Array.from({ length: 15 }, (_, i) => ({
  _id: new ObjectId(),
  name: `blog name ${i}  ${blogNamesAppendices[i]}`,
  description: `blog description ${i}`,
  websiteUrl: `https://someblogurl${i}.com`,
  createdAt: new Date(Date.now() + i * 1000),
  isMembership: i % 3 === 0 && true,
}))

export const postsSet: WithId<PostType>[] = Array.from({ length: 15 }, (_, i) => ({
  _id: new ObjectId(),
  title: `post title ${i}`,
  shortDescription: `post short description ${i}`,
  content: `post content ${i}`,
  blogId: blogsSet[~~(i / 5)]._id,
  blogName: blogsSet[~~(i / 5)].name,
  createdAt: new Date(Date.now() + i * 1000),
}))

export const dataSet: Db = {
  blogs: blogsSet,
  posts: postsSet,
}

export const blogsSetMapped = blogsSet.map(blogMap)

export const postsSetMapped = postsSet.map(postMap)

export const dataSetMapped: DbMapped = {
  blogs: blogsSetMapped,
  posts: postsSetMapped,
}

type DbMapped = {
  blogs: BlogViewModel[]
  posts: PostViewModel[]
}
