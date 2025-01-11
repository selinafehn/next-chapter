<script setup>
import { ref, onMounted } from 'vue';
const books = ref([]);

const fetchBooks = async () => {
  let data = null;
  try {
    const response = await fetch('https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/book/all');
    if (!response.ok) throw new Error('API Fehler');
    data = await response.json();
    books.value = data.books || [];
  } catch (error) {
  }
};

onMounted(async () => {
  await fetchBooks();
});

</script>

<template>
  <div class="p-6 bg-gray-50 dark:bg-black min-h-screen">
    <Carousel
        :value="books"
        :numVisible="4"
        :numScroll="2"
        class="text-gray-900 dark:text-gray-100 p-5 pb-4"
    >

      <template #item="slotProps">
        <NuxtLink :to="`/book-detail/${slotProps.data.isbn}`" class="no-underline">
        <div class="flex flex-col items-center border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md transition-shadow hover:shadow-lg w-60 mx-auto h-full">
          <img
              :src="slotProps.data.imageUrlL || '/img.png'"
              :alt="slotProps.data.title"
              class="h-60 w-auto object-cover rounded mb-4"
          />
          <div class="text-lg font-semibold text-gray-800 dark:text-gray-300 mt-1 text-center">
            Autor: {{ slotProps.data.title }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300 mt-1 text-center">
            Autor: {{ slotProps.data.author }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
            Verlag: {{ slotProps.data.publisher }}
          </div>
          <div class="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mt-2">
            {{ slotProps.data.price }} €
          </div>
        </div>
        </NuxtLink>
      </template>
    </Carousel>
  </div>
</template>


