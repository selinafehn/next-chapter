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

const toast = useToast()

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
    list.value = data
  } catch (error) {
    console.error('Fehler:', error)
    list.value = { books: [] }
  }
}


// Funktion zum Löschen eines Buches aus der Wishlist
async function deleteOneBookFromWishlist(isbn) {
  try {
    const response = await fetch(`https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/wishlistitem?userEmail=${userEmail}&isbn=${isbn}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Fehler beim Entfernen des Buches aus der Wishlist')
    }

    // Buch lokal aus der Liste entfernen (kein Reload notwendig)
    list.value.books = list.value.books.filter(book => book.isbn !== isbn)

    // Erfolgsmeldung anzeigen
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Buch aus der Wishlist entfernt', life: 3000 })
  } catch (error) {
    console.error('Fehler:', error)
    // Fehlerbenachrichtigung anzeigen
    toast.add({ severity: 'error', summary: 'Fehler', detail: 'Buch konnte nicht entfernt werden', life: 3000 })
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

  <Toast /> <!-- PrimeVue Toast-Komponente für Benachrichtigungen -->

  <div class="container mx-auto p-4">
    <!-- Header -->
    <h1 class="text-2xl font-bold mb-4 text-center">Hier ist deine Wishlist, {{ userEmail }}</h1>

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
        <!-- Löschen-Symbol -->
        <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger ml-4"
            @click="deleteOneBookFromWishlist(book.isbn)"
            tooltip="Aus Wishlist entfernen"
            tooltip-options="{position: 'top'}"
        />
      </div>
    </div>

    <!-- Wenn das books-Array leer ist oder gar nichts da ist -->
    <div v-else class="text-center text-gray-500">
      <p>Keine Bücher in der Wishlist vorhanden.</p>
    </div>
  </div>

</template>