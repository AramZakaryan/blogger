import { Db } from '../src/db'
import { BlogType, PostType } from '../src/types'

export const blogsSet1: BlogType[] = Array.from({ length: 15 }, () => ({
  id: String(Date.now() + Math.random()),
  name: 'blogName' + Date.now() + Math.random(),
  description: 'blogDescription' + Date.now() + Math.random(),
  websiteUrl: 'websiteUrl' + Date.now() + Math.random(),
}))

export const postsSet1: PostType[] = [
  ...Array.from({ length: 5 }, () => ({
    id: String(Date.now() + Math.random()),
    title: 'blogTitle' + Date.now() + Math.random(),
    shortDescription: 'postSortDescription' + Date.now() + Math.random(),
    content: 'postContent' + Date.now() + Math.random(),
    blogId: blogsSet1[0].id,
    blogName: blogsSet1[0].name,
  })),
  ...Array.from({ length: 5 }, () => ({
    id: String(Date.now() + Math.random()),
    title: 'blogTitle' + Date.now() + Math.random(),
    shortDescription: 'postSortDescription' + Date.now() + Math.random(),
    content: 'postContent' + Date.now() + Math.random(),
    blogId: blogsSet1[1].id,
    blogName: blogsSet1[1].name,
  })),
  ...Array.from({ length: 5 }, () => ({
    id: String(Date.now() + Math.random()),
    title: 'blogTitle' + Date.now() + Math.random(),
    shortDescription: 'postSortDescription' + Date.now() + Math.random(),
    content: 'postContent' + Date.now() + Math.random(),
    blogId: blogsSet1[2].id,
    blogName: blogsSet1[2].name,
  })),
]

export const dataSet1: Db = {
  blogs: blogsSet1,
  posts: postsSet1,
}
