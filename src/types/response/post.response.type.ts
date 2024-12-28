import { Response } from 'express'
import { PostViewModel } from '../postType'
import { OutputErrorsType } from '../general'

export type GetPostsResponse = Response<PostViewModel[] | OutputErrorsType>

export type FindPostResponse = Response<PostViewModel | OutputErrorsType>

export type CreatePostResponse = Response<PostViewModel | OutputErrorsType>

export type UpdatePostResponse = Response<void | OutputErrorsType>

export type DeletePostResponse = Response<void | OutputErrorsType>
