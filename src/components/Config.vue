<template>
  <select v-model="props.config.category">
    <option value="0">World</option>
    <option value="1">America</option>
    <option value="2">Africa</option>
    <option value="3">Asia</option>
    <option value="4">Europe</option>
  </select>
  <input type="number" min="5" max="50" v-model="props.config.round" />
  <input @click="start" type="button" value="Start" />
</template>

<script setup>
import { watch } from 'vue'

const emit = defineEmits(['sendSocket'])
const props = defineProps(['config'])
const start = () => emit('sendSocket', 'message', 'start')

const checkUpdate = (n, o) => {
  if (o && n != o) {
    emit('sendSocket', 'config', {
      category: parseInt(props.config.category),
      round: props.config.round,
    })
  }
}

watch(
  () => props.config.category,
  (n, o) => checkUpdate(n, o)
)
watch(
  () => props.config.round,
  (n, o) => checkUpdate(n, o)
)
</script>
