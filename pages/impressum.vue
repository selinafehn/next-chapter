<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const items = computed(() => [
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push('/')
    }
  }]);
</script>

<template>
  <MenuBar :model="items" class="text-gray-800" />

    <div class="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Impressum</h1>

      <div class="mb-6">
        <p class="text-lg font-semibold text-gray-700">nextChapter UG (haftungsbeschränkt)</p>
        <p class="text-gray-700">Vertreten durch den Geschäftsführer:</p>
        <p class="font-semibold text-gray-700">Oliver Bechthold</p>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Adresse</h2>
        <p class="text-gray-700">
          Lohrtalweg 10<br />
          74821 Mosbach<br />
          Deutschland
        </p>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Registerinformationen</h2>
        <p class="text-gray-700">
          <strong>Registergericht:</strong> Amtsgericht Mosbach <br />
          <strong>Registernummer:</strong> HRB 123456 <br />
          <strong>USt-IdNr. gemäß § 27a UStG:</strong> DE123456789
        </p>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Kontakt</h2>
        <p class="text-gray-700">
          📞 <strong>Telefon:</strong> +49 160 12345678 <br />
          📧 <strong>E-Mail:</strong>
          <NuxtLink to="mailto:support@nextChapter.de" class="text-blue-500 hover:underline">
            support@nextChapter.de
          </NuxtLink>
        </p>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Redaktionell Verantwortlicher</h2>
        <p class="text-gray-700">
          <strong>Oliver Bechthold</strong><br />
          Lohrtalweg 10<br />
          74821 Mosbach
        </p>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Datenschutzbeauftragter</h2>
        <p class="text-gray-700">
          <strong>Oliver Bechthold</strong><br />
          Lohrtalweg 10<br />
          74821 Mosbach<br />
          📧 <strong>E-Mail:</strong>
          <NuxtLink to="mailto:datenschutz@nextChapter.de" class="text-blue-500 hover:underline">
            datenschutz@nextChapter.de
          </NuxtLink>
        </p>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Datenschutzerklärung</h2>
        <p class="text-gray-700">
          Weitere Informationen zum Datenschutz finden Sie in unserer
          <NuxtLink to="/datenschutz" class="text-blue-500 hover:underline">
            Datenschutzerklärung
          </NuxtLink>.
        </p>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Online-Streitbeilegung</h2>
        <p class="text-gray-700">
          Plattform der EU-Kommission zur Online-Streitbeilegung:
          <NuxtLink to="https://ec.europa.eu/odr" class="text-blue-500 hover:underline">
            https://ec.europa.eu/odr
          </NuxtLink>
        </p>
      </div>

      <div class="border-t pt-4 mt-6 text-sm text-gray-600">
        Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
      </div>
    </div>

</template>

<style scoped>

</style>