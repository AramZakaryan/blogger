// src/db/mongo.ts

import { Collection, MongoClient, WithId } from 'mongodb'
import { config } from 'dotenv'
import { BlogType, PostType } from '../types'

config()

export let blogCollection: Collection<BlogType>
export let postCollection: Collection<PostType>

export const runDB = async (urlDb: string) => {
  const client: MongoClient = new MongoClient(urlDb)
  const db = client.db(process.env.DB_NAME)

  blogCollection = db.collection<BlogType>(process.env.BLOG_COLLECTION_NAME || '')

  postCollection = db.collection<PostType>(process.env.POST_COLLECTION_NAME || '')

  try {
    await client.connect()
    await db.command({ ping: 1 })
    console.log(`Connected to db on url: ${urlDb}`)
    return client
  } catch (e) {
    console.log(e)
    await client.close()
    return false
  }
}
