<template>
  <div>
    <router-link class="text" :to="{ name: 'home' }">Home</router-link>
    <div class="text">Duel : {{ id }}</div>
    <div id="urlField">
      <input type="text" v-model="url" @click="selfSelect" />
      <span @click="handleCopy">
        <PasteIcon class="copypasteIcon" />
      </span>
    </div>
    <div class="form">
      <div class="field">
        <div for="category">Region</div>
        <select id="category" @change="update" v-model="duel.config.category">
          <option value="0">World</option>
          <option value="1">Africa</option>
          <option value="2">America</option>
          <option value="3">Asia</option>
          <option value="4">Europe</option>
        </select>
      </div>
      <div class="field">
        <div for="round">Round</div>
        <input
          id="round"
          @change="update"
          type="number"
          min="5"
          max="50"
          v-model="duel.config.round" />
      </div>
      <input
        class="gameInput"
        id="startGame"
        @click="socket.send('start')"
        type="button"
        value="Start"
        :disabled="!canStart" />
    </div>
  </div>
  <div class="text" v-if="!canStart">Waiting for second player ...</div>
</template>

<script setup>
import { computed, defineProps } from '@vue/runtime-core'
import { useStore } from 'vuex'
import PasteIcon from '../components/PasteIcon.vue'

const store = useStore()

const socket = computed(() => store.state.socket)
const duel = computed(() => store.state.duel)
const { id } = defineProps(['id'])
const url = window.location.href

const canStart = computed(() => (duel.value.players.length == 2 ? true : false))

const selfSelect = (e) => e.target.select()

const update = () => {
  socket.value.emit('config', {
    category: parseInt(duel.value.config.category),
    round: duel.value.config.round,
  })
}

const handleCopy = () => {
  let field = document.querySelector('#urlField')
  field.firstChild.select()
  try {
    navigator.clipboard.readText().then((text) => {
      navigator.clipboard.writeText(field.firstChild.value)
      field.querySelector('svg').classList.add('success')
    })
  } catch (error) {
    field.querySelector('svg').classList.add('error')
  }
}
</script>

<style scoped>
.form {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 30%;
  min-width: 300px;
  margin: 0 auto;
  padding-top: 2vh;
}

.field {
  margin-top: 1vh;
  margin-bottom: 1vh;
  font-size: 2vh;
}

#category {
  height: 4vh;
  width: 30%;
  min-width: 200px;
  font-size: 2vh;
}

#round {
  height: 4vh;
  width: 30%;
  min-width: 200px;
  font-size: 2vh;
}

#startGame {
  height: 8vh;
  font-size: 3vh;
  width: 20%;
  min-width: 150px;
}

#startGame:hover {
  font-size: 4vh;
}
#startGame:disabled:hover {
  font-size: 3vh;
}

#urlField {
  margin-top: 2vh;
  height: 4vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
#urlField input[type='text'] {
  height: 100%;
  text-align: center;
  font-size: 3vh;
  width: 60vh;
  max-width: 70%;
  margin-left: 6vh;
  margin-right: 1vh;
}
.copypasteIcon {
  height: 3vh;
}
</style>
