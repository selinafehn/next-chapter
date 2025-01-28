<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Header from '~/components/header.vue';
import Navbanner from '~/components/navbanner.vue';
import { useRoute } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';

/**
 * Initialisiert die Route und Toast-Komponenten.
 */
const route = useRoute();
const toast = useToast();

/**
 * Speichert die E-Mail und den Benutzernamen des eingeloggten Nutzers aus dem lokalen Speicher.
 */
const userEmailStorage = useStorage('auth_email', '');
const userEmail = userEmailStorage.value;
const userNameStorage = useStorage('auth_username', '');
const userName = userNameStorage.value;

/**
 * Reaktive Referenzen für die Wunschliste und ein einzelnes Buch.
 */
const list = ref(null);
const book = ref(null);

/**
 * Lädt die Wunschliste, sobald die Komponente gemountet wird.
 */
onMounted(async () => {
  await fetchList();
});

/**
 * Funktion zum Abrufen der Wunschliste eines Nutzers.
 */
async function fetchList() {
  try {
    const response = await fetch(`https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/wishlist?userEmail=${userEmail}`);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Wunschliste');
    }
    const data = await response.json();
    list.value = data;
  } catch (error) {
    console.error('Fehler:', error);
    list.value = { books: [] }; // Setzt eine leere Liste bei einem Fehler
  }
}

/**
 * Funktion zum Hinzufügen eines Buches in den Warenkorb.
 * Entfernt das Buch gleichzeitig aus der Wunschliste.
 */
async function addToCart(isbn) {
  try {
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/cartitem?userEmail=${userEmail}&isbn=${isbn}&quantity=1`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
    );
    if (!response.ok) {
      throw new Error('Fehler beim Hinzufügen zum Warenkorb');
    }

    // Entfernt das Buch lokal aus der Wunschliste
    list.value.books = list.value.books.filter((book) => book.isbn !== isbn);

    // Zeigt eine Erfolgsmeldung an
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Buch wurde dem Warenkorb hinzugefügt', life: 3000 });
  } catch (error) {
    console.error('Fehler:', error);
  }

  // Entfernt das Buch aus der Wunschliste
  deleteOneBookFromWishlist(isbn);
}

/**
 * Funktion zum Entfernen eines Buches aus der Wunschliste.
 */
async function deleteOneBookFromWishlist(isbn) {
  try {
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/wishlistitem?userEmail=${userEmail}&isbn=${isbn}`,
        {
          method: 'DELETE',
        }
    );

    if (!response.ok) {
      throw new Error('Fehler beim Entfernen des Buches aus der Wunschliste');
    }

    // Entfernt das Buch lokal aus der Liste
    list.value.books = list.value.books.filter((book) => book.isbn !== isbn);

    // Zeigt eine Erfolgsmeldung an
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Buch aus der Wunschliste entfernt', life: 3000 });
  } catch (error) {
    console.error('Fehler:', error);

    // Zeigt eine Fehlermeldung an
    toast.add({ severity: 'error', summary: 'Fehler', detail: 'Buch konnte nicht entfernt werden', life: 3000 });
  }
}
</script>

<template>
  <!-- Header- und Navigationsleiste -->
  <Header />
  <Navbanner />

  <!-- Toast-Benachrichtigungen -->
  <Toast />

  <div class="container mx-auto p-4">
    <!-- Überschrift mit dem Benutzernamen -->
    <h1 class="text-2xl font-bold mb-4 text-center">Hier ist deine Wunschliste, {{ userName }}</h1>

    <!-- Liste der Bücher in der Wunschliste -->
    <div v-if="list?.books && list.books.length > 0" class="space-y-4">
      <!-- Einzelne Bücher -->
      <div
          v-for="book in list.books"
          :key="book.isbn"
          class="flex items-center border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-[#2E2D2D] rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
      >
        <!-- Buchcover -->
        <img
            :src="book.imageUrlL || book.imageUrlM || book.imageUrl"
            :alt="`Cover von ${book.title}`"
            class="w-32 h-48 object-cover rounded-md mr-4"
        />
        <!-- Buchdetails -->
        <div class="flex-1">
          <h2 class="text-lg font-semibold">{{ book.title }}</h2>
          <p class="text-gray-700 dark:text-gray-300"><span class="font-medium">Autor:</span> {{ book.author }}</p>
          <p class="text-gray-700 dark:text-gray-300"><span class="font-medium">Genre:</span> {{ book.genre }}</p>
          <p class="text-gray-700 dark:text-gray-300 font-bold"><span class="font-bold">Preis:</span> {{ book.price }} €</p>
        </div>
        <!-- Buttons für Aktionen -->
        <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger ml-4"
            @click="deleteOneBookFromWishlist(book.isbn)"
            tooltip="Aus Wunschliste entfernen"
        />
        <Button
            icon="pi pi-shopping-cart"
            class="p-button-rounded p-button-warning ml-4"
            :disabled="book && book.quantity <= 0"
            @click="addToCart(book.isbn)"
            tooltip="Zum Warenkorb hinzufügen"
        />
      </div>
    </div>

    <!-- Anzeige, wenn keine Bücher in der Wunschliste vorhanden sind -->
    <div v-else class="text-center text-gray-500">
      <p>Keine Bücher in der Wunschliste vorhanden.</p>
    </div>
  </div>
</template>
