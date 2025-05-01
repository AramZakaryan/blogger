import { Response } from 'express'
import { ArrangedPostsViewModel, PostViewModel } from '../post.type'
import { OutputErrorsType } from '../general'
import { CommentViewModel } from '../comment.type'

export type FindCommentResponse = Response<CommentViewModel | OutputErrorsType>

export type CreateCommentResponse = Response<CommentViewModel | OutputErrorsType>

export type CreateCommentOfBlogResponse = CreateCommentResponse

export type UpdateCommentResponse = Response<void | OutputErrorsType>

export type DeleteCommentResponse = Response<void | OutputErrorsType>
