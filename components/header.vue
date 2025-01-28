<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStorage } from '@vueuse/core';

/**
 * E-Mail des aktuellen Nutzers aus dem lokalen Speicher.
 */
const userEmailStorage = useStorage('auth_email', '');
const userEmail = userEmailStorage.value;

/**
 * Speichert, ob der Nutzer Adminrechte besitzt.
 */
const isAdmin = ref();

/**
 * Prüft, ob der Nutzer Adminrechte hat, und aktualisiert `isAdmin`.
 */
const checkAdminRole = async () => {
  try {
    const response = await fetch(
        `https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/user/role/admin/get?email=${userEmail}`
    );
    if (!response.ok) throw new Error('Fehler beim Abrufen der Rolle');
    isAdmin.value = await response.json();
  } catch (error) {
    console.error('Rollenprüfung fehlgeschlagen:', error);
  }
};

/**
 * Führt die Rollenprüfung beim Laden der Komponente aus.
 */
onMounted(() => {
  checkAdminRole();
});
</script>

<template>
  <!-- Container für Logo, Darkmode-Toggle und optionalen Admin-Button -->
  <div class="flex items-center gap-4 p-4 shadow-md rounded-md">
    <!-- Logo der App -->
    <img
        src="../images/Logo.jpeg"
        alt="Logo Nextchapter"
        class="h-20 w-20 rounded-md"
    />

    <!-- Darkmode-Toggle -->
    <div class="flex items-center gap-2 w-full">
      <Darkmode />
    </div>

    <!-- Admin-Dashboard-Button (nur sichtbar, wenn `isAdmin` true ist) -->
    <Button
        v-if="isAdmin"
        @click="$router.push('/admin/dashboard')"
        class="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
    >
      Admin Dashboard
    </Button>
  </div>
</template>
