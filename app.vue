<template>
  <NuxtLayout>
    <NuxtPage />

  </NuxtLayout>
</template>

<script setup lang="ts">
import Header from "~/components/header.vue";
</script>

<style>
button{
  --p-button-primary-border-color: #374151;
  --p-button-primary-background: #374151;
  --p-button-primary-hover-background: #a1a1aa;
  --p-select-border-color: #374151;
  --p-select-focus-border-color: #a1a1aa;
  --p-form-field-focus-border-color: #374151;
}
</style>