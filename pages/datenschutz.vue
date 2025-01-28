<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

/**
 * Initialisiert die Router-Instanz für Navigation in der Anwendung.
 */
const router = useRouter();

/**
 * Definiert die Menüelemente der oberen Navigationsleiste.
 * - "Home": Verlinkt auf die Startseite.
 */
const items = computed(() => [
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push('/'); // Navigation zur Startseite
    },
  },
]);
</script>

<template>
  <!-- Navigationsleiste -->
  <MenuBar :model="items" class="text-gray-800" />

  <div class="p-4 text-xl">
    <!-- Accordion mit den verschiedenen Abschnitten der Datenschutzerklärung -->
    <Accordion>
      <!-- Abschnitt 1: Verantwortlicher für die Datenverarbeitung -->
      <AccordionTab header="1. Verantwortlicher für die Datenverarbeitung">
        <p>
          <strong>Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO):</strong><br />
          nextChapter UG (haftungsbeschränkt)<br />
          Geschäftsführer: Oliver Bechthold<br />
          Lohrtalweg 10<br />
          74821 Mosbach<br />
          Deutschland<br />
          E-Mail: <a href="mailto:support@nextChapter.de">support@nextChapter.de</a>
        </p>
      </AccordionTab>

      <!-- Abschnitt 2: Kontaktdaten des Datenschutzbeauftragten -->
      <AccordionTab header="2. Kontaktdaten des Datenschutzbeauftragten">
        <p>
          Oliver Bechthold<br />
          Lohrtalweg 10<br />
          74821 Mosbach<br />
          E-Mail: <a href="mailto:datenschutz@nextChapter.de">datenschutz@nextChapter.de</a>
        </p>
      </AccordionTab>

      <!-- Abschnitt 3: Erhebung und Verarbeitung personenbezogener Daten -->
      <AccordionTab header="3. Erhebung und Verarbeitung personenbezogener Daten">
        <p>Wir erheben und verarbeiten die folgenden personenbezogenen Daten:</p>
        <ul>
          <li>Name und Vorname</li>
          <li>E-Mail-Adresse</li>
          <li>Adresse (Straße, PLZ, Ort, Land)</li>
          <li>Benutzername und Passwort</li>
        </ul>
        <p>Diese Daten werden ausschließlich für folgende Zwecke verwendet:</p>
        <ul>
          <li>Abwicklung und Erfüllung von Bestellungen (Art. 6 Abs. 1 lit. b DSGVO)</li>
          <li>Verwaltung Ihres Benutzerkontos (Art. 6 Abs. 1 lit. b DSGVO)</li>
          <li>Kommunikation mit Ihnen (Art. 6 Abs. 1 lit. b DSGVO)</li>
        </ul>
      </AccordionTab>

      <!-- Abschnitt 4: Weitergabe von Daten an Dritte -->
      <AccordionTab header="4. Weitergabe von Daten an Dritte">
        <p>
          Ihre Daten werden nur an Dritte weitergegeben, wenn dies zur Vertragserfüllung erforderlich ist:
        </p>
        <ul>
          <li>Versanddienstleister (z. B. DHL)</li>
          <li>Zahlungsdienstleister (z. B. PayPal)</li>
        </ul>
      </AccordionTab>

      <!-- Abschnitt 5: Speicherung der Daten -->
      <AccordionTab header="5. Speicherung der Daten">
        <p>
          Ihre personenbezogenen Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist oder wie es gesetzliche Aufbewahrungsfristen vorschreiben.
        </p>
      </AccordionTab>

      <!-- Abschnitt 6: Rechte der betroffenen Person -->
      <AccordionTab header="6. Ihre Rechte als betroffene Person">
        <p>Sie haben folgende Rechte gemäß DSGVO:</p>
        <ul>
          <li>Auskunft über gespeicherte Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung der Daten, sofern keine gesetzlichen Pflichten entgegenstehen (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        </ul>
        <p>
          Zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter den oben genannten Kontaktdaten. Zudem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.
        </p>
      </AccordionTab>

      <!-- Abschnitt 7: Sicherheit der Daten -->
      <AccordionTab header="7. Sicherheit Ihrer Daten">
        <p>
          Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten vor unbefugtem Zugriff, Verlust oder Manipulation zu schützen.
        </p>
      </AccordionTab>

      <!-- Abschnitt 8: Änderungen der Datenschutzerklärung -->
      <AccordionTab header="8. Änderungen der Datenschutzerklärung">
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren. Die aktuelle Version finden Sie unter: <a href="https://www.mustershop.de/datenschutz">www.mustershop.de/datenschutz</a><br />
          Stand: Januar 2025
        </p>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<style scoped>
/* Optional: CSS für die Darstellung */
</style>
