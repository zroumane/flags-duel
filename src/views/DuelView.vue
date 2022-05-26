<template>
  <div>
    <div v-if="message">
      <h2>{{ message }}</h2>
      <input @click="router.go()" type="button" value="Refresh" />
    </div>
    <div v-else>
      <h2 v-if="!duel.state">Loading ...</h2>
      <div v-else>
        <div v-if="duel.state == 'CONFIG'">
          <ConfigPanel />
        </div>
        <div v-else-if="duel.state == 'PLAYING'">
          <ScoreBoard />
          <QuestionPanel />
        </div>
        <div v-else-if="duel.state == 'FINISHED'">
          <EndPanel />
        </div>
      </div>
    </div>
    <div v-if="error">
      <h2 class="error">{{ error }}</h2>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, onBeforeRouteLeave, useRouter } from 'vue-router'
import { io } from 'socket.io-client'
import api from '../helpers/api'
import ConfigPanel from '../components/ConfigPanel.vue'
import QuestionPanel from '../components/QuestionPanel.vue'
import ScoreBoard from '../components/ScoreBoard.vue'
import EndPanel from '../components/EndPanel.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

const error = ref(null)
const id = ref(route.params.id)
const message = ref(null)

const socket = computed(() => store.state.socket)
const duel = computed(() => {
  return store.state.duel || { state: null, players: null, config: null }
})

api(`duel/${id.value}`, 'GET', (data) => {
  if (data == 'notfound') {
    message.value = "This duel doesn't exist."
  } else if (data == 'playing') {
    message.value = `Duel ${id.value} already start.`
  } else if (data == 'full') {
    message.value = `Duel ${id.value} is full.`
  } else {
    store.commit(
      'setSocket',
      io('ws://localhost:3000', { withCredentials: true })
    )

    socket.value.on('connect', () => {
      console.log('Socket connection etablished with id', socket.value.id)
    })

    socket.value.on('message', (msg, send) => {
      if (msg == 'join') send(id.value)
    })

    socket.value.on('disconnect', () => {
      message.value = 'No socket connection'
      store.commit('setDuel', {})
    })

    socket.value.on('duel', (duel) => {
      error.value = ''
      store.commit('setDuel', duel)
    })

    socket.value.on('error', (err) => {
      error.value = err
    })
  }
})

onBeforeRouteLeave(() => {
  if (socket.value) {
    socket.value.disconnect()
    store.commit('setDuel', null)
    store.commit('setSocket', null)
  }
  return true
})
</script>

<style scoped>
div {
  margin: 1rem 0 1rem 0;
  width: 100%;
  text-align: center;
}
input {
  margin: 5px;
}

.error {
  color: red;
}
</style>
