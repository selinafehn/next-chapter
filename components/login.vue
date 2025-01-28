<template>
  <Toast />

  <div class="flex flex-col items-center p-4">
    <!-- Login- oder Registrierungsformular -->
    <div v-if="!isLoggedIn">
      <!-- Login -->
      <div v-if="showLogin">
        <form @submit.prevent="onLogin" class="w-full max-w-sm">
          <!-- E-Mail -->
          <div class="mb-4">
            <label for="email">E-Mail Adresse</label>
            <InputText id="email" v-model="email" type="email" required placeholder="E-Mail Adresse" class="w-full"/>
          </div>
          <!-- Passwort -->
          <div class="mb-6">
            <label for="password">Passwort</label>
            <Password id="password" v-model="password" placeholder="Passwort" required class="w-full"/>
          </div>
          <Button label="Anmelden" :loading="loading" class="w-full" type="submit"/>
        </form>
        <Button class="text-blue-500 hover:underline" @click="toggleForm">Noch kein Konto?</Button>
      </div>

      <!-- Registrierung -->
      <div v-else>
        <form @submit.prevent="onRegister" class="w-full max-w-md">
          <InputText v-model="formData.email" placeholder="E-Mail" required class="w-full mb-3"/>
          <InputText v-model="formData.username" placeholder="Benutzername" required class="w-full mb-3"/>
          <Password v-model="formData.password" placeholder="Passwort" required class="w-full mb-3"/>
          <Button label="Registrieren" :loading="loading" class="w-full" type="submit"/>
        </form>
        <Button class="text-blue-500 hover:underline" @click="toggleForm">Zurück zum Login</Button>
      </div>
    </div>

    <!-- Eingeloggt: Daten bearbeiten -->
    <div v-else>
      <form @submit.prevent="saveChanges" class="max-w-md">
        <InputText v-model="userForm.email" disabled class="w-full mb-3"/>
        <InputText v-model="userForm.username" class="w-full mb-3"/>
        <Button label="Änderungen speichern" :loading="loading" class="w-full" type="submit"/>
      </form>
      <Button label="Ausloggen" class="mt-4" @click="onLogout"/>
      <Button label="Konto löschen" class="mt-4" @click="onDeleteClick"/>
      <!-- Konto löschen Dialog -->
      <Dialog v-model:visible="showDeleteDialog" header="Konto löschen" modal>
        <Password v-model="deletePassword" placeholder="Passwort" class="w-full"/>
        <Button label="Löschen" class="p-button-danger" @click="confirmDeleteAccount"/>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";
import { useToast } from "primevue/usetoast";

// Komponenten und Tools
/**
 * Router für Navigation und Toast für Benachrichtigungen initialisieren.
 */
const router = useRouter();
const toast = useToast();

/**
 * Zustand, ob das Login- oder Registrierungsformular angezeigt wird.
 */
const showLogin = ref(true);

/**
 * Funktion zum Umschalten zwischen Login- und Registrierungsformular.
 */
const toggleForm = () => (showLogin.value = !showLogin.value);

/**
 * Login-Daten (E-Mail und Passwort).
 */
const email = ref("");
const password = ref("");

/**
 * Ladezustand und Fehlermeldungen für Aktionen.
 */
const loading = ref(false);

/**
 * Nutzerdaten aus dem Local Storage.
 */
const userToken = useStorage("auth_token", "");
const userEmailStorage = useStorage("auth_email", "");

/**
 * Registrierungsdaten des Nutzers.
 */
const formData = reactive({
  email: "",
  username: "",
  password: "",
});

/**
 * Berechneter Zustand, ob der Nutzer eingeloggt ist.
 */
const isLoggedIn = computed(() => !!userToken.value);

/**
 * Login-Funktion:
 * Sendet E-Mail und Passwort an die API, um den Nutzer zu authentifizieren.
 */
const onLogin = async () => {
  loading.value = true;
  try {
    const response = await fetch("LOGIN_API_URL", {
      method: "POST",
      body: JSON.stringify({ email: email.value, password: password.value }),
    });
    const data = await response.json();
    userToken.value = data.token;
    userEmailStorage.value = email.value;
    toast.add({ severity: "success", summary: "Erfolg", detail: "Login erfolgreich!" });
  } catch (error) {
    toast.add({ severity: "error", summary: "Fehler", detail: "Login fehlgeschlagen!" });
  } finally {
    loading.value = false;
  }
};

/**
 * Logout-Funktion:
 * Löscht den Authentifizierungstoken und loggt den Nutzer aus.
 */
const onLogout = async () => {
  loading.value = true;
  try {
    await fetch(`LOGOUT_API_URL?token=${userToken.value}`, { method: "DELETE" });
    userToken.value = "";
    toast.add({ severity: "success", summary: "Erfolg", detail: "Erfolgreich ausgeloggt!" });
  } catch {
    toast.add({ severity: "error", summary: "Fehler", detail: "Logout fehlgeschlagen!" });
  } finally {
    loading.value = false;
  }
};

/**
 * Registrierungsfunktion:
 * Sendet die Registrierungsdaten an die API, um ein neues Konto zu erstellen.
 */
const onRegister = async () => {
  loading.value = true;
  try {
    await fetch("REGISTER_API_URL", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    toast.add({ severity: "success", summary: "Erfolg", detail: "Registrierung erfolgreich!" });
  } catch {
    toast.add({ severity: "error", summary: "Fehler", detail: "Registrierung fehlgeschlagen!" });
  } finally {
    loading.value = false;
  }
};

/**
 * Dialogzustand und Passwort für das Löschen des Accounts.
 */
const showDeleteDialog = ref(false);
const deletePassword = ref("");

/**
 * Funktion zum Löschen des Accounts:
 * Sendet eine DELETE-Anfrage an die API mit der E-Mail und dem Passwort des Nutzers.
 */
const confirmDeleteAccount = async () => {
  loading.value = true;
  try {
    await fetch(`DELETE_API_URL?email=${userEmailStorage.value}&password=${deletePassword.value}`, { method: "DELETE" });
    toast.add({ severity: "success", summary: "Erfolg", detail: "Account gelöscht!" });
    userToken.value = "";
  } catch {
    toast.add({ severity: "error", summary: "Fehler", detail: "Löschen fehlgeschlagen!" });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Optional: Styles für das Layout und die Darstellung */
</style>
