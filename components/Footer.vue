<script setup lang="ts">
</script>

<template>
  <footer class="flex justify-between items-center p-4 shadow-md rounded-md mt-4">
    <!-- Name der App -->
    <span class="text-gray-700 font-semibold">NextChapter</span>
    <!-- Links -->
    <div class="flex gap-4">
      <NuxtLink to="/impressum" class="text-gray-600 hover:text-gray-800">Impressum</NuxtLink>
      <NuxtLink to="/datenschutz" class="text-gray-600 hover:text-gray-800">Datenschutz</NuxtLink>
    </div>
  </footer>
</template>

<style>
</style>