import { BlogViewModel, GetArrangedBlogsQuery } from '../types'
import { blogCollection } from '../db'
import { blogMap, toObjectId } from '../common'

export const blogQueryRepository = {
  getArrangedBlogs: async (
    queryNormalized: Required<GetArrangedBlogsQuery>,
  ): Promise<BlogViewModel[] | null> => {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = queryNormalized

    const skip = (pageNumber - 1) * pageSize // skip blogs for previous pages

    try {
      const blogs = await blogCollection
        .find({ name: { $regex: searchNameTerm, $options: 'i' } })
        .sort({ [sortBy === 'id' ? '_id' : sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray()

      return blogs.map(blogMap)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  getBlogsCount: async (searchNameTerm: string): Promise<number | null> => {
    const searchNameTermRegExp = new RegExp(searchNameTerm, 'i') // case-insensitive search

    try {
      return await blogCollection.countDocuments({
        name: { $regex: searchNameTermRegExp },
      })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findBlog: async (id: string): Promise<BlogViewModel | null> => {
    try {
      const _id = toObjectId(id)

      const blog = await blogCollection.findOne({ _id })

      if (!blog) return null

      return blogMap(blog)
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
