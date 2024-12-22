import { Response } from 'express'
import { PostType } from '../post.type'
import { OutputErrorsType } from '../general'

export type GetPostsResponse = Response<PostType[]>

export type FindPostResponse = Response<PostType | OutputErrorsType>

export type CreatePostResponse = Response<PostType | OutputErrorsType>

export type UpdatePostResponse = Response<void | OutputErrorsType>

export type DeletePostResponse = Response<void | OutputErrorsType>
