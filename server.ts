import express from 'express'
import dotenv from 'dotenv'
import createTables from './Controllers/createTables.js'
dotenv.config()

const app = express()
const port = process.env.PORT

;(async () => {
  await createTables()
  app.listen(port, () => {
    console.log(`server listening at port: ${port}`)
  })
})()
