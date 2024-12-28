// src/index.ts

import { config } from 'dotenv'
import { app } from './app'
import { runDB } from './db/mongo'

config()

const urlDb = process.env.MONGO_URL || ''

const port = process.env.PORT || 4000

const startApp = async () => {
  const res = await runDB(urlDb)
  if (!res) process.exit(1) // exit is a method in Node.js that immediately terminates the program's execution with the specified exit code (0 for success, 1 for error).
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

void startApp()
