<template>
  <h2>{{ message }}</h2>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import fetchApi from "../lib/fetchApi";

const route = useRoute();

const error = ref(null);
const id = ref(route.params.id);
const message = ref("Loading ...");

fetchApi(`duel/${id.value}`, "GET", (data) => {
  if (data == "notfound") {
    message.value = "This duel doesn't exist.";
  } else if (data == "playing") {
    message.value = `Duel ${id.value} already start.`;
  } else if (data == "full") {
    message.value = `Duel ${id.value} is full.`;
  } else {
    const socket = io("ws://localhost:3000", { withCredentials: true });
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("message", (data) => {
      console.log(data);
    });
  }
});
</script>

<style scoped>
h2 {
  text-align: center;
}
</style>
