<script setup>
import { ref, onMounted } from 'vue'
import Header from '~/components/header.vue'
import Navbanner from '~/components/navbanner.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
import { useStorage } from '@vueuse/core';
const userEmailStorage = useStorage('auth_email', '');
const userEmail = userEmailStorage.value;
const list = ref(null)
const book = ref(null)

onMounted(async () => {
  await fetchList()
})

async function fetchList () {
  try {
    const response = await fetch(`https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/wishlist?userEmail=${userEmail}`)

    if (!response.ok) {
      throw new Error('Fehler beim Laden der Wishlist')
    }

    const data = await response.json()
    // data sollte dem JSON entsprechen, das du oben gepostet hast
    // also in etwa: { books: [...] }
    list.value = data
  } catch (error) {
    console.error('Fehler:', error)
    list.value = { books: [] } // Leeres Array, damit v-if/v-for nicht crashen
  }
}

async function fetchBookByIsbn() {
  try {
    const response = await fetch(`https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/book?isbn=${isbn}`)
    if (!response.ok) {
      throw new Error('Fehler beim Laden des Buches')
    }
    const data = await response.json()
    book.value = data
  } catch (error) {
    console.error('Fehler:', error)
    book.value = null
  }
}

</script>

<template>
  <Header />
  <Navbanner />

  <div class="container mx-auto p-4">
    <!-- Header -->
    <h1 class="text-2xl font-bold mb-4 text-center">Hier ist deine Wishlist {{userEmail}}</h1>

    <!-- Wenn list.books existiert und nicht leer ist -->
    <div v-if="list?.books && list.books.length > 0" class="space-y-4">
      <!-- Iteriere über alle Bücher in der Wishlist -->
      <div
          v-for="book in list.books"
          :key="book.isbn"
          class="flex items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
      >
        <!-- Bild des Buches -->
        <img
            :src="book.imageUrlL || book.imageUrlM || book.imageUrl"
            :alt="`Cover von ${book.title}`"
            class="w-32 h-48 object-cover rounded-md mr-4"
        />
        <!-- Informationen zum Buch -->
        <div class="flex-1">
          <h2 class="text-lg font-semibold">{{ book.title }}</h2>
          <p class="text-gray-700"><span class="font-medium">Autor:</span> {{ book.author }}</p>
          <p class="text-gray-700"><span class="font-medium">Genre:</span> {{ book.genre }}</p>
          <p class="text-gray-700 font-bold"><span class="font-bold">Preis:</span> {{ book.price }} €</p>
        </div>
        <!-- Einkaufswagen-Symbol -->
        <Button
            @click="addToCart(book.isbn)"
            class="text-gray-600 hover:text-gray-800 ml-4"
        >
          In den Warenkorb
        </Button>
        <Button
            @click="deleteList(book.isbn)"
            class="text-gray-600 hover:text-gray-800 ml-4"
        >
          Löschen
        </Button>
      </div>
    </div>

    <!-- Wenn das books-Array leer ist oder gar nichts da ist -->
    <div v-else class="text-center text-gray-500">
      <p>Keine Bücher in der Wishlist vorhanden.</p>
    </div>
  </div>

</template>