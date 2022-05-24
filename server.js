const path = require('path');
const app = require('express')()

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors')
const history = require('connect-history-api-fallback');

const corsOption = {
  origin: [
    "http://localhost:8080", 
    "http://localhost:3000",
    "https://localhost:3000"
  ],
  credentials: true
}

const server = createServer(app);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true
});

app.use(cookieParser());
app.use(sessionMiddleware);

app.use(cors(corsOption));

if (process.env.NODE_ENV != "development") {
  console.log("Prod : serving static files")
  app.use(history());
  app.use('/', express.static(path.join(__dirname, 'dist')));
}

let duels = new Map()

const uniqueId = () => {
  const id = Array.from({length: 5}, () => {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')[Math.floor(Math.random() * 36)]
  }).join('')

  if (duels.has(id)) {
    return uniqueId()
  }
  else {
    return id
  }

}

app.get('/api/', (req, res) => {
  res.json({data: {message : 'Flags Duel API'}});
})

app.get('/api/duel', (req, res) => {
  res.json({data: {count : duels.size}});
})

app.post('/api/duel', (req, res) => {
  let id = uniqueId()
  duels.set(id, {
    state: "CONFIG",
    config: {},
    players: [
      {
        id: req.session.id,
        point: 0
      }
    ],
    round: {}
  })
  res.json({data:{id: id}});
})

app.get('/api/duel/:id', (req, res) => {
  console.log("api", req.session.id);

  let duel = duels.get(req.params.id)

  if(!duel) {
    res.json({data: "notfound"})
  }
  else if (duel.state == "PLAYING"){
    res.json({data: "playing"})
  }
  else {
    if (duel.players.find(p => p.id == req.session.id)){
      res.json({data: "connectig"})
    } else {
      if (duel.players.length == 2){
        res.json({data: "full"})
      }
      else {
        duel.players.push({
          id: req.session.id,
          point: 0
        })
        res.json({data: "connecting"})
      }
    }
  }
})

const io = new Server(server, {cors: corsOption});
io.use(wrap(sessionMiddleware));

io.on('connection', (socket) => {
  console.log("socket", socket.request.session.id);
  socket.emit('aaaa', {message: 'a new client connected'})
})

const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
})