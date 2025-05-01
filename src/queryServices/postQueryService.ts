import {
  ArrangedCommentsViewModel,
  ArrangedPostsViewModel, CommentViewModel,
  GetArrangedCommentsOfPostQuery,
  GetArrangedPostsOfBlogQuery,
  GetArrangedPostsQuery,
  PostViewModel,
} from '../types'
import { blogQueryRepository, commentQueryRepository, postQueryRepository } from '../queryRepositories'
import { HTTP_STATUS_CODES } from '../common'

export const postQueryService = {

  getArrangedCommentsOfPost: async (
    query: GetArrangedCommentsOfPostQuery,
    postId: CommentViewModel['postId'],
  ): Promise<ArrangedCommentsViewModel | null> => {
    // check if post exists
    const post = await postQueryRepository.findPost(postId)
    if (!post) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
          errorsMessages: [
            {
              message: 'post with provided id does not exist',
              field: 'params',
            },
          ],
        }),
      )
    }

    const queryNormalized: Required<GetArrangedCommentsOfPostQuery> = {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
    }

    try {
      let comments = await commentQueryRepository.getArrangedComments(queryNormalized, postId)

      comments ??= []

      let commentsCount = await commentQueryRepository.getCommentsCount(postId)

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

  getArrangedPosts: async (
    query: GetArrangedPostsQuery,
  ): Promise<ArrangedPostsViewModel | null> => {
    const queryNormalized: Required<GetArrangedPostsQuery> = {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
    }

    try {
      let posts = await postQueryRepository.getArrangedPosts(queryNormalized)

      posts ??= []

      let postsCount = await postQueryRepository.getPostsCount()

      postsCount ??= 0

      const pagesCount = Math.ceil(postsCount / queryNormalized.pageSize)

      return {
        pagesCount,
        page: queryNormalized.pageNumber,
        pageSize: queryNormalized.pageSize,
        totalCount: postsCount,
        items: posts,
      }
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
