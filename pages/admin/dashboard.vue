<script setup lang="ts">

import Header from "~/components/header.vue";
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const items = computed(() => [
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push('/')
    }
  }]);
</script>

<template>
  <Header />
  <MenuBar :model="items" class="text-gray-800" />
</template>

<style scoped>

</style>