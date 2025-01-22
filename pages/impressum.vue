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

  <div class="p-6 shadow-md rounded-md">
    <h1 class="text-2xl font-bold  mb-4">Impressum</h1>

    <Accordion>
      <!-- 1. Firmenangaben -->
      <AccordionTab header="nextChapter UG (haftungsbeschränkt)">
        <p class="text-lg font-semibold text-gray-700">nextChapter UG (haftungsbeschränkt)</p>
        <p class="text-gray-700">Vertreten durch den Geschäftsführer:</p>
        <p class="font-semibold text-gray-700">Oliver Bechthold</p>
      </AccordionTab>

      <!-- 2. Adresse -->
      <AccordionTab header="Adresse">
        <p class="text-gray-700">
          Lohrtalweg 10<br />
          74821 Mosbach<br />
          Deutschland
        </p>
      </AccordionTab>

      <!-- 3. Registerinformationen -->
      <AccordionTab header="Registerinformationen">
        <p class="text-gray-700">
          <strong>Registergericht:</strong> Amtsgericht Mosbach <br />
          <strong>Registernummer:</strong> HRB 123456 <br />
          <strong>USt-IdNr. gemäß § 27a UStG:</strong> DE123456789
        </p>
      </AccordionTab>

      <!-- 4. Kontakt -->
      <AccordionTab header="Kontakt">
        <p class="text-gray-700">
          📞 <strong>Telefon:</strong> +49 160 12345678 <br />
          📧 <strong>E-Mail:</strong>
          <NuxtLink to="mailto:support@nextChapter.de" class="text-blue-500 hover:underline">
            support@nextChapter.de
          </NuxtLink>
        </p>
      </AccordionTab>

      <!-- 5. Redaktionell Verantwortlicher -->
      <AccordionTab header="Redaktionell Verantwortlicher">
        <p class="text-gray-700">
          <strong>Oliver Bechthold</strong><br />
          Lohrtalweg 10<br />
          74821 Mosbach
        </p>
      </AccordionTab>

      <!-- 6. Datenschutzbeauftragter -->
      <AccordionTab header="Datenschutzbeauftragter">
        <p class="text-gray-700">
          <strong>Oliver Bechthold</strong><br />
          Lohrtalweg 10<br />
          74821 Mosbach<br />
          📧 <strong>E-Mail:</strong>
          <NuxtLink to="mailto:datenschutz@nextChapter.de" class="text-blue-500 hover:underline">
            datenschutz@nextChapter.de
          </NuxtLink>
        </p>
      </AccordionTab>

      <!-- 7. Datenschutzerklärung -->
      <AccordionTab header="Datenschutzerklärung">
        <p class="text-gray-700">
          Weitere Informationen zum Datenschutz finden Sie in unserer
          <NuxtLink to="/datenschutz" class="text-blue-500 hover:underline">
            Datenschutzerklärung
          </NuxtLink>.
        </p>
      </AccordionTab>

      <!-- 8. Online-Streitbeilegung -->
      <AccordionTab header="Online-Streitbeilegung">
        <p class="text-gray-700">
          Plattform der EU-Kommission zur Online-Streitbeilegung:
          <NuxtLink to="https://ec.europa.eu/odr" class="text-blue-500 hover:underline">
            https://ec.europa.eu/odr
          </NuxtLink>
        </p>
      </AccordionTab>
    </Accordion>

    <div class="border-t pt-4 mt-6 text-sm text-gray-600">
      Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer
      Verbraucherschlichtungsstelle teilzunehmen.
    </div>
  </div>
</template>

<style scoped>

</style>