import { db } from '../db/db'

export const postService = {
  getPosts: async () => {
    const posts = db.posts.slice(-15)
    // const posts = dataSet1.posts.slice(-15)
    return posts
  },

  findPost: async (id: string) => {
    const post = db.posts.find((post) => post.id === id)
    // const post = dataSet1.posts.find((post) => post.id === id)
    return post
  },
}
