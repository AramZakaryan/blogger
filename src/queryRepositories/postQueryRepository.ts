import { GetArrangedPostsQuery, PostViewModel } from '../types'
import { postCollection } from '../db'
import { postMap, toObjectId } from '../common'
import { ObjectId } from 'mongodb'

export const postQueryRepository = {
  getArrangedPosts: async (
    queryNormalized: Required<GetArrangedPostsQuery>,
    blogId?: string,
  ): Promise<PostViewModel[] | null> => {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryNormalized

    const filter = blogId ? { blogId: toObjectId(blogId) } : {}

    const skip = (pageNumber - 1) * pageSize // skip posts for previous pages

    try {
      const posts = await postCollection
        .find(filter)
        .sort({ [sortBy === 'id' ? '_id' : sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray()

      return posts.map(postMap)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  getPostsCount: async (blogId?: string): Promise<number | null> => {
    const filter = blogId ? { blogId: toObjectId(blogId) } : {}
    try {
      return await postCollection.countDocuments(filter)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findPost: async (id: string): Promise<PostViewModel | null> => {
    try {
      const _id = new ObjectId(id)

      const post = await postCollection.findOne({ _id })

      if (!post) return null

      return postMap(post)
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
