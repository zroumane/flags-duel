<template>
  <div>
    <div v-if="duel.players && duel.players.length == 2">{{ result }}</div>
    <input
      id="restartGame"
      class="gameInput"
      @click="socket.send('restart')"
      type="submit"
      value="Restart" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const socket = computed(() => store.state.socket)
const duel = computed(() => store.state.duel)

const result = computed(() => {
  if (duel.value.players.length == 2) {
    if (duel.value.players[0].score == duel.value.players[1].score) {
      return 'Draft !'
    } else if (
      duel.value.players.reduce((p, c) => (p.score > c.score ? p : c)).socket ==
      socket.value.id
    ) {
      return 'You won !'
    } else {
      return 'You lost !'
    }
  }
  return ''
})
</script>

<style scoped>
#restartGame {
  height: 12vh;
  font-size: 4vh;
  width: 30%;
  min-width: 300px;
}
#restartGame:hover {
  font-size: 5vh;
}

div {
  font-size: 4vh;
  margin-top: 5vh;
}
</style>
