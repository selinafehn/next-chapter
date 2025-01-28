<script setup lang="ts">
import Header from '~/components/header.vue';
import Navbanner from '~/components/navbanner.vue';
import { useStorage } from '@vueuse/core';
import { onMounted, ref, computed } from 'vue';
import { useRoute } from '#vue-router';
import { useToast } from 'primevue/usetoast';

// PrimeVue-Komponenten
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import Toast from 'primevue/toast';

/**
 * Initialisiert Router, Toast-Komponente und gespeicherte Benutzerdaten.
 */
const toast = useToast();
const route = useRoute();
const userEmailStorage = useStorage('auth_email', '');
const userNameStorage = useStorage('auth_username', '');
const userEmail = userEmailStorage.value;
const userName = userNameStorage.value;

/**
 * Reaktive Zustände:
 * - `cart`: Speichert den Warenkorb.
 * - `showPaymentDialog`: Steuert die Sichtbarkeit des Bestell-Dialogs.
 * - `selectedPaymentMethod`: Speichert die gewählte Zahlungsart.
 */
const cart = ref<any>(null);
const showPaymentDialog = ref(false);
const selectedPaymentMethod = ref('PayPal');

/**
 * Berechnet den Gesamtbetrag des Warenkorbs.
 */
const totalPrice = computed(() => cart.value?.total_amount || 0);

/**
 * Lädt den Warenkorb des Benutzers, wenn die Komponente gemountet wird.
 */
onMounted(async () => {
  await fetchList();
});

/**
 * Ruft die Warenkorbdaten für den aktuellen Benutzer ab.
 */
async function fetchList() {
  try {
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/shoppingcart?userEmail=${userEmail}`
    );
    if (!response.ok) {
      throw new Error('Fehler beim Laden des Warenkorbs');
    }
    cart.value = await response.json();
  } catch (error) {
    console.error('Fehler beim Abrufen des Warenkorbs:', error);
  }
}

/**
 * Entfernt ein einzelnes Buch aus dem Warenkorb.
 * @param {string} isbn - Die ISBN des zu löschenden Buches.
 */
async function deleteOneBookFromCart(isbn: string) {
  try {
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/cartitem?userEmail=${userEmail}&isbn=${isbn}`,
        { method: 'DELETE' }
    );
    if (!response.ok) {
      throw new Error('Fehler beim Entfernen des Buches');
    }
    cart.value.books = cart.value.books.filter((book: any) => book.isbn !== isbn);
    toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Buch aus dem Warenkorb entfernt', life: 3000 });
  } catch (error) {
    console.error('Fehler beim Entfernen des Buches:', error);
    toast.add({ severity: 'error', summary: 'Fehler', detail: 'Buch konnte nicht entfernt werden', life: 3000 });
  }
}

/**
 * Führt den Bestellvorgang aus und leert den Warenkorb.
 */
async function checkoutBooks() {
  try {
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/order?userEmail=${userEmail}`,
        { method: 'POST' }
    );
    if (!response.ok) {
      throw new Error('Fehler beim Bestellvorgang');
    }
    cart.value.books = [];
    toast.add({ severity: 'success', summary: 'Erfolg', detail: 'Bestellung erfolgreich', life: 3000 });
  } catch (error) {
    console.error('Fehler beim Bestellvorgang:', error);
    toast.add({ severity: 'error', summary: 'Fehler', detail: 'Bestellung fehlgeschlagen', life: 3000 });
  }
}

/**
 * Schließt den Zahlungsdialog.
 */
function closeDialog() {
  showPaymentDialog.value = false;
}

/**
 * Bestätigt die Zahlung und führt den Bestellvorgang aus.
 */
async function confirmPayment() {
  try {
    await checkoutBooks();
    closeDialog();
  } catch (error) {
    console.error('Fehler bei der Zahlung:', error);
  }
}
</script>

<template>
  <Header />
  <Navbanner />
  <Toast />

  <div class="container mx-auto p-4">
    <!-- Warenkorb-Überschrift -->
    <h1 class="text-2xl font-bold mb-4 text-center">Hier ist dein Warenkorb, {{ userName }}</h1>

    <!-- Warenkorbanzeige -->
    <div v-if="cart?.books && cart.books.length > 0" class="space-y-4">
      <!-- Einzelne Bücher -->
      <div
          v-for="book in cart.books"
          :key="book.isbn"
          class="flex items-center rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-[#2E2D2D]"
      >
        <img :src="book.imageUrlL || book.imageUrlM || book.imageUrl" :alt="`Cover von ${book.title}`" class="w-32 h-48 object-cover rounded-md mr-4" />
        <div class="flex-1">
          <h2 class="text-lg font-semibold">{{ book.title }}</h2>
          <p class="text-gray-700 dark:text-gray-300"><span class="font-medium">Autor:</span> {{ book.author }}</p>
          <p class="text-gray-700 dark:text-gray-300"><span class="font-medium">Genre:</span> {{ book.genre }}</p>
          <p class="text-gray-700 dark:text-gray-300 font-bold"><span class="font-bold">Preis:</span> {{ book.price }} €</p>
          <p class="text-gray-700 dark:text-gray-300 font-bold"><span class="font-bold">Menge:</span> {{ book.quantity }}</p>
        </div>
        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger ml-4" @click="deleteOneBookFromCart(book.isbn)" />
      </div>

      <!-- Gesamtsumme -->
      <h2 class="text-xl font-semibold mt-4">Gesamtsumme: {{ totalPrice }} €</h2>
      <Button @click="showPaymentDialog = true" class="mt-4" label="Hier bestellen" />
    </div>

    <!-- Leerer Warenkorb -->
    <div v-else class="text-center text-gray-500">
      <p>Keine Bücher im Warenkorb vorhanden.</p>
    </div>
  </div>

  <!-- Checkout-Dialog -->
  <Dialog v-model:visible="showPaymentDialog" modal :showHeader="false" @hide="closeDialog" style="width: 600px">
    <div class="p-4 space-y-6">
      <div>
        <h3 class="font-bold text-lg">Gesamtbetrag:</h3>
        <p class="text-gray-700">{{ totalPrice }} €</p>
      </div>
      <div>
        <h4 class="font-semibold mb-2">Zahlungsart</h4>
        <RadioButton inputId="paypal" value="PayPal" v-model="selectedPaymentMethod" />
        <label for="paypal" class="ml-2">PayPal</label>
      </div>
      <div class="flex justify-end gap-2 mt-2">
        <Button label="Abbrechen" @click="closeDialog" />
        <Button label="Kaufen" class="p-button-success" @click="confirmPayment" />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
/* Optionales Styling */
</style>
