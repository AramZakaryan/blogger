import { Request } from 'express'
import {
  CreateCommentBody,
  DeleteCommentParams,
  FindCommentParams,
  UpdateCommentBody,
  UpdateCommentParams,
} from '../dto'

export type UpdateCommentRequest = Request<UpdateCommentParams, any, UpdateCommentBody>

export type DeleteCommentRequest = Request<DeleteCommentParams>

export type FindCommentRequest = Request<FindCommentParams>

export type CreateCommentRequest = Request<{}, any, CreateCommentBody>
