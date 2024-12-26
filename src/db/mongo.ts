import { Collection, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import { Db } from './db.type'
import { BlogType, PostType } from '../types'

config()

// connect to db
const client: MongoClient = new MongoClient(process.env.MONGO_URL || '')
export const db = client.db(process.env.DB_NAME)

//connect ro collections
export const blogCollection: Collection<BlogType> = db.collection<BlogType>(
  process.env.BLOG_COLLECTION_NAME || '',
)
export const postCollection: Collection<PostType> = db.collection<PostType>(
  process.env.POST_COLLECTION_NAME || '',
)

// check connection to db
export const connectToDB = async (url: string) => {
  try {
    await client.connect()
    console.log(`Connected to ${url}`)
    return true
  } catch (e) {
    console.log(e)
    await client.close()
    return false
  }
}
