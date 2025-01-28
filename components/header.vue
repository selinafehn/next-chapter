<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStorage } from '@vueuse/core';

// E-Mail des aktuellen Benutzers aus dem lokalen Speicher
const userEmailStorage = useStorage('auth_email', '');
const userEmail = userEmailStorage.value;

// Zustand für die Adminrolle
const isAdmin = ref();

// Funktion, um die Adminrolle zu prüfen
const checkAdminRole = async () => {
  try {
    const response = await fetch(`https://guarded-savannah-06972-2c2322fb41ef.herokuapp.com/api/v1.0/user/role/admin/get?email=${userEmail}`);
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Rolle');
    }
    isAdmin.value = await response.json(); // true oder false von der API
  } catch (error) {
    console.error('Rollenprüfung fehlgeschlagen:', error);
  }
};

// API-Aufruf beim Laden der Komponente
onMounted(() => {
  checkAdminRole();
});
</script>



<template>
  <div class="flex items-center gap-4 p-4 shadow-md rounded-md">
    <img src="../images/Logo.jpeg" alt="Logo Nextchapter" class="h-20 w-20 rounded-md"/>
    <div class="flex items-center gap-2 w-full">
      <Darkmode/>
    </div>
    <Button v-if="isAdmin" @click="$router.push('/admin/dashboard')" class="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600">Admin Dashboard</Button>
  </div>
</template>



