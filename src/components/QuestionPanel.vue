<template>
  <div>
    <div class="status" v-if="status">{{ status }}</div>
    <div class="countdown">
      <div v-if="countdown">
        <span v-if="!choosing">Next round will start in</span>
        {{ countdown }}
      </div>
      <div v-else>Waiting ...</div>
    </div>
    <div v-if="flag">
      <img class="flag" :src="flag" />
      <div class="choice">
        <input
          v-for="(c, i) in choices"
          :key="i"
          @click="reply(i)"
          type="submit"
          v-model="c.name"
          :disabled="isAnswer"
          :class="{
            choose: choice == i,
            wrong: !choosing && answer != i && choice == i,
            answer: !choosing && answer == i,
          }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const socket = computed(() => store.state.socket)

const choosing = ref(false)
const isAnswer = ref(false)
const countdown = ref(null)
const choices = ref([])
const choice = ref(null)
const flag = ref(null)
const answer = ref(null)

const status = ref(null)

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
  status.value = data.status
  flag.value = 'data:image/png;base64,' + data.flag
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
})
</script>

<style scoped>
.status {
  font-size: 2vh;
  margin-top: 2vh;
}
.countdown {
  font-size: 3vh;
  margin-top: 2vh;
}
.flag {
  margin-top: 2vh;
  height: 22vh;
}

.choice {
  margin-top: 2vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.choice input {
  width: 60vh;
  max-width: 90%;
  font-size: 2vh;
  height: 4vh;
  margin-top: 1vh;
  border: 0.5vh rgb(24, 21, 161) solid;
  background-color: rgb(24, 19, 104);
  color: white;
  border-radius: 1vh;
  transition: 0.3s ease-in-out;
}

.choice input.choose {
  background-color: rgb(24, 21, 161);
}

.choice input:disabled {
  opacity: 0.7;
}

.answer {
  background-color: #719a31 !important;
  border: 0.5vh #719a31 !important;
  opacity: 1 !important;
}

.wrong {
  background-color: red !important;
  border: 0.5vh red solid !important;
  opacity: 1 !important;
}
</style>
