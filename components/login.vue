<script setup lang="ts">
/*
  Dein Login-Component mit @vueuse/core
  Damit der Token im LocalStorage persistiert,
  sodass man nach dem Schließen des Fensters eingeloggt bleibt.
*/
import { ref, reactive, computed } from "vue";
import { useStorage } from "@vueuse/core"; // <--- NEU
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";

// Zustand für Umschaltung (Login/Registrierung)
const showLogin = ref(true);

// Login-States
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");


const userEmailStorage = useStorage('auth_email', '');
const userNameStorage = useStorage('auth_username', '');

// Token wird jetzt in localStorage gespeichert
const userToken = useStorage("auth_token", "");

// Registrierungs-States
const formData = reactive({
  email: "",
  username: "",
  firstName: "",
  lastName: "",
  password: "",
  street: "",
  city: "",
  postalCode: "",
  country: "",
});
const success = ref(false);
const error = ref(false);

// Umschaltung zwischen Login und Registrierung
const toggleForm = () => {
  showLogin.value = !showLogin.value;
};

// Computed-Eigenschaft: true, wenn ein Token vorhanden ist
const isLoggedIn = computed(() => !!userToken.value);


// Login-Logik
const onLogin = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    const response = await fetch(
        "https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.value, password: password.value }),
        }
    );
    if (!response.ok) throw new Error("Login fehlgeschlagen");

    // Beispiel: Aus dem Response den Token und evtl. Username auslesen
    const data = await response.json();
    // Angenommen der Server gibt ein Objekt mit { token: '...', username: '...' } zurück
    if (data.token) {
      userToken.value = data.token;
    }
    if (data.username) {
      userNameStorage.value = data.username;     // <-- username speichern
    } else {
      userNameStorage.value = email.value;       // Oder E-Mail als Fallback
    }
    userEmailStorage.value = email.value;         // <-- E-Mail speichern
    // Falls der Server den Username liefert, übernehmen wir ihn
    if (data.username) {
      formData.username = data.username;
    } else {
      // Oder als Fallback die E-Mail eintragen
      formData.username = email.value;
    }

    userToken.value = data.token     // token speichern
    userEmailStorage.value = email.value  // E-Mail speichern

    successMessage.value = "Login erfolgreich!";
  } catch (err: any) {
    errorMessage.value = err.message || "Ein unerwarteter Fehler ist aufgetreten.";
  } finally {
    loading.value = false;
  }
};

const onLogout = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const logoutUrl = `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/user?token=${userToken.value}`;
    const response = await fetch(logoutUrl, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Logout fehlgeschlagen");

    // Nach erfolgreichem Logout den Token lokal löschen
    userToken.value = "";
    formData.username = ""; // optional: weitere Felder leeren
  } catch (err: any) {
    errorMessage.value = err.message || "Ein Fehler beim Logout ist aufgetreten.";
  } finally {
    loading.value = false;
  }
};

// Register-Logik
const onRegister = async () => {
  loading.value = true;
  success.value = false;
  error.value = false;
  try {
    const response = await fetch(
        "https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/user/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
    );
    if (!response.ok) throw new Error("Registrierung fehlgeschlagen");
    success.value = true;
  } catch (err: any) {
    error.value = true;
    errorMessage.value = err.message || "Ein Fehler ist aufgetreten!";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col items-center p-4">
    <!-- Falls NICHT eingeloggt: Login und Registrierung -->
    <div v-if="!isLoggedIn">
      <div v-if="showLogin">
        <div class="flex flex-col items-center p-4">
          <h2 class="text-2xl font-bold mb-4">Ich bin bereits Kunde</h2>
          <form @submit.prevent="onLogin" class="w-full max-w-sm">
            <!-- E-Mail Adresse -->
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium mb-1"
              >E-Mail Adresse</label
              >
              <InputText
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="E-Mail Adresse"
                  class="w-full pl-3 py-2 rounded border border-gray-300 focus:border-gray-700"
              />
              <p class="text-xs text-gray-500 mt-1">
                Wir werden Ihre E-Mail niemals an Dritte weitergeben.
              </p>
            </div>

            <!-- Passwort -->
            <div class="mb-6">
              <label for="password" class="block text-sm font-medium mb-1"
              >Passwort</label
              >
              <Password
                  id="password"
                  v-model="password"
                  placeholder="Passwort"
                  toggleMask
                  :feedback="false"
                  class="w-full"
                  inputClass="w-full py-2 px-3 border border-gray-300 rounded focus:border-gray-700"
              />
            </div>

            <!-- Login-Button -->
            <Button
                label="Anmelden"
                :loading="loading"
                class="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded"
                type="submit"
            />
            <!-- Fehlermeldung -->
            <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
            <!-- Erfolgsnachricht -->
            <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
          </form>

          <p class="mt-4">
            <Button class="text-blue-500 hover:underline" @click="toggleForm"
            >Noch kein Konto?</Button
            >
          </p>
        </div>
      </div>

      <!-- Registrierungsformular -->
      <div v-else>
        <div class="flex flex-col items-center p-4">
          <h2 class="text-2xl font-bold mb-4 text-center">Registrierungsformular</h2>
          <form @submit.prevent="onRegister" class="w-full max-w-md">
            <!-- E-Mail -->
            <div class="mb-3">
              <label for="email" class="block text-sm font-medium mb-1"
              >E-Mail *</label
              >
              <InputText
                  id="email"
                  v-model="formData.email"
                  placeholder="E-Mail Adresse"
                  class="w-full"
              />
            </div>

            <!-- Benutzername -->
            <div class="mb-3">
              <label for="username" class="block text-sm font-medium mb-1"
              >Benutzername *</label
              >
              <InputText
                  id="username"
                  v-model="formData.username"
                  placeholder="Benutzername"
                  class="w-full"
              />
            </div>

            <!-- Vorname -->
            <div class="mb-3">
              <label for="firstName" class="block text-sm font-medium mb-1"
              >Vorname *</label
              >
              <InputText
                  id="firstName"
                  v-model="formData.firstName"
                  placeholder="Vorname"
                  class="w-full"
              />
            </div>

            <!-- Nachname -->
            <div class="mb-3">
              <label for="lastName" class="block text-sm font-medium mb-1"
              >Nachname *</label
              >
              <InputText
                  id="lastName"
                  v-model="formData.lastName"
                  placeholder="Nachname"
                  class="w-full"
              />
            </div>

            <!-- Passwort -->
            <div class="mb-3">
              <label for="password" class="block text-sm font-medium mb-1"
              >Passwort *</label
              >
              <Password
                  id="password"
                  v-model="formData.password"
                  placeholder="Passwort"
                  toggleMask
                  class="w-full"
              />
            </div>

            <!-- Straße -->
            <div class="mb-3">
              <label for="street" class="block text-sm font-medium mb-1"
              >Straße *</label
              >
              <InputText
                  id="street"
                  v-model="formData.street"
                  placeholder="Straße"
                  class="w-full"
              />
            </div>

            <!-- Stadt -->
            <div class="mb-3">
              <label for="city" class="block text-sm font-medium mb-1"
              >Stadt *</label
              >
              <InputText
                  id="city"
                  v-model="formData.city"
                  placeholder="Stadt"
                  class="w-full"
              />
            </div>

            <!-- Postleitzahl -->
            <div class="mb-3">
              <label for="postalCode" class="block text-sm font-medium mb-1"
              >Postleitzahl *</label
              >
              <InputText
                  id="postalCode"
                  v-model="formData.postalCode"
                  placeholder="Postleitzahl"
                  class="w-full"
              />
            </div>

            <!-- Land -->
            <div class="mb-3">
              <label for="country" class="block text-sm font-medium mb-1"
              >Land *</label
              >
              <InputText
                  id="country"
                  v-model="formData.country"
                  placeholder="Land"
                  class="w-full"
              />
            </div>

            <Button
                type="submit"
                label="Registrieren"
                :loading="loading"
                class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            />

            <!-- Erfolgsnachricht -->
            <p v-if="success" class="text-green-500 mt-4">
              Konto erfolgreich erstellt!
            </p>
            <p v-if="error" class="text-red-500 mt-4">
              Fehler: {{ errorMessage }}
            </p>
          </form>
          <p class="mt-4">
            <Button class="text-blue-500 hover:underline" @click="toggleForm"
            >Zurück zum Login</Button
            >
          </p>
        </div>
      </div>
    </div>

    <!-- Falls eingeloggt: Einfach nur Logout-Button anzeigen -->
    <div v-else>
      <div v-if="formData && formData.username">
        Willkommen {{ formData.username }}!
      </div>
      <Button
          label="Ausloggen"
          class="bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          :loading="loading"
          @click="onLogout"
      />
      <!-- Fehlermeldung, falls Logout schiefgeht -->
      <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
    </div>
  </div>
</template>
