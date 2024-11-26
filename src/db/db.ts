import { Db } from './db.type'

export const db: Db = {
  blogs: [],
  posts: [],
}

/** setDB function resets/updates the database for testing */
export const setDB = (dataset?: Partial<Db>) => {
  if (!dataset) {
    // Clear the database if no dataset is provided
    db.blogs = []
    db.posts = []
    return
  }

  // Update the database with the provided dataset
  db.blogs = dataset.blogs || db.blogs
  db.posts = dataset.posts || db.posts
}
