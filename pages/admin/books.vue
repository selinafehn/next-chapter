<script setup lang="ts">
import Header from "~/components/header.vue";
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from "@vueuse/core";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const toast = useToast();

// Variablen für Add und Delete
const isbn = ref('');
const deleteIsbn = ref(''); // Zum Löschen

const title = ref('');
const author = ref('');
const publication = ref('');
const publisher = ref('');
const price = ref('');
const quantity = ref('');
const imageUrl = ref('');
const shorttext = ref('');
const genre = ref('');

const userEmailStorage = useStorage('auth_email', '');
const userEmail = userEmailStorage.value;
const token = useStorage("auth_token", "");
const router = useRouter();
const errorMessage = ref("");
const successMessage = ref("");

const items = computed(() => [
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push('/')
    }
  },{
    label: 'Dashboard',
    icon: 'pi pi-home',
    command: () => {
      router.push('/admin/dashboard')
    }
  },{
    label: 'Bücher',
    icon: 'pi pi-book',
    command: () => {
      router.push('/admin/books')
    }
  }]);

// Buch hinzufügen
async function addOneBook () {
  try {
    const response = await fetch(
        `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/book?token=${token.value}`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
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
      severity: 'success',
      summary: 'Erfolg',
      detail: 'Hinzufügen erfolgreich! ' + responseMessage,
      life: 3000
    });

  } catch (err: any) {
    errorMessage.value = err.message || "Ein unerwarteter Fehler ist aufgetreten.";
    toast.add({
      severity: 'error',
      summary: 'Fehler',
      detail: 'Fehler beim Hinzufügen: ' + errorMessage.value,
      life: 3000
    });
  }
}

// Buch löschen über ISBN (hier wird deleteIsbn.value genutzt)
async function deleteBookByISBN () {
  try {
    const deleteUrl = `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/book/delete?token=${token.value}&isbn=${deleteIsbn.value}`;
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Löschen fehlgeschlagen');
    }
    toast.add({
      severity: 'success',
      summary: 'Erfolg',
      detail: 'Buch wurde gelöscht!',
      life: 3000,
    });
  } catch (err: any) {
    errorMessage.value = err.message || 'Fehler beim Löschen.';
    toast.add({
      severity: 'error',
      summary: 'Fehler',
      detail: 'Buch konnte nicht gelöscht werden! ' + errorMessage.value,
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
            <!-- ISBN -->
            <div class="field col-12 mb-2">
              <label for="isbn">ISBN</label>
              <InputText id="isbn" v-model="isbn" placeholder="1234567890" />
            </div>
            <!-- Titel -->
            <div class="field col-12 mb-2">
              <label for="title">Titel</label>
              <InputText id="title" v-model="title" placeholder="Buchtitel" />
            </div>
            <!-- Autor -->
            <div class="field col-12 mb-2">
              <label for="author">Autor</label>
              <InputText id="author" v-model="author" placeholder="Autor" />
            </div>
            <!-- Erscheinungsjahr -->
            <div class="field col-12 mb-2">
              <label for="publication">Erscheinungsjahr</label>
              <InputText id="publication" v-model="publication" placeholder="2023" />
            </div>
            <!-- Verlag -->
            <div class="field col-12 mb-2">
              <label for="publisher">Verlag</label>
              <InputText id="publisher" v-model="publisher" placeholder="Verlag XYZ" />
            </div>
            <!-- Preis -->
            <div class="field col-12 mb-2">
              <label for="price">Preis</label>
              <InputText id="price" v-model="price" placeholder="19.99" />
            </div>
            <!-- Menge -->
            <div class="field col-12 mb-2">
              <label for="quantity">Menge</label>
              <InputText id="quantity" v-model="quantity" placeholder="5" />
            </div>
            <!-- Bild-URL -->
            <div class="field col-12 mb-2">
              <label for="imageUrl">Bild-URL</label>
              <InputText id="imageUrl" v-model="imageUrl" placeholder="http://..." />
            </div>
            <!-- Genre -->
            <div class="field col-12 mb-2">
              <label for="genre">Genre</label>
              <InputText id="genre" v-model="genre" placeholder="Romance" />
            </div>
            <!-- Shorttext -->
            <div class="field col-12 mb-2">
              <label for="shorttext">Shorttext</label>
              <InputText id="shorttext" v-model="shorttext" placeholder="Lorem Ipsum ..." />
            </div>

            <!-- Submit-Button -->
            <div class="col-12">
              <Button
                  label="Hinzufügen"
                  class="p-button-success mt-3"
                  type="submit"
              />
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
              <Button
                  label="Löschen"
                  class="p-button-danger mt-3"
                  type="submit"
              />
            </div>
          </form>
        </div>
      </Panel>
    </div>
  </div>
</template>

<style scoped>
/* Hier kannst du bei Bedarf eigenes CSS für das Layout hinzufügen */
</style>
