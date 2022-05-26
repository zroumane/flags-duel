import path from 'path'
import express from 'express'

import { createServer } from 'http'
import { Server } from 'socket.io'

import cookieParser from 'cookie-parser'
import session from 'express-session'
import cors from 'cors'
import history from 'connect-history-api-fallback'

const corsOption = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'https://localhost:3000',
  ],
  credentials: true,
}

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next)

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
})

const app = express()
const server = createServer(app)

app.use(cookieParser())
app.use(sessionMiddleware)
app.use(cors(corsOption))

if (process.env.NODE_ENV != 'development') {
  console.log('Prod : serving static files')
  app.use(history())
  app.use('/', express.static(path.join(__dirname, '../dist')))
}

const io = new Server(server, { cors: corsOption })
io.use(wrap(sessionMiddleware))

import apiRoute from './src/api.js'
app.use('/api', apiRoute)

import connection from './src/io.js'
io.on('connection', (socket) => connection(socket))

const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

export { io }
