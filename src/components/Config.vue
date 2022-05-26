<template>
  <select @change="update" v-model="props.config.category">
    <option value="0">World</option>
    <option value="1">Africa</option>
    <option value="2">America</option>
    <option value="3">Asia</option>
    <option value="4">Europe</option>
  </select>
  <input
    @change="update"
    type="number"
    min="5"
    max="50"
    v-model="props.config.round" />
  <input @click="start" type="button" value="Start" />
</template>

<script setup>
import { watch } from 'vue'

const emit = defineEmits(['sendSocket'])
const props = defineProps(['config'])
const start = () => emit('sendSocket', 'message', 'start')

const update = () => {
  emit('sendSocket', 'config', {
    category: parseInt(props.config.category),
    round: props.config.round,
  })
}
</script>
