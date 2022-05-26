import Duel from './duel.js'

let duels = []

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
  remove: (id) => {
    duels = duels.filter((d) => d.id != id)
  },
  size: () => {
    return duels.length
  },
}
