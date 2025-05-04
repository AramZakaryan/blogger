import { CommentViewModel, CreateCommentBody, UpdateCommentBody } from '../types'
import { commentCollection, postCollection } from '../db'
import { ObjectId } from 'mongodb'

export const commentRepository = {
  createComment: async (body: CreateCommentBody): Promise<CommentViewModel['id'] | null> => {
    try {
      // const userId = new ObjectId(body.commentatorInfo.userId)

      const postId = new ObjectId(body.postId)

      const userId = new ObjectId(body.commentatorInfo.userId)

      const comment = {
        content: body.content,
        commentatorInfo: {
          userId,
          userLogin: body.commentatorInfo.userLogin,
        },
        postId,
        createdAt: new Date(),
      }

      const insertOneResult = await commentCollection.insertOne(comment)

      if (!insertOneResult.acknowledged) return null

      return insertOneResult.insertedId.toString()
    } catch (err) {
      // console.log(err)
      return null
    }
  },
  updateComment: async (
    id: CommentViewModel['id'],
    body: UpdateCommentBody,
  ): Promise<CommentViewModel['id'] | null> => {
    try {
      const _id = new ObjectId(id)

      // const userId = new ObjectId(body.commentatorInfo.userId)

      const postId = new ObjectId(body.postId)

      const updateOneInfo = await commentCollection.updateOne(
        { _id },
        {
          $set: {
            content: body.content,
            // commentatorInfo: {
            //   userId,
            //   userLogin: body.commentatorInfo.userLogin,
            // },
            postId,
          },
        },
      )

      if (!updateOneInfo.acknowledged) return null

      return _id.toString()
    } catch (err) {
      console.log(err)
      return null
    }
  },

  deleteComment: async (id: CommentViewModel['id']): Promise<CommentViewModel['id'] | null> => {
    try {
      const _id = new ObjectId(id)

      const deleteOneInfo = await commentCollection.deleteOne({ _id })

      if (!deleteOneInfo.acknowledged) return null

      return _id.toString()
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
