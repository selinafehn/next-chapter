<script setup lang=ts>
import { ref, onMounted } from 'vue';
const books = ref([]);
const layout = ref('grid');
const totalRecords = 50;
const page = ref(1);  // Achtung: PrimeVue verwendet 0-basierte Seiten, dein Backend vielleicht 1-basiert.
const rows = ref(4);  // Anzahl Bücher pro Seite

const selectedGenre = ref(''); // leere Zeichenkette anfangs


async function fetchBooks(currentPage = 0, pageSize = 4, genre = '') {
  try {
    const pageNumber = currentPage + 1; // PrimeVue => 0-based, Backend => 1-based
    const url = `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/book/all?genre=${genre}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('API Fehler');
    }

    const data = await response.json();
    books.value = data.books || [];

    // Gesamtzahl aus dem Backend, damit DataView weiß, wie viele Einträge es gibt
    totalRecords.value = data.totalCount || 0;
  } catch (error) {
    console.error('Fehler beim Abrufen der Bücher:', error);
  }
}


function onPageChange(event: any) {
  // event.page ist 0-basiert (0 = Seite 1).
  // event.rows = Anzahl pro Seite
  page.value = event.page;
  rows.value = event.rows;

  // Backend ist i. d. R. 1-basiert => +1
  fetchBooks(page.value + 1, rows.value);
}

onMounted(() => {
  // Wir rufen page.value + 1 auf, wenn das Backend 1-basiert arbeitet.
  fetchBooks(page.value + 1, rows.value, selectedGenre.value);
});

watch(selectedGenre, (newGenre) => {
  page.value = 0;
  fetchBooks(page.value, rows.value, newGenre);
});
</script>
<template>
  <div class="p-6 min-h-screen">

    <select v-model="selectedGenre" class="mb-4 p-2 border rounded">
      <option value="">Alle Genres</option>
      <option value="Thriller">Thriller</option>
      <option value="Fantasy">Fantasy</option>
      <option value="History">History</option>
    </select>

    <DataView
        :value="books"
        paginator
        :rows="rows"
        :totalRecords="totalRecords"
        @page="onPageChange"
        :layout="'grid'"
    >
      <!-- Grid-Layout: Items nebeneinander -->
      <template #grid>
        <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
              v-for="book in books"
              :key="book.isbn"
              class="p-4"
          >
            <NuxtLink :to="`/book-detail/${book.isbn}`" class="no-underline">
              <div
                  class="flex flex-col items-center border border-gray-200
                       dark:border-gray-700 rounded-lg p-6 bg-gray-200
                       dark:bg-[#2E2D2D] shadow-md transition-shadow
                       hover:shadow-lg h-full"
              >
                <img
                    :src="book.imageUrlL || '/img.png'"
                    :alt="book.title"
                    class="h-60 w-auto object-cover rounded mb-4"
                />
                <div class="text-lg font-semibold text-gray-800 dark:text-gray-300 mt-1 text-center">
                  {{ book.title }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-300 mt-1 text-center">
                  Autor: {{ book.author }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                  Verlag: {{ book.publisher }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                  Menge vorrätig: {{ book.quantity }}
                </div>
                <div class="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mt-2">
                  {{ book.price }} €
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>