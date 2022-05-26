<template>
  <div v-if="message">
    <h2>{{ message }}</h2>
    <input @click="router.go()" type="button" value="Refresh" />
  </div>
  <div v-else>
    <h2 v-if="!state">Loading ...</h2>
    <div v-else>
      <div>
        {{ state }}
      </div>
      <Players :players="players" />
      <Config
        v-if="state == 'CONFIG'"
        @sendSocket="sendSocket"
        :config="config"
      />
      <div v-if="state == 'FINISHED'">
        <h2 v-if="players && players.length == 2">{{ result }}</h2>
        <input
          @click="sendSocket('message', 'restart')"
          type="submit"
          value="Restart"
        />
      </div>
    </div>
  </div>
  <div v-if="error">
    <h2 class="error">{{ error }}</h2>
  </div>
</template>

<script setup>
import { computed, ref, toRaw, watch } from "vue";
import { useRoute, onBeforeRouteLeave, useRouter } from "vue-router";
import { io } from "socket.io-client";
import fetchApi from "../lib/fetchApi";
import Config from "../components/Config.vue";
import Playing from "../components/Playing.vue";
import Players from "../components/Players.vue";

const route = useRoute();
const router = useRouter();

const error = ref(null);
const id = ref(route.params.id);
const message = ref(null);

const state = ref(null);
const config = ref(null);
const players = ref([]);

const result = computed(() => {
  if (players.value.length == 2) {
    if (players.value[0].score == players.value[1].score) {
      return "Draft !";
    } else if (
      players.value.reduce((p, c) => (p.value > c.value ? p : c)).socket ==
      socket.id
    ) {
      return "You won !";
    } else {
      return "You lost !";
    }
  }
});

let socket;

fetchApi(`duel/${id.value}`, "GET", (data) => {
  if (data == "notfound") {
    message.value = "This duel doesn't exist.";
  } else if (data == "playing") {
    message.value = `Duel ${id.value} already start.`;
  } else if (data == "full") {
    message.value = `Duel ${id.value} is full.`;
  } else {
    socket = io("ws://localhost:3000", { withCredentials: true });
    socket.on("connect", () => {
      console.log("Socket connection etablished with id", socket.id);
    });
    socket.on("message", (msg, cb) => {
      if (msg == "join") {
        cb(id.value);
      }
    });
    socket.on("disconnect", () => {
      message.value = "No socket connection";
    });

    socket.on("duel", (data) => {
      error.value = "";
      state.value = data.state;
      config.value = data.config;
      players.value = data.players;
    });

    socket.on("error", (err) => {
      error.value = err;
    });
  }
});

const sendSocket = (eventName, data) => {
  socket.emit(eventName, data);
};

onBeforeRouteLeave(() => {
  if (socket) {
    socket.disconnect();
  }
  return true;
});
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