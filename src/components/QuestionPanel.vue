<template>
  <div>
    <div>{{ countdown || 'Waiting ...' }}</div>
    <div v-if="flag">
      <div class="flag">
        <img v-if="flag" :src="flag" />
      </div>
      <div class="choice">
        <input
          v-for="(c, i) in choices"
          :key="i"
          @click="reply(i)"
          type="submit"
          v-model="c.name"
          :disabled="isAnswer"
          :class="{
            wrong: !choosing && answer != i && choice == i,
            answer: !choosing && answer == i,
          }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const socket = computed(() => store.state.socket)

// const answer = ref(false)
const choosing = ref(false)
const isAnswer = ref(false)
const countdown = ref(null)
const choices = ref([])
const choice = ref(null)
const flag = ref(null)
const answer = ref(null)

let interval

const reply = (i) => {
  choice.value = i
  isAnswer.value = true
  socket.value.emit('reply', i)
}

socket.value.on('prepare', (time) => {
  clearInterval(interval)
  countdown.value = time
  interval = setInterval(() => (countdown.value -= 1), 1000)
})

socket.value.on('question', (data) => {
  clearInterval(interval)
  answer.value = null
  choice.value = null
  isAnswer.value = false
  choosing.value = true
  flag.value = data.flag
  choices.value = data.choices
  countdown.value = data.time
  interval = setInterval(() => (countdown.value -= 1), 1000)
})

socket.value.on('answer', (a) => {
  clearInterval(interval)
  choosing.value = false
  answer.value = a
})

socket.value.on('end', () => {
  clearInterval(interval)
  countdown.value = null
  choices.value = []
  flag.value = null
})
</script>

<style scoped>
.flag {
  width: 500px;
  width: 300px;
  margin: 0 auto;
  border: 1px black solid;
}

img {
  width: 100%;
  height: 100%;
}

.answer {
  background-color: greenyellow;
}

.wrong {
  background-color: red;
}
</style>
