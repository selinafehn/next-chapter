<script setup>
import { ref, onMounted } from 'vue'
import DataView from 'primevue/dataview'
import Button from 'primevue/button'
import Header from '~/components/header.vue'
import Navbanner from '~/components/navbanner.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
import { useStorage } from '@vueuse/core';
const userEmailStorage = useStorage('auth_email', '');
const userEmail = userEmailStorage.value;
const list = ref(null)

onMounted(async () => {
  await fetchList()
})
async function fetchList() {
  try {
    console.log("Fetch URL:", `...wishlist?userEmail=${userEmail}`)

    const response = await fetch(
        `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/wishlist?userEmail=${userEmail}`
    )
    console.log("Response-Status:", response.status)

    if (!response.ok) {
      throw new Error('Fehler beim Laden der Wishlist')
    }

    const data = await response.json()
    console.log("Response JSON:", data)

    list.value = data
  } catch (error) {
    console.error('Fehler:', error)
    list.value = null
  }
}

// Beispiele für Klick-Handler
function editBook(book) {
  console.log("Buch bearbeiten:", book)
}

function addToCart(book) {
  console.log("Buch in den Warenkorb:", book)
}

function removeBook(book) {
  console.log("Buch löschen:", book)
}

console.log("userEmail aus Route:", userEmail)
</script>

<template>
  <Header />
  <Navbanner />

  <div class="max-w-5xl mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-2">Meine Wishlist</h1>

    <!-- 1) Debug-Ausgabe, damit du siehst, ob list überhaupt gefüllt ist -->
    <pre>{{ list }}</pre>

    <!-- 2) DataView nur anzeigen, wenn list.books existiert und nicht leer ist -->
    <DataView
        v-if="list && list.books && list.books.length"
        :value="list.books"
        layout="grid"
        rows="9"
        :paginator="false"
        class="wishlist-dataview"
    >
      <!-- Custom Template für Grid-Darstellung -->
      <template #grid="slotProps">
        <div
            class="border border-gray-200 rounded p-4 flex flex-col items-center text-center gap-2"
        >
          <!-- Buch-Cover -->
          <img
              :src="slotProps.data.imageUrl"
              alt="Buch-Cover"
              class="w-24 h-36 object-cover"
          />

          <!-- Buch-Titel / Autor / Preis -->
          <h3 class="font-semibold text-lg">{{ slotProps.data.title }}</h3>
          <p class="text-sm text-gray-700">
            {{ slotProps.data.author }}
          </p>
          <p class="font-bold">
            {{ slotProps.data.price }} €
          </p>

          <!-- Beispiel-Button -->
          <Button
              class="px-3 py-1 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Vorbestellen
          </Button>

          <!-- Beispielaktionen (Bearbeiten, Warenkorb, Löschen) -->
          <div class="flex gap-3 mt-2">
            <Button
                title="Bearbeiten"
                class="text-gray-600 hover:text-blue-500"
                @click="() => editBook(slotProps.data)"
            >
              <i class="pi pi-pencil"></i>
            </Button>
            <Button
                title="In den Warenkorb"
                class="text-gray-600 hover:text-green-500"
                @click="() => addToCart(slotProps.data)"
            >
              <i class="pi pi-shopping-cart"></i>
            </Button>
            <Button
                title="Löschen"
                class="text-gray-600 hover:text-red-500"
                @click="() => removeBook(slotProps.data)"
            >
              <i class="pi pi-trash"></i>
            </Button>
          </div>
        </div>
      </template>
    </DataView>

    <!-- Fallback, wenn keine Bücher vorhanden -->
    <p v-else class="mt-4">Keine Bücher in der Wishlist gefunden.</p>
  </div>
</template>
