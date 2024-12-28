import { Db } from '../src/db'
import { BlogType, PostType } from '../src/types'
import { ObjectId, WithId } from 'mongodb'

export const blogsSet1: WithId<BlogType>[] = Array.from({ length: 15 }, () => ({
  _id: new ObjectId(),
  name: 'blogName' + Date.now() + Math.random(),
  description: 'blogDescription' + Date.now() + Math.random(),
  websiteUrl: 'websiteUrl' + Date.now() + Math.random(),
  createdAt: new Date(),
  isMembership: false,
}))

export const postsSet1: WithId<PostType>[] = [
  ...Array.from({ length: 5 }, () => ({
    _id: new ObjectId(),
    title: 'postTitle' + Date.now() + Math.random().toFixed(6),
    shortDescription: 'postSortDescription' + Date.now() + Math.random(),
    content: 'postContent' + Date.now() + Math.random(),
    blogId: blogsSet1[0]._id,
    blogName: blogsSet1[0].name,
    createdAt: new Date(),
  })),
  ...Array.from({ length: 5 }, () => ({
    _id: new ObjectId(),
    title: 'postTitle' + Date.now() + Math.random().toFixed(6),
    shortDescription: 'postSortDescription' + Date.now() + Math.random(),
    content: 'postContent' + Date.now() + Math.random(),
    blogId: blogsSet1[1]._id,
    blogName: blogsSet1[1].name,
    createdAt: new Date(),
  })),
  ...Array.from({ length: 5 }, () => ({
    _id: new ObjectId(),
    title: 'postTitle' + Date.now() + Math.random().toFixed(6),
    shortDescription: 'postSortDescription' + Date.now() + Math.random(),
    content: 'postContent' + Date.now() + Math.random(),
    blogId: blogsSet1[2]._id,
    blogName: blogsSet1[2].name,
    createdAt: new Date(),
  })),
]

export const dataSet1: Db = {
  blogs: blogsSet1,
  posts: postsSet1,
}
