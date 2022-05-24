<template>
  <h2>{{ title }}</h2>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import fetchApi from "../lib/fetchApi";

const route = useRoute();

const title = ref(null);
const id = ref(route.params.id);

fetchApi(`duel/${id.value}`, "GET", (rep, data) => {
  console.log(rep);
  if (rep.status != 200) {
    title.value = "This duel doesn't exist.";
  } else {
    title.value = `Duel ${id.value}`;
  }
});
</script>

<style scoped>
h2 {
  text-align: center;
}
</style>
