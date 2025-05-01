import {
  ArrangedCommentsViewModel,
  ArrangedPostsViewModel,
  CommentViewModel,
  GetArrangedCommentsOfPostQuery,
  GetArrangedCommentsQuery,
  GetArrangedPostsOfBlogQuery,
  GetArrangedPostsQuery,
  PostViewModel,
} from '../types'
import {
  blogQueryRepository,
  commentQueryRepository,
  postQueryRepository,
} from '../queryRepositories'
import { HTTP_STATUS_CODES } from '../common'

export const commentQueryService = {
  getArrangedComments: async (
    query: GetArrangedCommentsQuery,
  ): Promise<ArrangedCommentsViewModel | null> => {
    const queryNormalized: Required<GetArrangedCommentsQuery> = {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
    }

    try {
      let comments = await commentQueryRepository.getArrangedComments(queryNormalized)

      comments ??= []

      let commentsCount = await commentQueryRepository.getCommentsCount()

      commentsCount ??= 0

      const pagesCount = Math.ceil(commentsCount / queryNormalized.pageSize)

      return {
        pagesCount,
        page: queryNormalized.pageNumber,
        pageSize: queryNormalized.pageSize,
        totalCount: commentsCount,
        items: comments,
      }
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
