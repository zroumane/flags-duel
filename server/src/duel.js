import { uniqueId } from './helpers.js'
import { io } from '../app.js'
import round from './round.js'
import store from './store.js'

import flags from '../flags.json' assert { type: 'json' }

const ROUND_TIME = 15
const PREPARE_TIME = 3

export default class {
  constructor() {
    this.id = uniqueId()
    this.state = 'CONFIG'
    this.players = []
    this.config = {
      category: 0,
      round: 10,
    }
    this.rounds = []
    this.answering = false
    this.timeout = null
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
        n.category != undefined &&
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
        answer: false,
      })
    }
  }

  connect(socket) {
    let player = this.players.find(
      (p) => p.session == socket.request.session.id
    )
    if (player) {
      player.socket = socket.id
      socket.join(this.id)
      this.sync()
    } else socket.disconnect()
  }

  disconnect(socketId) {
    if (this.state != 'PLAYING') {
      this.players = this.players.filter((p) => p.socket != socketId)
      if (this.players.length == 0) store.remove(this.id)
      else if (this.state == 'FINISHED') this.restart()
      this.sync()
    }
  }

  start() {
    if (this.state == 'CONFIG') {
      if (this.players.length != 2)
        io.to(this.id).emit('error', 'Not enough players !')
      else {
        this.rounds = round(this.config)
        this.state = 'PLAYING'
        this.sync()
        this.instance()
      }
    }
  }

  instance() {
    this.answering = false
    this.players.map((p) => (p.answer = false))
    this.sync()
    if (this.rounds.length == 0) this.finish()
    else {
      io.to(this.id).emit('prepare', PREPARE_TIME)
      setTimeout(() => {
        this.answering = true
        io.to(this.id).emit('question', {
          time: ROUND_TIME,
          flag: flags[this.rounds[0].country.code],
          choices: this.rounds[0].choices,
          status: `${this.config.round - this.rounds.length + 1}/${
            this.config.round
          }`,
        })
        this.timeout = setTimeout(() => this.end(), ROUND_TIME * 1000)
      }, PREPARE_TIME * 1000)
    }
  }

  end() {
    clearTimeout(this.timeout)
    io.emit('answer', this.rounds[0].choices.indexOf(this.rounds[0].country))
    this.rounds.shift()
    this.instance()
  }

  reply(socketID, answer) {
    let player = this.players.find((p) => p.socket == socketID)
    if (!player.answer && this.answering) {
      if (this.rounds[0].choices[answer] == this.rounds[0].country)
        player.score++
      player.answer = true
      if (this.players[0].answer && this.players[1].answer) this.end()
    }
  }

  finish() {
    io.to(this.id).emit('end', null)
    setTimeout(() => {
      this.state = 'FINISHED'
      this.players = this.players.filter((p) => {
        if (
          io.sockets.adapter.rooms.has(this.id) &&
          io.sockets.adapter.rooms.get(this.id).has(p.socket)
        )
          return true
        else return false
      })
      this.rounds = []
      this.sync()
      if (this.players.length == 1) this.restart()
      if (this.players.length == 0) store.remove(this.id)
    }, PREPARE_TIME * 1000)
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

  sync() {
    io.to(this.id).emit('duel', {
      state: this.state,
      config: this.config,
      players: this.players,
    })
  }
}
