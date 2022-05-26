<template>
  <div>
    <div v-if="!canStart">Waiting for second player ..</div>
    <select @change="update" v-model="duel.config.category">
      <option value="0">World</option>
      <option value="1">Africa</option>
      <option value="2">America</option>
      <option value="3">Asia</option>
      <option value="4">Europe</option>
    </select>
    <input
      @change="update"
      type="number"
      min="5"
      max="50"
      v-model="duel.config.round" />
    <input
      @click="socket.send('start')"
      type="button"
      value="Start"
      :disabled="!canStart" />
  </div>
</template>

<script setup>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'

const store = useStore()

const socket = computed(() => store.state.socket)
const duel = computed(() => store.state.duel)

const canStart = computed(() => (duel.value.players.length == 2 ? true : false))

const update = () => {
  socket.value.emit('config', {
    category: parseInt(duel.value.config.category),
    round: duel.value.config.round,
  })
}
</script>
