<script setup lang ="ts">
import { ref, onMounted } from 'vue'
import Header from '~/components/header.vue'
import Navbanner from '~/components/navbanner.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
import { useStorage } from '@vueuse/core';
const userEmailStorage = useStorage('auth_email', '');
const userEmail = userEmailStorage.value;
const userNameStorage = useStorage('auth_username', '');
const userName = userNameStorage.value;
const list = ref(null)
const book = ref(null)

const toast = useToast()

onMounted(async () => {
  await fetchList()
})

async function fetchList () {
  try {
    const response = await fetch(`https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/wishlist?userEmail=${userEmail}`)
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Wunschliste')
    }
    const data = await response.json()
    list.value = data
  } catch (error) {
    console.error('Fehler:', error)
    list.value = { books: [] }
  }
}

async function addToCart(isbn) {
  try {
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/cartitem?userEmail=${userEmail}&isbn=${isbn}&quantity=1`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
    if (!response.ok) {
      throw new Error('Fehler beim Hinzufügen zur Wunschliste')
    }
    list.value.books = list.value.books.filter(book => book.isbn !== isbn)

    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Buch wurde dem Warenkorb hinzugefügt', life: 3000 })
  } catch (error) {
    console.log(error + response);
  }
  deleteOneBookFromWishlist(isbn);
}

// Funktion zum Löschen eines Buches aus der Wishlist
async function deleteOneBookFromWishlist(isbn) {
  try {
    const response = await fetch(`https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/wishlistitem?userEmail=${userEmail}&isbn=${isbn}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Fehler beim Entfernen des Buches aus der Wunschliste')
    }

    // Buch lokal aus der Liste entfernen (kein Reload notwendig)
    list.value.books = list.value.books.filter(book => book.isbn !== isbn)

    // Erfolgsmeldung anzeigen
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Buch aus der Wunschliste entfernt', life: 3000 })
  } catch (error) {
    console.error('Fehler:', error)
    // Fehlerbenachrichtigung anzeigen
    toast.add({ severity: 'error', summary: 'Fehler', detail: 'Buch konnte nicht entfernt werden', life: 3000 })
  }
}

</script>

<template>
  <Header />
  <Navbanner />

  <Toast />
  <div class="container mx-auto p-4">
    <!-- Header -->
    <h1 class="text-2xl font-bold mb-4 text-center">Hier ist deine Wunschliste, {{ userName }}</h1>

    <!-- Wenn list.books existiert und nicht leer ist -->
    <div v-if="list?.books && list.books.length > 0" class="space-y-4">
      <!-- Iteriere über alle Bücher in der Wishlist -->
      <div
          v-for="book in list.books"
          :key="book.isbn"
          class="flex items-center  border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-#2E2D2DFF rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
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
          <p class="text-gray-700 dark:text-gray-300"><span class="font-medium">Autor:</span> {{ book.author }}</p>
          <p class="text-gray-700 dark:text-gray-300"><span class="font-medium">Genre:</span> {{ book.genre }}</p>
          <p class="text-gray-700 dark:text-gray-300 font-bold"><span class="font-bold">Preis:</span> {{ book.price }} €</p>
        </div>
        <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger ml-4"
            @click="deleteOneBookFromWishlist(book.isbn)"
            tooltip="Aus Wunschliste entfernen"
            tooltip-options="{position: 'top'}"
        />
        <Button
            icon="pi pi-shopping-cart"
            class="p-button-rounded p-button-warning ml-4"
            :disabled="book && book.quantity <= 0"
            @click="addToCart(book.isbn)"
            tooltip="Zum Warenkorb hinzufügen"
            tooltip-options="{position: 'top'}"
        />
      </div>
    </div>
    <!-- Wenn das books-Array leer ist oder gar nichts da ist -->
    <div v-else class="text-center text-gray-500">
      <p>Keine Bücher in der Wunschliste vorhanden.</p>
    </div>
  </div>

</template>