import { ArrangedPostsViewModel, GetArrangedPostsQuery, PostViewModel } from '../types'
import { postCollection } from '../db'
import { postMap } from '../common'
import { ObjectId } from 'mongodb'

export const postQueryRepository = {
  getArrangedPosts: async (
    query: GetArrangedPostsQuery,
  ): Promise<ArrangedPostsViewModel | null> => {
    const pageNumber = query.pageNumber || 1
    const pageSize = query.pageSize || 10
    const skip = (pageNumber - 1) * pageSize // skip posts for previous pages

    const sortBy = query.sortBy === 'id' ? '_id' : query.sortBy || 'createdAt'
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1

    try {
      const posts = await postCollection
        .find()
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray()

      const totalCount = await postCollection.countDocuments()
      const pagesCount = Math.ceil(totalCount / pageSize)

      return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: posts.map(postMap),
      }
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
