import { CommentViewModel } from '../types'
import { commentCollection } from '../db'
import { ObjectId } from 'mongodb'
import { commentMap } from '../common'

export const commentQueryRepository = {
  // getArrangedPosts: async (
  //   queryNormalized: Required<GetArrangedPostsQuery>,
  //   blogId?: string,
  // ): Promise<PostViewModel[] | null> => {
  //   const { pageNumber, pageSize, sortBy, sortDirection } = queryNormalized
  //
  //   const filter = blogId ? { blogId: toObjectId(blogId) } : {}
  //
  //   const skip = (pageNumber - 1) * pageSize // skip posts for previous pages
  //
  //   try {
  //     const posts = await postCollection
  //       .find(filter)
  //       .sort({ [sortBy === 'id' ? '_id' : sortBy]: sortDirection })
  //       .skip(skip)
  //       .limit(pageSize)
  //       .toArray()
  //
  //     return posts.map(postMap)
  //   } catch (err) {
  //     // console.log(err)
  //     return null
  //   }
  // },
  //
  // getPostsCount: async (blogId?: string): Promise<number | null> => {
  //   const filter = blogId ? { blogId: toObjectId(blogId) } : {}
  //   try {
  //     return await postCollection.countDocuments(filter)
  //   } catch (err) {
  //     // console.log(err)
  //     return null
  //   }
  // },

  findComment: async (id: CommentViewModel['id']): Promise<CommentViewModel | null> => {
    try {
      const _id = new ObjectId(id)

      const comment = await commentCollection.findOne({ _id })

      if (!comment) return null

      return commentMap(comment)
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
