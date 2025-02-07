<script setup lang="ts">
/**
 * Importiert die Header-Komponente für die Navigation und Seiteneinleitung.
 */
import Header from "~/components/header.vue";
/**
 * Öffnet den chatbot
 */
const openChatbot = () => {
  const width = 800;
  const height = 600;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(
      'https://nextchapter.azurewebsites.net',
      '_blank',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
  );
};
</script>

<template>
  <!-- Header-Komponente -->
  <Header />
  <!-- Navigationsbanner -->
  <navbanner />
  <!-- Buchanzeige -->
  <BookDisplay />
  <!-- Footer-Komponente -->
  <Footer />
  <!-- Container für den Button -->
  <div class="fixed right-2 top-7/8">
    <Button
        label="🤖"
        class="p-button-rounded p-button-success bg-gray-700"
        :style="{ fontSize: '2rem', padding: '2rem', width: '2rem', height: '2rem' }"
        @click="openChatbot"
    />
  </div>
</template>

<style scoped>
/* Platzhalter für benutzerdefiniertes CSS */
</style>