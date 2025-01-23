<script setup lang="ts">
import Header from '~/components/header.vue'
import Navbanner from '~/components/navbanner.vue'
import {useStorage} from "@vueuse/core";
import {onMounted, ref} from "vue";
import {useRoute} from "#vue-router";

const userEmailStorage = useStorage('auth_email', '');
const userNameStorage = useStorage('auth_username', '');
const route = useRoute()
const isbn = route.params.isbn
const toast = useToast()
const userEmail = userEmailStorage.value;
const userName = userNameStorage.value;

onMounted(async () => {
  await fetchList()
})

const cart = ref(null)

async function fetchList () {
  try {
    const response = await fetch(`https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/shoppingcart?userEmail=${userEmail}`)
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Wishlist')
    }
    const data = await response.json()
    cart.value = data
  } catch (error) {
    console.error('Fehler:', error)
  }
}

async function deleteOneBookFromCart(isbn) {
  try {
    const response = await fetch(`https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/cartitem?userEmail=${userEmail}&isbn=${isbn}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Fehler beim Entfernen des Buches aus der Wishlist')
    }
    // Buch lokal aus der Liste entfernen (kein Reload notwendig)
    cart.value.books = cart.value.books.filter(book => book.isbn !== isbn)

    // Erfolgsmeldung anzeigen
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Buch aus der Wunschliste entfernt', life: 3000 })
  } catch (error) {
    console.error('Fehler:', error)
    // Fehlerbenachrichtigung anzeigen
    toast.add({ severity: 'error', summary: 'Fehler', detail: 'Buch konnte nicht entfernt werden', life: 3000 })
  }
}

async function checkoutBooks(){
  try {
  const response = await fetch(`https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/order?userEmail=${userEmail}`, {
    method: 'POST'
  })
    if (!response.ok) {
      throw new Error('Fehler beim Bestellvorgang')
    }
    cart.value.books = [];
    // Erfolgsmeldung anzeigen
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Bestellung erfolgreich', life: 3000 })
  } catch (error) {
    console.error('Fehler:', error)
    // Fehlerbenachrichtigung anzeigen
    toast.add({ severity: 'error', summary: 'Fehler', detail: 'Bestellung fehlgeschlagen', life: 3000 })
  }
}

</script>

<template>
  <Header />
  <Navbanner />

  <Toast /> <!-- PrimeVue Toast-Komponente für Benachrichtigungen -->

  <div class="container mx-auto p-4">
    <!-- Header -->
    <h1 class="text-2xl font-bold mb-4 text-center">Hier ist dein Warenkorb, {{ userName }}</h1>

      <!-- Wenn list.books existiert und nicht leer ist -->
    <div v-if="cart?.books && cart.books.length > 0" class="space-y-4">
      <!-- Iteriere über alle Bücher in der Wishlist -->
      <div
          v-for="book in cart.books"
          :key="book.isbn"
          class="flex items-center rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-#2E2D2DFF"
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
          <p class="text-gray-700 dark:text-gray-300 font-bold"><span class="font-bold">Menge im Warenkorb:</span> {{ book.quantity }}</p>
        </div>
        <!-- Löschen-Symbol -->
        <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger ml-4"
            @click="deleteOneBookFromCart(book.isbn)"
            tooltip="Aus Wunschliste entfernen"
            tooltip-options="{position: 'top'}"
        ></Button>
      </div>
      <h2 class="text-xl font-semibold"> Gesamter Preis: {{ cart.total_amount }} €</h2>
      <Button @click="checkoutBooks()" > Hier bestellen </Button>
    </div>
    <!-- Wenn das books-Array leer ist oder gar nichts da ist -->
    <div v-else class="text-center text-gray-500">
      <p>Keine Bücher im Warenkorb vorhanden.</p>
    </div>
  </div>
</template>

<style scoped>
</style>