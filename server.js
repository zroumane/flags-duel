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
    config: {
      category: "0",
      round: 10
    },
    players: [
      {
        session: req.session.id,
        socket: null,
        score: 0
      }
    ],
    round: {}
  })
  res.json({data:{id: id}});
})

app.get('/api/duel/:id', (req, res) => {
  let duel = duels.get(req.params.id)

  if(!duel) {
    res.json({data: "notfound"})
  }
  else {
    if (duel.players.find(p => p.session == req.session.id)){
      res.json({data: "connectig"})
    } else {
      if (duel.players.length == 2){
        res.json({data: "full"})
      }
      else {
        duel.players.push({
          session: req.session.id,
          socket: null,
          score: 0
        })
        res.json({data: "connecting"})
      }
    }
  }
})

const io = new Server(server, {cors: corsOption});
io.use(wrap(sessionMiddleware));

const syncDuel = (id, duel) => {
  if(duel){
    io.to(id).emit("duel",{
      state: duel.state,
      config: duel.config,
      players: duel.players
    })
  }
}


io.on('connection', (socket) => {
  let duel, id;
  socket.send("join", (gameId) => {
    id = gameId
    duel = duels.get(id)
    if(duel){
      let player = duel.players.find(p => p.session == socket.request.session.id)
      if (!player) {
        socket.disconnect()
      } else {
        player.socket = socket.id
        socket.join(id)
        syncDuel(id, duel)
      }
    }
  });
  socket.on('disconnect', () => {
    if(duel && duel.state != "PLAYING") {
      duel.players = duel.players.filter(p => p.socket != socket.id)
      if (duel.state == "FINISHED"){
        duel.state = "CONFIG"
      }
      syncDuel(id, duel)
    }
  })
  socket.on('message', (msg) => {
    if(msg == "start"){
      if(duel && duel.state == "CONFIG"){
        if(duel.players.length != 2){
          socket.emit('error', "Not enough players !")
        }else{
          duel.state = "PLAYING"
          syncDuel(id, duel)
          setTimeout(() => {
            duel.players[1].score++
            duel.state = "FINISHED"
            duel.players = duel.players.filter((p) => {
              if (io.sockets.adapter.rooms.get(id).has(p.socket)) return true
              else return false
            })
            syncDuel(id, duel)
          }, 3000);
        }
      }
    }
    else if (msg == "restart"){
      if(duel && duel.state == "FINISHED"){
        duel.state = "CONFIG"
        duel.players = duel.players.map((p) => {
          p.score = 0
          return p
        })
        syncDuel(id, duel)
      }
    }
  })
  socket.on('config', (config) => {
    if(duel && duel.state == "CONFIG"){
      duel.config = config
    }
    syncDuel(id, duel)
  })
})

const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
})