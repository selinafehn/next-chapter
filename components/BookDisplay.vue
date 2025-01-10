<template>
  <div class="p-6 bg-gray-50  dark:bg-black min-h-screen">
    <Carousel
        :value="books"
        :numVisible="4"
        :numScroll="4"
        :responsiveOptions="responsiveOptions"
        class="text-gray-900 dark:text-gray-100 p-5 pb-4"
    >
      <!-- Slot für einzelne Buchkarte im Karussell -->
      <template #item="slotProps">
        <div
            class="flex flex-col items-center border border-gray-200
                 dark:border-gray-700 rounded-lg p-6 bg-white
                 dark:bg-gray-800 shadow-md transition-shadow
                 hover:shadow-lg w-64 mx-auto h-full"
        >
          <!-- Buch-Cover -->
          <img
              :src="slotProps.data.imageUrlL || '/img.png'"
              :alt="slotProps.data.title"
              class="h-60 w-auto object-cover rounded mb-4"
          />

          <!-- Buchtitel (verlinkt) -->
          <NuxtLink :to="`/book-detail/${slotProps.data.isbn}`">
            <div class="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center hover:underline">
              {{ slotProps.data.title }}
            </div>
          </NuxtLink>

          <!-- Autor, Verlag -->
          <div class="text-sm text-gray-600 dark:text-gray-300 mt-1 text-center">
            Autor: {{ slotProps.data.author }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
            Verlag: {{ slotProps.data.publisher }}
          </div>

          <!-- Preis -->
          <div class="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mt-2">
            {{ slotProps.data.price }} €
          </div>

          <!-- Warenkorb-Button -->
          <Button class="mt-4 px-4 py-2 mt-auto bg-gray-600 text-white rounded-md hover:bg-gray-600" :disabled="slotProps.data.quantity === 0">
            {{ slotProps.data.quantity > 0 ? 'In den Warenkorb' : 'Nicht verfügbar' }}
          </Button>
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'BookDisplay',
  setup() {
    const books = ref([]);

    const fetchBooks = async () => {
      try {
        const response = await fetch(
            'https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/book/all'
        );
        if (!response.ok) {
          throw new Error('API Error');
        }
        const data = await response.json();
        books.value = data.books;
      } catch (error) {
        console.error('Fehler beim Laden der Bücher:', error);
        books.value = []; // Leere Liste bei Fehler
      }
    };

    const responsiveOptions = ref([
      {
        breakpoint: '1400px',
        numVisible: 4,
        numScroll: 1
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
      }
    ]);

    onMounted(fetchBooks);

    return { books, responsiveOptions };
  }
};
</script>


