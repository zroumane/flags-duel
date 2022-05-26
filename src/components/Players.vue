<template>
  <div class="head" v-if="props.players.length == 2">
    <div>Player 1</div>
    <div>{{ props.players[0].score }}</div>
    <div>:</div>
    <div>{{ props.players[1].score }}</div>
    <div>Player 2</div>
  </div>
  <div v-else>Waiting for second player ...</div>
</template>

<script setup>
const props = defineProps(['players'])
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
