import { Response } from 'express'
import { OutputErrorsType } from '../general'
import { ArrangedCommentsViewModel, CommentViewModel } from '../comment.type'

export type GetArrangedCommentsResponse = Response<ArrangedCommentsViewModel | OutputErrorsType>

export type FindCommentResponse = Response<CommentViewModel | OutputErrorsType>

export type CreateCommentResponse = Response<CommentViewModel | OutputErrorsType>

export type CreateCommentOfBlogResponse = CreateCommentResponse

export type UpdateCommentResponse = Response<void | OutputErrorsType>

export type DeleteCommentResponse = Response<void | OutputErrorsType>
