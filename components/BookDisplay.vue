<script setup lang=ts>
import { ref, onMounted, watch } from 'vue';
const results = ref([]);
const totalAmount = ref('');
const page = ref(0);  // Achtung: PrimeVue verwendet 0-basierte Seiten, dein Backend vielleicht 1-basiert.
const rows = ref(4);  // Anzahl Bücher pro Seite
const searchQuery = ref('');

async function fetchBooks(currentPage = 0, pageSize = 4, genre = '') {
  try {
    const pageNumber = currentPage + 1;
    const url = `https://immense-bastion-48713-34053a42d791.herokuapp.com/search_books?genre=${genre}&pageNumber=${pageNumber}&pageSize=${pageSize}&searchQuery=${searchQuery.value}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('API Fehler');
    }
    const data = await response.json();
    results.value = data.search_results || [];
    totalAmount.value = data.totalAmount ?? 0;
  } catch (error) {
    console.error('Fehler beim Abrufen der Bücher:', error);
  }
}


function onPageChange(event: any) {
  page.value = event.page;
  rows.value = event.rows;
  fetchBooks(page.value, rows.value, selectedGenre.value);
}

onMounted(() => {
  const storedGenre = localStorage.getItem('selectedGenre');
  selectedGenre.value = storedGenre || '';
  fetchBooks(page.value, rows.value, selectedGenre.value);
});

const selectedGenre = ref('');
const genres = ref([
  { label: 'Alle Bücher', value: '' },
  { label: 'Thriller', value: 'Thriller' },
  { label: 'Historical Fiction', value: 'Historical Fiction' },
  { label: 'Fantasy', value: 'Fantasy' },
  { label: 'Literary Fiction', value: 'Literary Fiction' },
  { label: 'Self Help', value: 'Self Help' },
  { label: 'History', value: 'History' },
  { label: 'Fiction', value: 'Fiction' }
]);

watch(selectedGenre, (newGenre) => {
  localStorage.setItem('selectedGenre', newGenre);
  page.value = 0;
  fetchBooks(page.value, rows.value, newGenre);
});

</script>
<template>
  <div class="p-6 min-h-screen">
    <div class="flex flex-col md:flex-row items-center mb-4 space-y-2 md:space-y-0 md:space-x-4">
      <!-- Genre-Select-Komponente -->
      <Select v-model="selectedGenre" :options="genres" option-label="label" option-value="value" placeholder="Select a Genre" class="w-full md:w-48 h-10 border border-gray-300 rounded"/>
      <!-- Suchfeld mit Neuladen-Button -->
      <div class="flex flex-grow">
        <InputText v-model="searchQuery" placeholder="Suche nach Titel, Autor, Stichwort, ISBN" class="flex-grow h-10 p-2 border border-gray-300 rounded-l-md outline-none focus:ring-2 focus:ring-gray-500"/>
        <Button @click="fetchBooks(page.value, rows.value, selectedGenre.value)" class="h-10 px-4 bg-gray-700 text-white rounded-r-md ">Suchen</Button>
      </div>
    </div>

    <DataView :value="results" paginator :rows="rows" :totalRecords="totalAmount" @page="onPageChange" :layout="'grid'">
      <!-- Grid-Layout: Items nebeneinander -->
      <template #grid>
        <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="book in results" :key="book.isbn" class="p-4">
            <NuxtLink :to="`/book-detail/${book.isbn}`" class="no-underline">
              <div
                  class="flex flex-col items-center border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-200 dark:bg-[#2E2D2D] shadow-md transition-shadow hover:shadow-lg h-full">
                <img :src="book.imageurll || '/img.png'" :alt="book.title" class="h-60 w-auto object-cover rounded mb-4"/>
                <div class="text-lg font-semibold text-gray-800 dark:text-gray-300 mt-1 text-center">{{ book.title }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-300 mt-1 text-center">Autor: {{ book.author }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">Verlag: {{ book.publisher }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">Genre: {{ book.genre }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">Menge vorrätig: {{ book.quantity }}</div>
                <div class="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mt-2">{{ book.price }} €</div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>