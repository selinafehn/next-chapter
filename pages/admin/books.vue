<script setup lang="ts">
import Header from "~/components/header.vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";
import { useToast } from "primevue/usetoast";

/**
 * PrimeVue Toast-Komponente für Benachrichtigungen.
 */
const toast = useToast();

/**
 * Reaktive Variablen für Buchdetails.
 */
const isbn = ref(""); // ISBN des Buches
const deleteIsbn = ref(""); // ISBN des Buches, das gelöscht werden soll
const title = ref(""); // Titel des Buches
const author = ref(""); // Autor des Buches
const publication = ref(""); // Erscheinungsjahr des Buches
const publisher = ref(""); // Verlag des Buches
const price = ref(""); // Preis des Buches
const quantity = ref(""); // Menge des Buches
const imageUrl = ref(""); // Bild-URL des Buches
const shorttext = ref(""); // Beschreibung des Buches
const genre = ref(""); // Genre des Buches

/**
 * Benutzerinformationen aus dem LocalStorage.
 */
const userEmailStorage = useStorage("auth_email", "");
const userEmail = userEmailStorage.value;
const token = useStorage("auth_token", "");

/**
 * Router für Navigation in der App.
 */
const router = useRouter();

/**
 * Reaktive Variablen für Erfolg- und Fehlermeldungen.
 */
const errorMessage = ref("");
const successMessage = ref("");

/**
 * Menüelemente für die Navigationsleiste.
 */
const items = computed(() => [
  {
    label: "Home",
    icon: "pi pi-home",
    command: () => {
      router.push("/");
    },
  },
  {
    label: "Dashboard",
    icon: "pi pi-home",
    command: () => {
      router.push("/admin/dashboard");
    },
  },
  {
    label: "Bücher",
    icon: "pi pi-book",
    command: () => {
      router.push("/admin/books");
    },
  },
]);

/**
 * Fügt ein neues Buch hinzu, basierend auf den eingegebenen Details.
 */
async function addOneBook() {
  try {
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/book?token=${token.value}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isbn: isbn.value,
            title: title.value,
            author: author.value,
            publication: publication.value,
            publisher: publisher.value,
            price: price.value,
            quantity: quantity.value,
            imageUrl: imageUrl.value,
            imageUrlM: imageUrl.value,
            imageUrlL: imageUrl.value,
            genre: genre.value,
            shorttext: shorttext.value,
            ratings: 3.5,
            userEmail: userEmail,
          }),
        }
    );
    if (!response.ok) throw new Error("Hinzufügen fehlgeschlagen");

    const responseMessage = await response.json();

    successMessage.value = "Hinzufügen erfolgreich!";
    toast.add({
      severity: "success",
      summary: "Erfolg",
      detail: `Hinzufügen erfolgreich! ${responseMessage}`,
      life: 3000,
    });
  } catch (err: any) {
    errorMessage.value = err.message || "Ein unerwarteter Fehler ist aufgetreten.";
    toast.add({
      severity: "error",
      summary: "Fehler",
      detail: `Fehler beim Hinzufügen: ${errorMessage.value}`,
      life: 3000,
    });
  }
}

/**
 * Löscht ein Buch anhand der eingegebenen ISBN.
 */
async function deleteBookByISBN() {
  try {
    const deleteUrl = `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/book/delete?token=${token.value}&isbn=${deleteIsbn.value}`;
    const response = await fetch(deleteUrl, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Löschen fehlgeschlagen");
    }
    toast.add({
      severity: "success",
      summary: "Erfolg",
      detail: "Buch wurde gelöscht!",
      life: 3000,
    });
  } catch (err: any) {
    errorMessage.value = err.message || "Fehler beim Löschen.";
    toast.add({
      severity: "error",
      summary: "Fehler",
      detail: `Buch konnte nicht gelöscht werden! ${errorMessage.value}`,
      life: 3000,
    });
  }
}
</script>

<template>
  <Header />
  <MenuBar :model="items" class="text-gray-800" />

  <!-- Zwei Spalten nebeneinander -->
  <div class="grid">
    <!-- Linke Spalte: Buch hinzufügen -->
    <div class="col-6">
      <Panel class="flex flex-col items-center p-4 text-xl">
        <div class="card">
          <h2>Neues Buch anlegen</h2>
          <form class="p-fluid grid" @submit.prevent="addOneBook">
            <!-- Formularfelder für Buchdetails -->
            <div v-for="(field, index) in [
                  { id: 'isbn', label: 'ISBN', model: isbn, placeholder: '1234567890' },
                  { id: 'title', label: 'Titel', model: title, placeholder: 'Buchtitel' },
                  { id: 'author', label: 'Autor', model: author, placeholder: 'Autor' },
                  { id: 'publication', label: 'Erscheinungsjahr', model: publication, placeholder: '2023' },
                  { id: 'publisher', label: 'Verlag', model: publisher, placeholder: 'Verlag XYZ' },
                  { id: 'price', label: 'Preis', model: price, placeholder: '19.99' },
                  { id: 'quantity', label: 'Menge', model: quantity, placeholder: '5' },
                  { id: 'imageUrl', label: 'Bild-URL', model: imageUrl, placeholder: 'http://...' },
                  { id: 'genre', label: 'Genre', model: genre, placeholder: 'Romance' },
                  { id: 'shorttext', label: 'Shorttext', model: shorttext, placeholder: 'Lorem Ipsum ...' },
                ]"
                 :key="index"
                 class="field col-12 mb-2"
            >
              <label :for="field.id">{{ field.label }}</label>
              <InputText :id="field.id" v-model="field.model" :placeholder="field.placeholder" />
            </div>
            <!-- Hinzufügen-Button -->
            <div class="col-12">
              <Button label="Hinzufügen" class="p-button-success mt-3" type="submit" />
            </div>
          </form>
        </div>
      </Panel>
    </div>

    <!-- Rechte Spalte: Buch löschen -->
    <div class="col-6">
      <Panel class="flex flex-col items-center p-4 text-xl">
        <div class="card">
          <h2>Buch über ISBN löschen</h2>
          <form class="p-fluid grid" @submit.prevent="deleteBookByISBN">
            <!-- ISBN zum Löschen -->
            <div class="field col-12 mb-2">
              <label for="deleteIsbn">ISBN</label>
              <InputText id="deleteIsbn" v-model="deleteIsbn" placeholder="ISBN eingeben..." />
            </div>
            <!-- Lösch-Button -->
            <div class="col-12">
              <Button label="Löschen" class="p-button-danger mt-3" type="submit" />
            </div>
          </form>
        </div>
      </Panel>
    </div>
  </div>
</template>