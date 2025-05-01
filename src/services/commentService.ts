import { commentRepository, postRepository } from '../repositories'
import {
  ArrangedPostsViewModel,
  CommentViewModel,
  CreateCommentBody,
  CreatePostBody,
  GetArrangedPostsQuery,
  PostViewModel,
  UpdateCommentBody,
  UpdatePostBody,
} from '../types'
import {
  blogQueryRepository,
  commentQueryRepository,
  postQueryRepository,
  userQueryRepository,
} from '../queryRepositories'
import { HTTP_STATUS_CODES, toObjectId } from '../common'
import { ObjectId } from 'mongodb'

export const commentService = {
  createComment: async (body: CreateCommentBody): Promise<CommentViewModel['id'] | null> => {
    try {
      // // check if the user exists (body.commentatorInfo.userId)
      // const user = await userQueryRepository.findUserById(body.commentatorInfo.userId)
      // if (!user) {
      //   throw new Error(
      //     JSON.stringify({
      //       statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
      //       errorsMessages: [
      //         {
      //           message: 'user with provided id does not exist',
      //           field: 'commentatorInfo.userId',
      //         },
      //       ],
      //     }),
      //   )
      // }

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

      return await commentRepository.createComment(body)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  updateComment: async (
    id: CommentViewModel['id'],
    body: UpdateCommentBody,
  ): Promise<PostViewModel['id'] | null> => {
    try {
      // // check if the user exists (body.commentatorInfo.userId)
      // const user = await userQueryRepository.findUserById(body.commentatorInfo.userId)
      // if (!user) {
      //   throw new Error(
      //     JSON.stringify({
      //       statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
      //       errorsMessages: [
      //         {
      //           message: 'user with provided id does not exist',
      //           field: 'commentatorInfo.userId',
      //         },
      //       ],
      //     }),
      //   )
      // }

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

      return await commentRepository.updateComment(id, body)
    } catch (err) {
      return null
    }
  },
  deleteComment: async (id: CommentViewModel['id']): Promise<CommentViewModel['id'] | null> => {
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

    try {
      return await commentRepository.deleteComment(id)
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
