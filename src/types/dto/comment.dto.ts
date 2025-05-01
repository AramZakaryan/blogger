import { ArrangementQuery } from '../general'
import { CommentViewModel } from '../comment.type'
import { CreateCommentOfPostBody } from './post.dto'

export type FindCommentParams = { id: string }

export type UpdateCommentParams = FindCommentParams

export type UpdateCommentBody = CreateCommentBody

export type GetArrangedCommentsQuery = ArrangementQuery<CommentViewModel>

export type CreateCommentBody = CreateCommentOfPostBody

export type DeleteCommentParams = FindCommentParams
