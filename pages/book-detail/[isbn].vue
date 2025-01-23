<template>
  <Header />
  <navbanner />
  <!-- Hauptcontainer -->
  <div class="max-w-7xl mx-auto my-8 p-4  ">
    <div v-if="book" class="flex flex-col md:flex-row gap-6 ">

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
            class="w-60 h-80 bg-gray-200  flex items-center justify-center rounded"
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
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1">
            <strong>Menge vorhanden: </strong>
            {{ book.quantity || 'Nichts vorrätig' }}
          </p>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1 mb-3">
            <strong>Preis: </strong>
            {{ book.price + ' EURO' || 'Preis nicht verfügbar' }}
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
            <Button class="dark:text-gray-100" @click="addToWishlist(isbn)">Zur Wunschliste hinzufügen</Button>
            <p></p>
            <Button
                class="dark:text-gray-100"
                :disabled="book && book.quantity <= 0"
                @click="addToCart(book.isbn)"
            >
              Zum Warenkorb hinzufügen
            </Button>

          </div>
        </div>
      </div>
    </div>

    <!-- Fallback, falls kein Buch geladen werden konnte -->
    <div v-else>
      <p class="text-blue-600">Keine Daten gefunden.</p>
    </div>
    <div v-if="recommendations.length" class="mt-8">
      <h2 class="text-xl font-bold mb-4">Folgende Bücher würden wir dir anhand deines Ausgewählten Buches empfehlen:</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <div
            v-for="(rec, index) in recommendations"
            :key="rec.isbn"
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#2E2D2D]"
        >
          <!-- Bild -->
          <img
              :src="rec.imageurll || '/default-img.png'"
              :alt="rec.title"
              class="h-60 w-auto object-cover rounded mb-4"
          />

          <!-- Titel -->
          <div class="text-lg font-semibold text-gray-800 dark:text-gray-300">
            {{ rec.title }}
          </div>

          <!-- Autor -->
          <div class="text-sm text-gray-600 dark:text-gray-300">
            von {{ rec.author }}
          </div>

          <!-- Genre -->
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Genre: {{ rec.genre }}
          </div>

          <!-- Preis -->
          <div class="text-md font-semibold text-gray-800 dark:text-gray-100 mt-2">
            {{ rec.price }} €
          </div>

          <!-- Kurzer Beschreibungstext -->
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ rec.shorttext }}
          </p>

          <NuxtLink
              :to="`/book-detail/${rec.isbn}`"
              class="inline-block mt-4 text-blue-500 hover:text-blue-700"
          >
            Mehr Details
          </NuxtLink>
        </div>
      </div>
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
const userTokenStorage = useStorage('auth_token', '');
const userEmail = userEmailStorage.value;
const route = useRoute()
const isbn = route.params.isbn
const book = ref(null)
const recommendations = ref ([])
const list = ref(null)

onMounted(async () => {
  await fetchBook();
  const isbn = route.params.isbn // oder wie du an die ISBN kommst
  if (isbn) {
    getRecommendations(String(isbn))
  }
})

async function fetchBook() {
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

    getRecommendations(isbn)
    console.log(recommendations)

}

async function addToWishlist(isbn) {
  const userEmail = userEmailStorage.value;
  const token = userTokenStorage.value;
  // Überprüfen, ob ein Token im localStorage vorhanden ist
  if (!token) {
    toast.add({
      severity: 'error',
      summary: 'Fehler',
      detail: 'User ist nicht authentifiziert. Bitte zuerst anmelden.',
      life: 3000
    });
    return; // Funktion beenden, wenn kein Token vorhanden ist
  }

  try {
    const response = await fetch(
        `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/wishlistitem?userEmail=${userEmail}&isbn=${isbn}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Token im Header senden
          }
        }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fehler beim Hinzufügen zur Wunschliste');
    }

    // Erfolgsmeldung anzeigen
    toast.add({
      severity: 'success',
      summary: 'Erfolgreich',
      detail: 'Buch wurde der Wunschliste hinzugefügt',
      life: 3000
    });

  } catch (error) {
    // Fehlerbehandlung mit detaillierter Nachricht
    toast.add({
      severity: 'error',
      summary: 'Fehler',
      detail: error.message || 'Buch konnte nicht der Wunschliste hinzugefügt werden',
      life: 3000
    });
  }
}

async function addToCart(isbn) {
  const userEmail = userEmailStorage.value;
  const token = userTokenStorage.value;
  if (!token) {
    toast.add({
      severity: 'error',
      summary: 'Fehler',
      detail: 'User ist nicht authentifiziert. Bitte zuerst anmelden.',
      life: 3000
    });
    return; // Funktion beenden, wenn kein Token vorhanden ist
  }
  try {
    const response = await fetch(
        `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/cartitem?userEmail=${userEmail}&isbn=${isbn}&quantity=1`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
    if (!response.ok) {
      throw new Error('Fehler beim Hinzufügen zum Warenkorb')
    }
    // Erfolgsmeldung anzeigen
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Buch wurde dem Warenkorb hinzugefügt', life: 3000 })
    // Falls du irgendeine Rückgabe verarbeiten willst:
  } catch (error) {
  console.log(error + response);
  }
}

async function getRecommendations(isbn) {
  try {
    const response = await fetch(
        `https://immense-bastion-48713-34053a42d791.herokuapp.com/recommend_books?isbn=${isbn}`
    );
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Empfehlungen');
    }
    const data = await response.json();

    // Wenn der Server kein "recommendations" liefert, nutze ein leeres Array als Fallback:
    recommendations.value = data.recommendations || [];
  } catch (error) {
    console.error('Fehler:', error);
    // Anstelle von "null" => setze ein leeres Array:
    recommendations.value = [];
  }
}


</script>


