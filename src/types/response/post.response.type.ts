import { Response } from 'express'
import { ArrangedPostsViewModel, PostViewModel } from '../post.type'
import { OutputErrorsType } from '../general'

export type GetArrangedPostsResponse = Response<ArrangedPostsViewModel | OutputErrorsType>

export type FindPostResponse = Response<PostViewModel | OutputErrorsType>

export type CreatePostResponse = Response<PostViewModel | OutputErrorsType>

export type CreatePostByBlogResponse = CreatePostResponse

export type UpdatePostResponse = Response<void | OutputErrorsType>

export type DeletePostResponse = Response<void | OutputErrorsType>
