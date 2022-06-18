<template>
  <div class="container">
    <div class="scoreboard">
      <div class="player" v-for="player in players" :key="player">
        <span>
          {{ player.name }}
        </span>
        <span>
          {{ player.score }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const duel = computed(() => store.state.duel)
const players = computed(() =>
  duel.value.players
    .map((p) => {
      return {
        name: p.socket == store.state.socket.id ? 'You' : 'Adverse',
        score: p.score,
      }
    })
    .sort((a, b) => b.score - a.score)
)
</script>

<style scoped>
.container {
  padding-top: 1vh;
  display: flex;
  justify-content: center;
}

.scoreboard {
  border-radius: 10px;
  border: 0.5vh rgba(24, 19, 104) solid;
  width: 90%;
  max-width: 50vh;
  font-size: 2vh;
}
.player {
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin: 1vh;
  padding: 1vh;
  background-color: rgba(24, 19, 104);
}
</style>
