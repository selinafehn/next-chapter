<script setup lang="ts">
/**
 * Footer-Komponente mit App-Namen und Links zu Impressum und Datenschutz.
 */
</script>

<template>
  <footer class="flex justify-between items-center p-4 shadow-md rounded-md mt-4">
    <!-- App-Name -->
    <span class="text-gray-700 font-semibold">NextChapter</span>

    <!-- Links zu rechtlichen Seiten -->
    <div class="flex gap-4">
      <NuxtLink to="/impressum" class="text-gray-600 hover:text-gray-800">Impressum</NuxtLink>
      <NuxtLink to="/datenschutz" class="text-gray-600 hover:text-gray-800">Datenschutz</NuxtLink>
    </div>
  </footer>
</template>