import { Db } from './db.type'
import { BlogType } from '../types/blog.type'
import { PostType } from '../types/post.type'

// forDelStart
const blogsSet1: BlogType[] = Array.from({ length: 15 }, () => ({
  id: String(Date.now() + Math.random()),
  name: 'blogName' + Date.now() + Math.random(),
  description: 'blogDescription' + Date.now() + Math.random(),
  websiteUrl: 'websiteUrl' + Date.now() + Math.random(),
}))

const postsSet1: PostType[] = [
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

const dataSet1: Db = {
  blogs: blogsSet1,
  posts: postsSet1,
}

export const db: Db = dataSet1
// forDelEnd

// export const db: Db = {
//   blogs: [],
//   posts: [],
// }

/** setDB function resets/updates the database for testing */
export const setDB = (dataset?: Partial<Db>) => {
  if (!dataset) {
    // Clear the database if no dataset is provided
    db.blogs = []
    db.posts = []
    return
  }

  // Update the database with the provided dataset
  db.blogs = dataset.blogs || db.blogs
  db.posts = dataset.posts || db.posts
}
