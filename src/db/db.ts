// src/db/db.ts

import { Collection, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import { BlogDbType, CommentDbType, PostDbType, UserDbType } from '../types'
import { Db } from './db.type'

config()

export let blogCollection: Collection<BlogDbType>
export let postCollection: Collection<PostDbType>
export let commentCollection: Collection<CommentDbType>
export let userCollection: Collection<UserDbType>

export const runDB = async (dbUrl: string, dbName: string) => {
  const client: MongoClient = new MongoClient(dbUrl)
  const db = client.db(dbName)

  blogCollection = db.collection<BlogDbType>(process.env.BLOG_COLLECTION_NAME || '')
  postCollection = db.collection<PostDbType>(process.env.POST_COLLECTION_NAME || '')
  commentCollection = db.collection<CommentDbType>(process.env.COMMENT_COLLECTION_NAME || '')
  userCollection = db.collection<UserDbType>(process.env.USER_COLLECTION_NAME || '')

  try {
    await client.connect()
    await db.command({ ping: 1 })
    // console.log(`Connected to db: ${dbName} on url: ${dbUrl}`)
    return client
  } catch (e) {
    console.log(e)
    await client.close()
    return false
  }
}

/** setDB function resets/updates the database for testing */
export const setDB = async (dataset?: Partial<Db>) => {
  await blogCollection.drop()
  await postCollection.drop()
  await commentCollection.drop()
  await userCollection.drop()

  if (dataset?.blogs) {
    await blogCollection.insertMany(dataset.blogs)
  }

  if (dataset?.posts) {
    await postCollection.insertMany(dataset.posts)
  }

  if (dataset?.comments) {
    await commentCollection.insertMany(dataset.comments)
  }

  if (dataset?.users) {
    await userCollection.insertMany(dataset.users)
  }
}
