import { io } from '../app.js'
import store from './store.js'

export default (socket) => {
  let duel

  socket.send('join', (gameId) => {
    duel = store.get(gameId)
    if (duel) duel.connect(socket)
  })

  socket.on('disconnect', () => {
    if (duel) duel.disconnect(socket.id)
  })

  socket.on('message', (msg) => {
    if (duel) {
      if (msg == 'start') duel.start()
      else if (msg == 'restart') duel.restart()
    }
  })

  socket.on('config', (config) => {
    if (duel) duel.newConfig(config)
  })
}
