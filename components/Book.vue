<template>
  <div class="bg-gray-50 dark:bg-gray-800  min-h-screen p-4">
    <!-- Grid-Container -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
      <!-- Einzelnes Buch -->
      <div v-for="book in books" :key="book.isbn" class="flex flex-col items-center bg-white  dark:bg-gray-800 shadow-lg rounded-lg p-4 w-64 transition-shadow hover:shadow-xl">
        <!-- Buch-Cover -->
        <img :src="book.imageUrlL || '/img.png'" :alt="book.title" class="w-full h-72 object-cover rounded-md mb-4"/>
        <!-- Buchtitel -->
        <h2 class="text-lg font-semibold text-gray-800  text-center">{{ book.title }}</h2>
        <!-- Autor -->
        <p class="text-sm text-gray-600 mt-1">Autor: {{ book.author }}</p>
        <!-- Verlag -->
        <p class="text-sm text-gray-500 ">Herausgeber: {{ book.publisher }}</p>
        <!-- Preis -->
        <div class="mt-2 text-lg font-bold text-gray-800 ">{{ book.price }} €</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'BookList',
  setup() {
    const books = ref([]);
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/book/all');
        if (!response.ok) {throw new Error('API Error');}
        const data = await response.json();
        books.value = data.books;
      } catch (error) {
        console.error(error);
      }
    };
    onMounted(fetchBooks);
    return { books };
  }
};
</script>

