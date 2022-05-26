import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      socket: null,
      duel: null,
    }
  },
  mutations: {
    setSocket(state, socket) {
      state.socket = socket
    },
    setDuel(state, duel) {
      state.duel = duel
    },
  },
})

export default store
