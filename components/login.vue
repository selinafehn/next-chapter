<template>
  <Toast />

  <div class="flex flex-col items-center p-4">
    <!-- Wenn NICHT eingeloggt => Login / Registrierung -->
    <div v-if="!isLoggedIn">

      <!-- LOGIN -->
      <div v-if="showLogin">
        <div class="flex flex-col items-center p-4">
          <h2 class="text-2xl font-bold mb-4">Ich bin bereits Kunde</h2>
          <form @submit.prevent="onLogin" class="w-full max-w-sm">
            <!-- E-Mail -->
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium mb-1">E-Mail Adresse</label>
              <InputText id="email" v-model="email" type="email" required placeholder="E-Mail Adresse" class="w-full pl-3 py-2 rounded border border-gray-300 focus:border-gray-700"/>
              <p class="text-xs text-gray-500 mt-1">Wir werden Ihre E-Mail niemals an Dritte weitergeben.</p>
            </div>
            <!-- Passwort -->
            <div class="mb-6">
              <label for="password" class="block text-sm font-medium mb-1">Passwort</label>
              <Password id="password" v-model="password" placeholder="Passwort" toggleMask required :feedback="false" class="w-full" inputClass="w-full py-2 px-3 border border-gray-300 rounded focus:border-gray-700"/>
            </div>
            <!-- Button: Login -->
            <Button label="Anmelden" :loading="loading" class="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded" type="submit"/>
          </form>
          <p class="mt-4">
            <Button class="text-blue-500 hover:underline" @click="toggleForm">Noch kein Konto?</Button>
          </p>
        </div>
      </div>

      <!-- REGISTRIERUNG -->
      <div v-else>
        <div class="flex flex-col items-center p-4">
          <h2 class="text-2xl font-bold mb-4 text-center">
            Registrierungsformular
          </h2>
          <form @submit.prevent="onRegister" class="w-full max-w-md">
            <!-- E-Mail -->
            <div class="mb-3">
              <label for="email" class="block text-sm font-medium mb-1">E-Mail *</label>
              <InputText id="email" required v-model="formData.email" placeholder="E-Mail Adresse" class="w-full"/>
            </div>
            <!-- Benutzername -->
            <div class="mb-3">
              <label for="username" class="block text-sm font-medium mb-1">Benutzername *</label>
              <InputText id="username" required v-model="formData.username" placeholder="Benutzername" class="w-full"/>
            </div>
            <!-- Vorname -->
            <div class="mb-3">
              <label for="firstName" class="block text-sm font-medium mb-1">Vorname *</label>
              <InputText id="firstName" required v-model="formData.firstName" placeholder="Vorname" class="w-full"/>
            </div>
            <!-- Nachname -->
            <div class="mb-3">
              <label for="lastName" class="block text-sm font-medium mb-1">Nachname *</label>
              <InputText id="lastName" required v-model="formData.lastName" placeholder="Nachname" class="w-full"/>
            </div>
            <!-- Passwort -->
            <div class="mb-3">
              <label for="password" class="block text-sm font-medium mb-1">Passwort *</label>
              <Password id="password" required v-model="formData.password" placeholder="Passwort" toggleMask class="w-full"/>
            </div>
            <!-- Straße -->
            <div class="mb-3">
              <label for="street" class="block text-sm font-medium mb-1">Straße *</label>
              <InputText id="street" required v-model="formData.street" placeholder="Straße" class="w-full"/>
            </div>
            <!-- Stadt -->
            <div class="mb-3">
              <label for="city" class="block text-sm font-medium mb-1">Stadt *</label>
              <InputText id="city" required v-model="formData.city" placeholder="Stadt" class="w-full"/>
            </div>
            <!-- Postleitzahl -->
            <div class="mb-3">
              <label for="postalCode" class="block text-sm font-medium mb-1">Postleitzahl *</label>
              <InputText id="postalCode" required v-model="formData.postalCode" placeholder="Postleitzahl" class="w-full"/>
            </div>
            <!-- Land -->
            <div class="mb-3">
              <label for="country" class="block text-sm font-medium mb-1">Land *</label>
              <InputText id="country" required v-model="formData.country" placeholder="Land" class="w-full"/>
            </div>
            <Button type="submit" label="Registrieren" :loading="loading" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"/>
          </form>
          <p class="mt-4">
            <Button class="text-blue-500 hover:underline" @click="toggleForm">Zurück zum Login</Button>
          </p>
        </div>
      </div>
    </div>

    <!-- Wenn eingeloggt => Formular zur Datenbearbeitung + Logout -->
    <div v-else>
      <div class="mb-4">
        <div class="p-3 mb-4 text-l">
          Willkommen {{ userNameStorage }}! <br />Bearbeite hier deine Userdaten (und klicke auf "Änderungen speichern"):
        </div>
        <!-- Formular für User-Daten -->
        <div class="m-2">
          <form @submit.prevent="saveChanges" class="max-w-md p-2 border border-gray-300 rounded">
            <!-- Email (idR nicht änderbar, deswegen disabled) -->
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">E-Mail</label>
              <InputText v-model="userForm.email" disabled class="w-full" />
            </div>
            <!-- Benutzername -->
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Benutzername</label>
              <InputText v-model="userForm.username" class="w-full" />
            </div>
            <!-- Straße -->
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Straße</label>
              <InputText v-model="userForm.street" class="w-full" />
            </div>
            <!-- Postleitzahl -->
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Postleitzahl</label>
              <InputText v-model="userForm.postalCode" class="w-full" />
            </div>
            <!-- Stadt -->
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Stadt</label>
              <InputText v-model="userForm.city" class="w-full" />
            </div>
            <!-- Land -->
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1">Land</label>
              <InputText v-model="userForm.country" class="w-full" />
            </div>
            <!-- Button: Speichern -->
            <Button type="submit" label="Änderungen speichern" :loading="loading" class="mt-2 bg-blue-600 hover:bg-blue-700 text-white"/>
          </form>
        </div>
      </div>

      <p class="mt-6 text-l">Oder logge dich hier aus:</p>
      <Button label="Ausloggen" class="bg-[#15191ee4] dark:bg-warmGray rounded" :loading="loading" @click="onLogout"/>
      <p class="mt-6 text-l">Konto löschen?</p>
      <Button label="Konto löschen" class="bg-red dark:bg-red rounded" :loading="loading" @click="onDeleteClick"/>
      <!-- HIER kommt der Dialog rein -->
      <Dialog v-model:visible="showDeleteDialog" header="Konto löschen" modal style="width: 30vw">
        <div class="p-2">
          <p class="mb-3">
            Möchtest du deinen Account wirklich <strong>endgültig</strong> löschen?
          </p>
          <p class="mb-4 text-sm">
            Bitte gib dein Passwort ein, um den Löschvorgang zu bestätigen:
          </p>
          <!-- Passwort-Eingabe -->
          <Password v-model="deletePassword" placeholder="Passwort" toggleMask :feedback="false" class="w-full"/>
          <div class="flex justify-end gap-2 mt-4">
            <Button label="Abbrechen" class="p-button-text" @click="showDeleteDialog = false"/>
            <Button label="Löschen" class="p-button-danger" :loading="loading" @click="confirmDeleteAccount"/>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";
import { useToast } from "primevue/usetoast";

// PrimeVue-Komponenten
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Toast from "primevue/toast";

// -- R O U T E R & T O A S T --
const router = useRouter();
const toast = useToast();

// Umschaltung zwischen Login und Registrierung
const showLogin = ref(true);
function toggleForm() {
  showLogin.value = !showLogin.value;
}

// Login-States
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// LocalStorage
const userToken = useStorage("auth_token", "");
const userEmailStorage = useStorage("auth_email", "");
const userNameStorage = useStorage("auth_username", "");

// Registrierungs-Felder
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

const showDeleteDialog = ref(false);
const deletePassword = ref('');

/**
 * Dialogsteuerung für den User Delete
 */
function onDeleteClick() {
  showDeleteDialog.value = true;
}

const userForm = reactive({
  email: "",
  username: "",
  street: "",
  postalCode: "",
  city: "",
  country: "",
});
const isLoggedIn = computed(() => !!userToken.value);

/**
 * user Login
 */
async function onLogin() {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await fetch(
        "https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.value, password: password.value }),
        }
    );

    if (!response.ok) throw new Error("Login fehlgeschlagen");

    const data = await response.json();

    // Token & Username speichern
    if (data.token) {
      userToken.value = data.token;
    }
    userNameStorage.value = data.username || email.value;
    userEmailStorage.value = email.value;

    successMessage.value = "Login erfolgreich!";
    toast.add({
      severity: "success",
      summary: "Erfolg",
      detail: "Login erfolgreich!",
      life: 3000,
    });

    setTimeout(() => {
      window.location.reload();
    }, 300);
    router.push("/");
  } catch (err: any) {
    errorMessage.value =
        err.message || "Ein unerwarteter Fehler ist aufgetreten.";
    toast.add({
      severity: "error",
      summary: "Fehler",
      detail:
          "Ein unerwarteter Fehler beim Login ist aufgetreten. Prüfe deine Email-Adresse und dein Passwort",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

/**
 * User logout
 */
async function onLogout() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const logoutUrl = `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/user?token=${userToken.value}`;
    const response = await fetch(logoutUrl, { method: "DELETE" });
    if (!response.ok) throw new Error("Logout fehlgeschlagen");

    // Speicher leeren
    localStorage.clear();

    toast.add({
      severity: "success",
      summary: "Erfolg",
      detail: "Erfolgreich ausgeloggt!",
      life: 3000,
    });

    setTimeout(() => {
      window.location.reload();
    }, 300);
    router.push("/");
  } catch (err: any) {
    errorMessage.value = err.message || "Ein Fehler beim Logout ist aufgetreten.";
    toast.add({
      severity: "error",
      summary: "Fehler",
      detail: "Ein Fehler beim Logout ist aufgetreten!",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

/**
 * User registrieren
 */
async function onRegister() {
  loading.value = true;
  success.value = false;
  error.value = false;

  try {
    const response = await fetch(
        "https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/user/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
    );
    if (!response.ok) throw new Error("Registrierung fehlgeschlagen");

    success.value = true;
    toast.add({
      severity: "success",
      summary: "Erfolg",
      detail: "Erfolgreich registriert!",
      life: 3000,
    });
  } catch (err: any) {
    error.value = true;
    errorMessage.value = err.message || "";
    toast.add({
      severity: "error",
      summary: "Fehler",
      detail: "Ein Fehler ist beim Registrieren aufgetreten!",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

/**
 * Laden der Userdaten
 */
async function getUserbyEmail() {
  try {
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/user?email=${userEmailStorage.value}`,
        { method: "GET" }
    );
    if (!response.ok) {
      throw new Error("Fehler beim Abrufen des Users");
    }
    const data = await response.json();

    // Beispiel: Passen wir die Felder an, die das Backend liefert
    // und speichern sie in ein Objekt
    const user = {
      email: data.email,
      username: data.username,       // oder data.username (je nach Backend-Feld)
      street: data.street,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
    };
    return user;
  } catch (error) {
    console.error("Fehler beim Abrufen der Nutzerdaten:", error);
  }
}

/**
 * Mounted die Userdaten im Dialog aus dem user
 */
onMounted(async () => {
  if (isLoggedIn.value) {
    const user = await getUserbyEmail();
    if (user) {
      // Unser userForm mit den Daten befüllen
      userForm.email = user.email;
      userForm.username = user.username;
      userForm.street = user.street;
      userForm.postalCode = user.postalCode;
      userForm.city = user.city;
      userForm.country = user.country;
    }
  }
});

/**
 * Aktualisiert die Userdaten
 */
async function saveChanges() {
  loading.value = true;
  error.value = false;

  try {
    // Objekt, das an /user/update gesendet wird
    const bodyToSend = {
      email: userForm.email,           // oft nicht änderbar
      username: userForm.username,
      street: userForm.street,
      postalCode: userForm.postalCode,
      city: userForm.city,
      country: userForm.country,
    };

    const response = await fetch(
        "https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/user/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyToSend),
        }
    );

    if (!response.ok) {
      throw new Error("Änderungen fehlgeschlagen");
    }

    toast.add({
      severity: "success",
      summary: "Erfolg",
      detail: "Erfolgreich geändert!",
      life: 3000,
    });

    // Evtl. neu laden
    setTimeout(() => {
      window.location.reload();
    }, 300);
  } catch (err: any) {
    error.value = true;
    errorMessage.value = err.message || "";
    toast.add({
      severity: "error",
      summary: "Fehler",
      detail: "Ein Fehler ist beim Ändern der Daten aufgetreten!",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}



/**
 * Dialog zum Bestätigen
 */
async function confirmDeleteAccount() {
  // Hier kannst du optional noch ein "Sicherheits-Confirm" machen,
  // aber wir haben ja schon den Dialog.
  loading.value = true;
  errorMessage.value = '';

  try {
    // Dein Endpoint, z.B.:
    // DELETE /user/delete?email=test&password=test
    const deleteUrl = `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/user/delete?email=${userEmailStorage.value}&password=${deletePassword.value}`;
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Löschen fehlgeschlagen');
    }

    // Erfolg
    toast.add({
      severity: 'success',
      summary: 'Erfolg',
      detail: 'Dein Account wurde gelöscht!',
      life: 3000,
    });

    // Dialog schließen, Passwort aus dem Speicher löschen
    showDeleteDialog.value = false;
    deletePassword.value = '';

    // Lokalen Speicher leeren
    localStorage.clear();

    // Weiterleitung oder Reload
    setTimeout(() => {
      window.location.reload();
    }, 300);
    router.push('/');

  } catch (err: any) {
    errorMessage.value = err.message || 'Fehler beim Löschen.';
    toast.add({
      severity: 'error',
      summary: 'Fehler',
      detail: 'Der Account konnte nicht gelöscht werden!',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}
</script>