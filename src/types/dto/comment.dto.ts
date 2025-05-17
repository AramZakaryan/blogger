import { ArrangementQuery } from '../general'
import { CommentDbType, CommentViewModel } from '../comment.type'
import { CreateCommentOfPostBody } from './post.dto'

export type FindCommentParams = { id: string }

export type UpdateCommentParams = FindCommentParams

export type UpdateCommentBody = Pick<CommentDbType, 'content'>

export type GetArrangedCommentsQuery = ArrangementQuery<CommentViewModel>

export type CreateCommentBody = CreateCommentOfPostBody & { postId: string }

export type CreateCommentExtendedBody = CreateCommentBody &
  Pick<CommentViewModel, 'commentatorInfo'> // used as a prop in repository

export type DeleteCommentParams = FindCommentParams
