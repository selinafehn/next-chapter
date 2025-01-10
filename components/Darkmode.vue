<script setup>
import { useColorMode, useCycleList } from '@vueuse/core'
import { watchEffect } from 'vue-demi'

const mode = useColorMode({
  emitAuto: true,
  modes: {
    light: 'light',
    dark: 'dark',
  },
})

const {state, next} = useCycleList(['light', 'dark'], {initialValue: mode.value})
watchEffect(() => mode.value = state.value)
</script>

<template>
  <Button class="color-button" @click="next()">
    <i v-if="state === 'dark'" class="pi pi-sun"/>
    <i v-if="state === 'light'" class="pi pi-moon"/>
  </Button>
</template>

<style scoped>
</style>
