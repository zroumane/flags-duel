<template>
  <div class="head">
    <div>Player 1</div>
    <div>{{ duel.players[0].score }}</div>
    <div>:</div>
    <div>{{ duel.players[1].score }}</div>
    <div>Player 2</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const duel = computed(() => store.state.duel)
</script>

<style scoped>
.head {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 500px;
  margin: 2rem auto;
}
</style>
