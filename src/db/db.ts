import { Db } from './db.type'
import { blogCollection, postCollection } from './mongo'

export const db: Db = {
  blogs: [],
  posts: [],
}

/** setDB function resets/updates the database for testing */
export const setDB = async (dataset?: Partial<Db>) => {
  await blogCollection.drop()
  await postCollection.drop()

  if (dataset?.blogs) {
    await blogCollection.insertMany(dataset.blogs)
  }

  if (dataset?.posts) {
    await postCollection.insertMany(dataset.posts)
  }
}
