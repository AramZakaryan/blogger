import { commentRepository } from '../repositories'
import {
  CommentViewModel,
  CreateCommentBody,
  CreateCommentExtendedBody,
  PostViewModel,
  UpdateCommentBody,
  UserViewForMeModel,
} from '../types'
import { commentQueryRepository, postQueryRepository } from '../queryRepositories'
import { HTTP_STATUS_CODES } from '../common'

export const commentService = {
  createComment: async (
    body: CreateCommentBody,
    user: UserViewForMeModel,
  ): Promise<CommentViewModel['id'] | null> => {
    // check if the post exists (body.postId)
    const post = await postQueryRepository.findPost(body.postId)
    if (!post) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
          errorsMessages: [
            {
              message: 'post with provided id does not exist',
              field: 'postId',
            },
          ],
        }),
      )
    }

    const extendedBody: CreateCommentExtendedBody = {
      ...body,
      commentatorInfo: {
        userId: user.userId,
        userLogin: user.login,
      },
    }

    try {
      return await commentRepository.createComment(extendedBody)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  updateComment: async (
    id: CommentViewModel['id'],
    body: UpdateCommentBody,
    user: UserViewForMeModel,
  ): Promise<PostViewModel['id'] | null> => {
    // check if the comment exists (params)
    const comment = await commentQueryRepository.findComment(id)
    if (!comment) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
          errorsMessages: [
            {
              message: 'comment with provided id does not exist',
              field: 'params',
            },
          ],
        }),
      )
    }

    // check if the comment belongs to the user
    if (comment.commentatorInfo.userId !== user.userId) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.FORBIDDEN_403,
          errorsMessages: [
            {
              message: 'comment does not belong to the user',
              field: 'params',
            },
          ],
        }),
      )
    }

    try {
      return await commentRepository.updateComment(id, body)
    } catch (err) {
      return null
    }
  },
  deleteComment: async (
    id: CommentViewModel['id'],
    user: UserViewForMeModel,
  ): Promise<CommentViewModel['id'] | null> => {
    // check if the comment exists (params)
    const comment = await commentQueryRepository.findComment(id)
    if (!comment) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
          errorsMessages: [
            {
              message: 'comment with provided id does not exist',
              field: 'params',
            },
          ],
        }),
      )
    }

    // check if the comment belongs to the user
    if (comment.commentatorInfo.userId !== user.userId) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.FORBIDDEN_403,
          errorsMessages: [
            {
              message: 'comment does not belong to the user',
              field: 'params',
            },
          ],
        }),
      )
    }

    try {
      return await commentRepository.deleteComment(id)
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
