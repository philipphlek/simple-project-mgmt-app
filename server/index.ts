import express from 'express'
import 'colors'
import cors from 'cors'
import * as dotenv from 'dotenv'
import {graphqlHTTP} from 'express-graphql'
import schema from './schema/schema'
import connectDB from './config/db'

dotenv.config()

const port = process.env.PORT || 5000
const app = express()

connectDB()

app.use(cors())

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
  })
)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
