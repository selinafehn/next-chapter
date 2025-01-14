<script setup lang=ts>
import { ref, onMounted } from 'vue';
const books = ref([]);
const layout = ref('grid');
const totalRecords = 50;
const page = ref(1);  // Achtung: PrimeVue verwendet 0-basierte Seiten, dein Backend vielleicht 1-basiert.
const rows = ref(4);  // Anzahl Bücher pro Seite


async function fetchBooks(pageNumber: number, pageSize: number) {
  try {
    const genre = ""; // oder was du an dein Backend schicken möchtest
    // Beispiel-URL, an der man pageNumber & pageSize anhängt:
    // ACHTUNG: Falls dein Backend 1-basiert ist, mußt du pageNumber 1-basiert übergeben.
    const url = `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/book/all?genre=${genre}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Bücher');
    }
    const data = await response.json();

    // Hier kommen nur die Bücher der angeforderten Seite.
    books.value = data?.books || [];

    // totalCount gibt an, wie viele Bücher insgesamt existieren (über alle Seiten hinweg).
    // Der Server MUSS diesen Wert liefern.
    totalRecords.value = data?.totalCount || 0;
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
  fetchBooks(page.value + 1, rows.value);
});
</script>
<template>
  <div class="p-6 min-h-screen">
    <!-- Nur wenn du Layout-Umschaltung willst -->
    <DataViewLayoutOptions v-model:layout="layout" class="mb-3" />

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