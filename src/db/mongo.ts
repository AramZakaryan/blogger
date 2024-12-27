import { Collection, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import { BlogDbType, PostDbType } from '../types'

config()

// connect to db
const client: MongoClient = new MongoClient(process.env.MONGO_URL || '')
const db=client.db()
// export const db = client.db(process.env.DB_NAME)

//connect ro collections
export const blogCollection: Collection<BlogDbType> = db.collection<BlogDbType>(
  process.env.BLOG_COLLECTION_NAME || '',
)
export const postCollection: Collection<PostDbType> = db.collection<PostDbType>(
  process.env.POST_COLLECTION_NAME || '',
)

// check connection to db
export const connectToDB = async () => {
  try {
    await client.connect()
    console.log(`Connected to mongoDB`)
    return true
  } catch (e) {
    console.log(e)
    await client.close()
    return false
  }
}
