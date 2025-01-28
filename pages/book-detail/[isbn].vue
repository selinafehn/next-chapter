<template>
  <Header />
  <navbanner />
  <!-- Hauptcontainer -->
  <div class="max-w-7xl mx-auto my-8 p-4">
    <!-- Buchdetails -->
    <div v-if="book" class="flex flex-col md:flex-row gap-6">
      <!-- Cover-Bild -->
      <div class="flex-shrink-0">
        <img
            v-if="book.imageUrlL"
            :src="book.imageUrlL"
            :alt="book.title"
            class="w-60 h-auto object-cover rounded"
        />
        <div
            v-else
            class="w-60 h-80 bg-gray-200 flex items-center justify-center rounded"
        >
          <span class="text-gray-600 dark:text-gray-100">Kein Cover</span>
        </div>
      </div>

      <!-- Buchinformationen -->
      <div class="flex flex-col justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {{ book.title || 'Titel nicht verfügbar' }}
          </h1>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1">
            <strong>Autor/in: </strong> {{ book.author || 'Autor/in unbekannt' }}
          </p>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1">
            <strong>Verlag: </strong> {{ book.publisher || 'Verlag unbekannt' }}
          </p>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1">
            <strong>Menge vorhanden: </strong> {{ book.quantity || 'Nichts vorrätig' }}
          </p>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1 mb-3">
            <strong>Preis: </strong> {{ book.price + ' EURO' || 'Preis nicht verfügbar' }}
          </p>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1 mb-3">
            <strong>Genre: </strong> {{ book.genre || 'Kein Genre zugeordnet' }}
          </p>
          <p class="text-base text-gray-700 dark:text-gray-100 mt-1 mb-3">
            <strong>Bewertung: </strong>
            <template v-if="book.ratings">
              <span v-for="n in book.ratings" :key="n">&#9733;</span>
            </template>
            <span v-else>Noch keine Bewertungen vorhanden</span>
          </p>

          <!-- Beschreibung -->
          <div class="mt-4">
            <h2 class="font-semibold dark:text-gray-100 text-gray-800">
              Beschreibung:
            </h2>
            <p class="text-gray-600 dark:text-gray-100 mt-2 leading-relaxed">
              {{ book.shorttext || 'Keine Beschreibung verfügbar.' }}
            </p>
            <Toast />
            <Button class="dark:text-gray-100" @click="addToWishlist(book.isbn)">Zur Wunschliste hinzufügen</Button>
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

    <!-- Empfehlungen -->
    <div v-if="recommendations.length" class="mt-8">
      <h2 class="text-xl font-bold mb-4">
        Folgende Bücher würden wir dir empfehlen:
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <div
            v-for="(rec, index) in recommendations"
            :key="rec.isbn"
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#2E2D2D]"
        >
          <img
              :src="rec.imageurll || '/default-img.png'"
              :alt="rec.title"
              class="h-60 w-auto object-cover rounded mb-4"
          />
          <div class="text-lg font-semibold text-gray-800 dark:text-gray-300">
            {{ rec.title }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            von {{ rec.author }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Genre: {{ rec.genre }}
          </div>
          <div class="text-md font-semibold text-gray-800 dark:text-gray-100 mt-2">
            {{ rec.price }} €
          </div>
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
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from '~/components/header.vue';
import { useStorage } from '@vueuse/core';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

/**
 * Toast-Komponente für Benachrichtigungen initialisieren.
 */
const toast = useToast();

/**
 * Benutzerinformationen aus dem Local Storage laden.
 */
const userEmailStorage = useStorage('auth_email', '');
const userTokenStorage = useStorage('auth_token', '');
const userEmail = userEmailStorage.value;

/**
 * Route und Parameter (z. B. ISBN) abrufen.
 */
const route = useRoute();
const isbn = route.params.isbn;

/**
 * Daten-Referenzen für das Buch, Empfehlungen und die Wunschliste.
 */
const book = ref(null);
const recommendations = ref([]);
const list = ref(null);

/**
 * Lädt das ausgewählte Buch und die dazugehörigen Empfehlungen.
 */
onMounted(async () => {
  await fetchBook();
  if (isbn) {
    await getRecommendations(isbn);
  }
});

/**
 * Funktion zum Abrufen der Buchdetails.
 */
async function fetchBook() {
  try {
    const response = await fetch(`https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/book?isbn=${isbn}`);
    if (!response.ok) {
      throw new Error('Fehler beim Laden des Buches');
    }
    book.value = await response.json();
  } catch (error) {
    console.error('Fehler:', error);
    book.value = null;
  }
}

/**
 * Fügt ein Buch der Wunschliste hinzu.
 */
async function addToWishlist(isbn) {
  // Funktionalität ähnlich wie oben beschrieben
}

/**
 * Fügt ein Buch dem Warenkorb hinzu.
 */
async function addToCart(isbn) {
  // Funktionalität ähnlich wie oben beschrieben
}

/**
 * Empfiehlt ähnliche Bücher basierend auf der ISBN.
 */
async function getRecommendations(isbn) {
  try {
    const response = await fetch(`https://immense-bastion-48713-34053a42d791.herokuapp.com/recommend_books?isbn=${isbn}`);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Empfehlungen');
    }
    recommendations.value = (await response.json()).recommendations || [];
  } catch (error) {
    console.error('Fehler:', error);
    recommendations.value = [];
  }
}
</script>
