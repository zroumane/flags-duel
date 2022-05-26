import { uniqueId } from './helpers.js'
import { io } from '../app.js'

let duels = []

class Duel {
  constructor() {
    this.id = uniqueId()
    this.state = 'CONFIG'
    this.players = []
    this.config = {
      category: 0,
      round: 10,
    }
    this.round = []
  }

  newConfig(n) {
    if (this.state == 'CONFIG') {
      if (
        n.round &&
        typeof n.round === 'number' &&
        n.round >= 5 &&
        n.round <= 50
      ) {
        this.config.round = n.round
      }
      if (
        n.category &&
        typeof n.category === 'number' &&
        n.category >= 0 &&
        n.category <= 4
      ) {
        this.config.category = n.category
      }
    }
    this.sync()
  }

  addPlayer(sessionId) {
    if (this.players.find((p) => p.session == sessionId)) return 'connecting'
    else if (this.players.length == 2) return 'full'
    else {
      this.players.push({
        session: sessionId,
        socket: null,
        score: 0,
      })
    }
  }

  connect(sessionId, socketID) {
    let player = this.players.find((p) => p.session == sessionId)
    if (player) {
      player.socket = socketID
      this.sync()
    }
    return player
  }

  disconnect(socketId) {
    if (this.state != 'PLAYING') {
      this.players = this.players.filter((p) => p.socket != socketId)
      if (this.state == 'FINISHED') {
        this.restart()
      }
    }
  }

  start() {
    if (this.state == 'CONFIG') {
      if (this.players.length != 2)
        io.to(this.id).emit('error', 'Not enough players !')
      else {
        this.state = 'PLAYING'
        this.sync()
        setTimeout(() => {
          this.players[1].score++
          this.finish()
        }, 3000)
      }
    }
  }

  finish() {
    this.state = 'FINISHED'
    this.players = this.players.filter((p) => {
      if (io.sockets.adapter.rooms.get(this.id).has(p.socket)) return true
      else return false
    })
    this.sync()
  }

  restart() {
    if (this.state == 'FINISHED') {
      this.state = 'CONFIG'
      this.players = this.players.map((p) => {
        p.score = 0
        return p
      })
      this.sync()
    }
  }

  addScore(socketID) {
    this.players.find((p) => p.socket == socketID).score++
  }

  sync() {
    io.to(this.id).emit('duel', {
      state: this.state,
      config: this.config,
      players: this.players,
    })
  }
}

export default {
  has: (id) => {
    return duels.find((d) => d.id == id) ? true : false
  },
  new: (sessionId) => {
    let duel = new Duel()
    duel.addPlayer(sessionId)
    duels.push(duel)
    return duel
  },
  get: (id) => {
    return duels.find((d) => d.id == id)
  },
  size: () => {
    return duels.length
  },
}
