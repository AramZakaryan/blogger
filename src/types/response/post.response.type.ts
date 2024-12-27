import { Response } from 'express'
import { PostDbType } from '../post.type'
import { OutputErrorsType } from '../general'

export type GetPostsResponse = Response<PostDbType[] | OutputErrorsType>

export type FindPostResponse = Response<PostDbType | OutputErrorsType>

export type CreatePostResponse = Response<PostDbType | OutputErrorsType>

export type UpdatePostResponse = Response<void | OutputErrorsType>

export type DeletePostResponse = Response<void | OutputErrorsType>
