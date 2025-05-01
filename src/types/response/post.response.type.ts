import { Response } from 'express'
import { ArrangedPostsViewModel, PostViewModel } from '../post.type'
import { OutputErrorsType } from '../general'
import { ArrangedCommentsViewModel } from '../comment.type'
import { CreateCommentResponse } from './comment.response.type'

export type GetArrangedCommentsOfPostsResponse = Response<
  ArrangedCommentsViewModel | OutputErrorsType
>

export type GetArrangedPostsResponse = Response<ArrangedPostsViewModel | OutputErrorsType>

export type FindPostResponse = Response<PostViewModel | OutputErrorsType>

export type CreatePostResponse = Response<PostViewModel | OutputErrorsType>

export type CreateCommentOfPostResponse = CreateCommentResponse

export type UpdatePostResponse = Response<void | OutputErrorsType>

export type DeletePostResponse = Response<void | OutputErrorsType>
