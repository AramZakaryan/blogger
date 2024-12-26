import { config } from 'dotenv'
import { app } from './app'
import { connectToDB } from './db/mongo'

config()

const port = process.env.PORT || 4000

const startApp = async () => {
  await connectToDB(process.env.MONGO_URL || '')
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

void startApp()
