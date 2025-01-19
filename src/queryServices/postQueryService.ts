import { postRepository } from '../repositories'
import {
  ArrangedPostsViewModel,
  CreatePostBody,
  GetArrangedPostsQuery,
  PostViewModel,
} from '../types'
import { blogQueryRepository, postQueryRepository } from '../queryRepositories'
import { toObjectId } from '../common'

export const postQueryService = {
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
