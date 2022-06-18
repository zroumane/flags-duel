<template>
  <div>
    <p>There is {{ duelCount }} duel(s) in progress !</p>
    <input
      class="gameInput"
      id="newGame"
      :disabled="fetching"
      @click="newGame"
      type="button"
      value="New Game" />
    <div class="text">or join an existing game</div>
    <form>
      <div id="idField">
        <input v-model="gameId" type="text" />
        <span @click="handlePaste">
          <PasteIcon class="copypasteIcon" />
        </span>
      </div>
      <div>
        <input
          class="gameInput"
          id="joinGame"
          :disabled="!canJoin"
          @click.prevent="handleJoin"
          type="submit"
          value="Join" />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../helpers/api'
import PasteIcon from '../components/PasteIcon.vue'

const router = useRouter()

const gameId = ref(null)
const fetching = ref(false)
const duelCount = ref(0)

api('duel', 'GET', (data) => {
  duelCount.value = data.count
})

const newGame = () => {
  fetching.value = true
  api('duel', 'POST', (data) => {
    if (data.id) {
      joinGame(data.id)
    } else {
      alert(data)
    }
  })
}

const canJoin = computed(() => (gameId.value?.length == 5 ? true : false))

const handlePaste = () => {
  try {
    navigator.clipboard.readText().then((text) => {
      document.querySelector('#idField').firstChild.value = text
      document
        .querySelector('#idField')
        .querySelector('svg')
        .classList.add('success')
      gameId.value = text
    })
  } catch (error) {
    document
      .querySelector('#idField')
      .querySelector('svg')
      .classList.add('error')
  }
}

const handleJoin = () => {
  console.log(gameId.value)
  if (gameId.value != null) {
    joinGame(gameId.value)
  }
}
const joinGame = (id) => {
  router.push({ path: `/duel/${id}` })
}
</script>

<style scoped>
#newGame {
  height: 10vh;
  font-size: 3vh;
  width: 25%;
  min-width: 300px;
}
#newGame:hover {
  font-size: 3.5vh;
}

#joinGame {
  height: 8vh;
  font-size: 2.5vh;
  width: 15%;
  min-width: 150px;
}
#joinGame:hover {
  font-size: 3vh;
}
#joinGame:disabled:hover {
  font-size: 3vh;
}

#idField {
  height: 7vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
#idField input[type='text'] {
  height: 100%;
  text-align: center;
  font-size: 3vh;
  width: 16vh;
  margin-left: 6vh;
  margin-right: 1rem;
}

.copypasteIcon {
  height: 4vh;
}

.text {
  font-size: 3vh;
}

form {
  margin-top: 2vh;
}
</style>
