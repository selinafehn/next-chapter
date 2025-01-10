<script setup lang="ts">

import { ref } from "vue";

const selectedGenre = ref();
const genres = ref([
  { name: 'Romane' },
  { name: 'Fantasy'},
  { name: 'Selbstentwicklung'},
  { name: 'Lehrbücher'},
  { name: 'Thriller'}
]);

</script>



<template>
  <div class="flex items-center gap-4 p-4 shadow-md rounded-md">
    <!-- Logo -->
    <img
        src="../images/Logo.jpeg"
        alt="Logo Nextchapter"
        class="h-20 w-20 rounded-md"
    />

    <!-- Dropdown und Suchleiste -->
    <div class="flex items-center gap-2 w-full">
      <!-- Darkmode -->
        <Darkmode/>
      <!-- Suchleiste -->
      <div class="flex w-full">
        <InputText
            placeholder="Suche nach Titel, Autor, Stichwort, ISBN"
            class="flex-grow p-2 border border-gray-300 rounded-l-md outline-none focus:ring-2 focus:ring-gray-500"
        />
        <Button
            icon="pi pi-search"
            class="p-2 bg-gray-700 text-white hover:bg-gray-800 rounded-r-md"
        />
      </div>
    </div>
  </div>
</template>



