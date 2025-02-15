<script setup>
import { useColorMode, useCycleList } from '@vueuse/core'
import { watchEffect } from 'vue-demi'

/**
 * Initialisiert den Farbmodus (Hell/Dunkel) mit Unterstützung für automatische Erkennung.
 */
const mode = useColorMode({
  emitAuto: true,
  modes: {
    light: 'light',
    dark: 'dark',
  },
})

/**
 * Erzeugt eine Liste, die zwischen den Farbmodi (light/dark) zyklisch wechselt.
 * Der initiale Wert basiert auf dem aktuellen Farbmodus.
 */
const { state, next } = useCycleList(['light', 'dark'], { initialValue: mode.value })

/**
 * Synchronisiert den Farbmodus (`mode`) mit dem aktuellen Zustand (`state`).
 */
watchEffect(() => mode.value = state.value)
</script>

<template>
  <!-- Button zum Umschalten zwischen Light- und Darkmode -->
  <Button class="color-button" @click="next()">
    <!-- Symbol für den Lightmode (wenn Darkmode aktiv ist) -->
    <i v-if="state === 'dark'" class="pi pi-sun" />
    <!-- Symbol für den Darkmode (wenn Lightmode aktiv ist) -->
    <i v-if="state === 'light'" class="pi pi-moon" />
  </Button>
</template>