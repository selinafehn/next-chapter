<script setup lang="ts">
import Header from '~/components/header.vue'
import Navbanner from '~/components/navbanner.vue'
import { useStorage } from "@vueuse/core";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "#vue-router";
import { useToast } from 'primevue/usetoast';

// PrimeVue-Komponenten (falls du sie nicht global registrierst)
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import RadioButton from 'primevue/radiobutton'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast'

const toast = useToast();
const route = useRoute();

// Hier die LocalStorages, in denen wir Userdaten haben (z.B. Name, Email)
const userEmailStorage = useStorage('auth_email', '');
const userNameStorage = useStorage('auth_username', '');

// Diese Daten vom eingeloggten User können aus deiner Login-Komponente stammen.
// Hier nur als Beispiel: Man könnte stattdessen beim onMounted() die Userdaten per Fetch holen
// und ins Checkout-Formular einfügen.
const userEmail = userEmailStorage.value;
const userName = userNameStorage.value;

// Wir holen uns zur Sicherheit die Route-Parameter, falls wir sie brauchen
const isbn = route.params.isbn;

// Warenkorb
const cart = ref<any>(null);

// Dialog-Status (öffnet/schließt das Checkout-Popup)
const showPaymentDialog = ref(false);

// Radio-Button: Gewählte Zahlungsart
const selectedPaymentMethod = ref('PayPal');


// Beim Laden der Seite: Warenkorb abrufen & Adresse vorbefüllen
onMounted(async () => {
  await fetchList();
});

// Gesamtsumme als Computed oder direkt aus cart.value?.total_amount
const totalPrice = computed(() => cart.value?.total_amount || 0);

/* -------------------------------------------
   1) Warenkorb abrufen
------------------------------------------- */
async function fetchList() {
  try {
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/shoppingcart?userEmail=${userEmail}`
    );
    if (!response.ok) {
      throw new Error('Fehler beim Laden des Warenkorbs');
    }
    const data = await response.json();
    cart.value = data;
  } catch (error) {
    console.error('Fehler:', error);
  }
}

/* -------------------------------------------
   2) Einzelnes Buch aus dem Warenkorb löschen
------------------------------------------- */
async function deleteOneBookFromCart(isbn: string) {
  try {
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/cartitem?userEmail=${userEmail}&isbn=${isbn}`,
        { method: 'DELETE' }
    );
    if (!response.ok) {
      throw new Error('Fehler beim Entfernen des Buches aus dem Warenkorb');
    }

    // Buch lokal entfernen (ohne Reload)
    cart.value.books = cart.value.books.filter((book: any) => book.isbn !== isbn);

    toast.add({
      severity: 'success',
      summary: 'Erfolgreich',
      detail: 'Buch aus dem Warenkorb entfernt',
      life: 3000,
    });
  } catch (error) {
    console.error('Fehler:', error);
    toast.add({
      severity: 'error',
      summary: 'Fehler',
      detail: 'Buch konnte nicht entfernt werden',
      life: 3000,
    });
  }
}

/* -------------------------------------------
   3) Checkout: Bestellung ausführen
------------------------------------------- */
async function checkoutBooks() {
  try {
    // Hier würdest du ggf. zusätzlich die Zahlungsdaten / Addressdaten mitschicken,
    // wenn dein Backend das erwartet.
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/order?userEmail=${userEmail}`,
        { method: 'POST' }
    );
    if (!response.ok) {
      throw new Error('Fehler beim Bestellvorgang');
    }
    // Warenkorb leeren
    cart.value.books = [];

    toast.add({
      severity: 'success',
      summary: 'Erfolg',
      detail: 'Bestellung erfolgreich',
      life: 3000,
    });
  } catch (error) {
    console.error('Fehler:', error);
    toast.add({
      severity: 'error',
      summary: 'Fehler',
      detail: 'Bestellung fehlgeschlagen',
      life: 3000,
    });
  }
}

/* -------------------------------------------
   4) Dialog-Logik:
      - showPaymentDialog öffnen/schließen
      - confirmPayment() wird aufgerufen,
        wenn der User im Dialog "Kaufen" klickt.
------------------------------------------- */
function closeDialog() {
  showPaymentDialog.value = false;
}

// Dies wird aufgerufen, wenn der User im Dialog
// auf "Kaufen" klickt und AGB + Datenschutz angehakt sind.
async function confirmPayment() {
  // Beispiel: Hier könntest du zusätzliche Validierungen vornehmen,
  // z.B. ob Adresse korrekt ist, ob Kreditkartendaten valide sind etc.
  // Falls alles gut -> checkoutBooks()
  try {
    await checkoutBooks();

    showPaymentDialog.value = false;
  } catch (error) {
    console.error(error);
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

    <!-- Wenn cart.books existiert und nicht leer ist -->
    <div v-if="cart?.books && cart.books.length > 0" class="space-y-4">
      <!-- Iteration über alle Bücher im Warenkorb -->
      <div
          v-for="book in cart.books"
          :key="book.isbn"
          class="flex items-center rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-#2E2D2DFF"
      >
        <img
            :src="book.imageUrlL || book.imageUrlM || book.imageUrl"
            :alt="`Cover von ${book.title}`"
            class="w-32 h-48 object-cover rounded-md mr-4"
        />
        <div class="flex-1">
          <h2 class="text-lg font-semibold">{{ book.title }}</h2>
          <p class="text-gray-700 dark:text-gray-300"><span class="font-medium">Autor:</span> {{ book.author }}</p>
          <p class="text-gray-700 dark:text-gray-300"><span class="font-medium">Genre:</span> {{ book.genre }}</p>
          <p class="text-gray-700 dark:text-gray-300 font-bold"><span class="font-bold">Preis:</span> {{ book.price }} €</p>
          <p class="text-gray-700 dark:text-gray-300 font-bold"><span class="font-bold">Menge:</span> {{ book.quantity }}</p>
        </div>
        <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger ml-4"
            @click="deleteOneBookFromCart(book.isbn)"
            tooltip="Buch aus Warenkorb entfernen"
            tooltip-options="{ position: 'top' }"
        />
      </div>

      <!-- Gesamter Preis -->
      <h2 class="text-xl font-semibold mt-4">Gesamter Preis: {{ cart.total_amount }} €</h2>

      <!-- Button, um den Dialog zu öffnen -->
      <Button @click="showPaymentDialog = true" class="mt-4" label="Hier bestellen" />
    </div>

    <!-- Falls keine Bücher im Warenkorb sind -->
    <div v-else class="text-center text-gray-500">
      <p>Keine Bücher im Warenkorb vorhanden.</p>
    </div>
  </div>

  <!-- Checkout-Dialog -->
  <Dialog
      :visible="showPaymentDialog"
      modal
      :showHeader="false"
      header="Bestellung abschließen"
      @hide="closeDialog"
      style="width: 600px"
  >
    <div class="p-4 space-y-6">
      <!-- Gesamtbetrag -->
      <div>
        <h3 class="font-bold text-lg">Gesamtbetrag:</h3>
        <p class="text-gray-700">{{ cart?.total_amount }} €</p>
      </div>

      <!-- Zahlungsart auswählen -->
      <div>
        <h4 class="font-semibold mb-2">Zahlungsart</h4>
        <div class="flex flex-col gap-2 ml-1">
          <div>
            <RadioButton
                inputId="paypal"
                name="paymentMethod"
                value="PayPal"
                v-model="selectedPaymentMethod"
            />
            <label for="paypal" class="ml-2 cursor-pointer">PayPal</label>
          </div>
          <div>
            <RadioButton
                inputId="rechnung"
                name="paymentMethod"
                value="Rechnung"
                v-model="selectedPaymentMethod"
            />
            <label for="rechnung" class="ml-2 cursor-pointer">Rechnung an meine hinterlegte Adresse Senden</label>
          </div>
        </div>
      </div>

      <!-- Buttons: Abbrechen oder Kaufen -->
      <div class="flex justify-end gap-2 mt-2">
        <Button
            label="Abbrechen"
            class="p-button-text"
            @click="closeDialog"
        />
        <Button
            label="Kaufen"
            class="p-button-success"
            @click="confirmPayment"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
/* Optionale Styles */
</style>