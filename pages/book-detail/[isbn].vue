<template>
  <Header />
  <navbanner />
  <pre>{{ list }}</pre>
  <!-- Hauptcontainer -->
  <div class="max-w-4xl mx-auto my-8 p-4 ">
    <div v-if="book" class="flex flex-col md:flex-row gap-6">

      <!-- Cover-Bild -->
      <div class="flex-shrink-0">
        <img
            v-if="book.imageUrlL"
            :src="book.imageUrlL"
            :alt="book.title"
            class="w-60 h-auto object-cover rounded"
        />
        <!-- Platzhalter-Bild, falls Cover nicht vorhanden -->
        <div
            v-else
            class="w-60 h-80 bg-gray-200 flex items-center justify-center rounded"
        >
          <span class="text-gray-600  dark:text-gray-100">Kein Cover</span>
        </div>
      </div>

      <!-- Buchinformationen -->
      <div class="flex flex-col justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {{ book.title || 'Titel nicht verfügbar' }}
          </h1>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1">
            <strong>Autor/in: </strong>
            {{ book.author || 'Autor/in unbekannt' }}
          </p>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1">
            <strong>Verlag: </strong>
            {{ book.publisher || 'Verlag unbekannt' }}
          </p>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1 mb-3">
            <strong>Preis: </strong>
            {{ book.price || 'Preis nicht verfügbar' }}
          </p>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1 mb-3">
            <strong>Genre: </strong>
            {{ book.genre || 'Kein Genre zugeordnet' }}
          </p>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1 mb-3">
            <strong>Bewertung: </strong>
            <template v-if="book.ratings">
              <span v-for="n in book.ratings" :key="n">&#9733;</span>
            </template>
            <span v-else>Noch keine Bewertungen vorhanden</span>
          </p>


          <!-- Beschreibung (falls vorhanden) -->
          <div class="mt-4">
            <h2 class="font-semibold dark:text-gray-100 text-gray-800">
              Beschreibung:
            </h2>
            <p class="text-gray-600 dark:text-gray-100 mt-2 leading-relaxed">
              {{
                book.shorttext ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sollicitudin porta nunc, quis pellentesque arcu laoreet id. Curabitur at felis aliquet, finibus tortor nec, facilisis lorem.'
              }}
            </p>
            <Toast />
            <Button class="dark:text-gray-100" @click="addToWishlist">Zur Wishlist hinzufügen</Button>

          </div>
        </div>
      </div>
    </div>

    <!-- Fallback, falls kein Buch geladen werden konnte -->
    <div v-else>
      <p class="text-blue-600">Keine Daten gefunden.</p>
    </div>
  </div>


</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import Header from "~/components/header.vue";
import { useStorage } from '@vueuse/core';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const userEmailStorage = useStorage('auth_email', '');

const userEmail = userEmailStorage.value;
const route = useRoute()
const isbn = route.params.isbn
const book = ref(null)
const list = ref(null)

// Beispielwert für eine Beschreibung, falls sie nicht vom Backend kommt:
const fallbackDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Pellentesque at luctus erat, nec facilisis dui. Fusce tristique tristique turpis, eget
faucibus odio convallis sed.`

onMounted(async () => {
  await fetchBook()
})

async function fetchBook() {
  try {
    const response = await fetch(`https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/book?isbn=${isbn}`)
    if (!response.ok) {
      throw new Error('Fehler beim Laden des Buches')
    }
    const data = await response.json()
    // Falls keine Beschreibung in der API, dann eigenen Fallback nutzen
    data.description = data.description || fallbackDescription
    book.value = data
  } catch (error) {
    console.error('Fehler:', error)
    book.value = null
  }
}


async function addToWishlist() {
  try {
    const response = await fetch(
        `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/wishlistitem?userEmail=${userEmailStorage.value}&isbn=${isbn}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
    )

    if (!response.ok) {
      throw new Error('Fehler beim Hinzufügen zur Wishlist')
    }

    // Falls du irgendeine Rückgabe verarbeiten willst:
    const data = await response.json()
    console.log('Wishlist-Response:', data)
  } catch (error) {
    console.error('Fehler:', error)
  }
  toast.add({
    severity: 'success',
    summary: 'Erfolg',
    detail: 'Das Buch wurde deiner Wunschliste hinzugefügt!',
    life: 3000 // 3 Sekunden sichtbar
  });
}

</script>


