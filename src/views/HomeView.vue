<template>
  <div>
    <input
      :disabled="fetching"
      @click="newGame"
      type="button"
      value="New Game"
    />
  </div>
  <div>
    <input v-model="gameId" type="text" />
    <input
      :disabled="fetching"
      @click="handleJoin"
      type="submit"
      value="Join"
    />
  </div>
  <div v-if="duelCount">
    <p>There is {{ duelCount }} duel(s) in progress !</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import fetchApi from "../lib/fetchApi";

const router = useRouter();

const gameId = ref(null);
const fetching = ref(false);
const duelCount = ref(false);

fetchApi("duel", "GET", (rep, data) => {
  duelCount.value = data.count;
});

const newGame = () => {
  fetching.value = true;
  fetchApi("duel", "POST", (rep, data) => {
    if (data.id) {
      joinGame(data.id);
    } else {
      alert(data);
    }
  });
};

const handleJoin = () => {
  if (gameId.value != null) {
    joinGame(gameId.value);
  }
};
const joinGame = (id) => {
  router.push({ path: `/duel/${id}` });
};
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
</style>