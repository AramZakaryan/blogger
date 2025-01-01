// src/db/db.ts

import { Collection, MongoClient, ObjectId, WithId } from 'mongodb'
import { config } from 'dotenv'
import { BlogType, BlogViewModel, PostType, PostViewModel } from '../types'
import { Db } from './db.type'
import { blogMap, postMap } from '../common'
import { customSort } from '../common/helpers/customSort'
import { blogsSet } from '../../_tests_/datasets'

config()

export let blogCollection: Collection<BlogType>
export let postCollection: Collection<PostType>

export const runDB = async (dbUrl: string, dbName: string) => {
  const client: MongoClient = new MongoClient(dbUrl)
  const db = client.db(dbName)

  blogCollection = db.collection<BlogType>(process.env.BLOG_COLLECTION_NAME || '')

  postCollection = db.collection<PostType>(process.env.POST_COLLECTION_NAME || '')

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


  if (dataset?.blogs) {
    await blogCollection.insertMany(dataset.blogs)
  }

  if (dataset?.posts) {
    await postCollection.insertMany(dataset.posts)
  }
}


