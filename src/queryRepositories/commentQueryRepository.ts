import { CommentViewModel, GetArrangedCommentsQuery, GetArrangedPostsQuery } from '../types'
import { commentCollection } from '../db'
import { ObjectId } from 'mongodb'
import { commentMap, toObjectId } from '../common'

export const commentQueryRepository = {
  getArrangedComments: async (
    queryNormalized: Required<GetArrangedCommentsQuery>,
    postId?: string,
  ): Promise<CommentViewModel[] | null> => {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryNormalized

    const filter = postId ? { postId: toObjectId(postId) } : {}

    const skip = (pageNumber - 1) * pageSize // skip comments for previous pages

    try {
      const comments = await commentCollection
        .find(filter)
        .sort({ [sortBy === 'id' ? '_id' : sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray()

      return comments.map(commentMap)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  getCommentsCount: async (postId?: string): Promise<number | null> => {
    const filter = postId ? { postId: toObjectId(postId) } : {}
    try {
      return await commentCollection.countDocuments(filter)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

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
