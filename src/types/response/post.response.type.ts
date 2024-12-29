import { Response } from 'express'
import { PostViewModel } from '../post.type'
import { OutputErrorsType } from '../general'

export type GetArrangedPostsResponse = Response<PostViewModel[] | OutputErrorsType>

export type FindPostResponse = Response<PostViewModel | OutputErrorsType>

export type CreatePostResponse = Response<PostViewModel | OutputErrorsType>

export type CreatePostByBlogResponse = CreatePostResponse

export type UpdatePostResponse = Response<void | OutputErrorsType>

export type DeletePostResponse = Response<void | OutputErrorsType>
