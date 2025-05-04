import {
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentRequest,
  DeleteCommentResponse,
  FindCommentRequest,
  FindCommentResponse,
  GetArrangedCommentsRequest,
  GetArrangedCommentsResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from '../types'
import {
  handleCustomError,
  handleResponseError,
  handleResponseNotFoundError,
  HTTP_STATUS_CODES,
} from '../common'
import { commentQueryRepository } from '../queryRepositories'
import { commentService } from '../services'
import { commentQueryService } from '../queryServices'

export const commentControllers = {
  getArrangedComments: async (
    req: GetArrangedCommentsRequest,
    res: GetArrangedCommentsResponse,
  ): Promise<void> => {
    const { query } = req

    const comments = await commentQueryService.getArrangedComments(query)
    if (comments) {
      res.json(comments)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  findComment: async (req: FindCommentRequest, res: FindCommentResponse): Promise<void> => {
    const { id } = req.params

    const comment = await commentQueryRepository.findComment(id)

    if (comment) {
      res.json(comment)
    } else {
      handleResponseNotFoundError(res, 'NOT_FOUND_404', 'comment')
    }
  },

  createComment: async (req: CreateCommentRequest, res: CreateCommentResponse): Promise<void> => {
    const { body, user } = req

    const createdCommentId = await commentService.createComment(body, user)

    try {
      if (createdCommentId) {
        const createdComment = await commentQueryRepository.findComment(createdCommentId)
        if (createdComment) {
          res.status(HTTP_STATUS_CODES.CREATED_201).json(createdComment)
        } else {
          handleResponseError(res, 'BAD_REQUEST_400')
        }
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
    }
  },

  updateComment: async (req: UpdateCommentRequest, res: UpdateCommentResponse): Promise<void> => {
    const { id } = req.params
    const { body } = req

    try {
      const updatedCommentId = await commentService.updateComment(id, body)

      if (updatedCommentId) {
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
    }
  },

  deleteComment: async (req: DeleteCommentRequest, res: DeleteCommentResponse): Promise<void> => {
    const { id } = req.params

    try {
      const deletedCommentId = await commentService.deleteComment(id)

      if (deletedCommentId) {
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
    }
  },
}
