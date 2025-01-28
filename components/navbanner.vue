<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'

/**
 * Initialisiert die Router-Instanz, um Navigation innerhalb der Anwendung zu ermöglichen.
 */
const router = useRouter()

/**
 * Steuert die Sichtbarkeit des Profil-Dialogs.
 * Wenn `true`, wird der Dialog angezeigt.
 */
const visibleProfile = ref(false)

/**
 * Speichert die E-Mail des Nutzers im Local Storage unter dem Schlüssel 'auth_email'.
 * Ermöglicht die persistente Speicherung und den Zugriff auf die Nutzerdaten.
 */
const userEmail = useStorage('auth_email', '')

/**
 * Definiert die Liste der Menüeinträge für die Menüleiste.
 * Jeder Eintrag enthält:
 * - `label`: Die Beschriftung des Menüeintrags.
 * - `icon`: Das zugehörige Icon.
 * - `command`: Die Aktion, die beim Klicken ausgeführt wird.
 * - `disabled`: Deaktiviert bestimmte Menüeinträge basierend auf dem Zustand.
 */
const items = computed(() => [
  {
    label: 'Home',
    icon: 'pi pi-home',
    /**
     * Navigiert zur Startseite der Anwendung.
     */
    command: () => {
      router.push('/')
    }
  },
  {
    label: 'Profil',
    icon: 'pi pi-user',
    /**
     * Zeigt den Profil-Dialog an, indem `visibleProfile` auf `true` gesetzt wird.
     */
    command: () => {
      visibleProfile.value = true
    }
  },
  {
    label: 'Wunschliste',
    icon: 'pi pi-heart',
    disabled: !userEmail.value,
    /**
     * Navigiert zur Wunschliste des Nutzers, falls eine E-Mail vorhanden ist.
     * Zeigt andernfalls den Profil-Dialog an.
     */
    command: () => {
      if (userEmail.value) {
        router.push(`/wishlist/${userEmail.value}`)
      } else {
        visibleProfile.value = true
      }
    }
  },
  {
    label: 'Warenkorb',
    icon: 'pi pi-shopping-cart',
    disabled: !userEmail.value,
    /**
     * Navigiert zum Warenkorb des Nutzers, falls eine E-Mail vorhanden ist.
     * Zeigt andernfalls den Profil-Dialog an.
     */
    command: () => {
      if (userEmail.value) {
        router.push(`/shoppingcart/${userEmail.value}`)
      } else {
        visibleProfile.value = true
      }
    }
  }
])
</script>

<template>
  <!--
  Menüleiste:
  Rendert die Menüeinträge aus der berechneten Liste `items`.
  Die Menüleiste verwendet Icons und Aktionen, um die Navigation und Interaktivität zu ermöglichen.
  -->
  <MenuBar :model="items" class="text-gray-800" />

  <!--
  Dialog für das Profil:
  Modal-Fenster, das angezeigt wird, wenn `visibleProfile` auf `true` gesetzt ist.
  Enthält ein zentriertes Login-Formular für die Nutzer-Authentifizierung.
  -->
  <Dialog
      v-model:visible="visibleProfile"
      modal
      :style="{ width: '50rem' }"
      :closable="true"
  >
    <div class="flex justify-center items-center h-full">
      <!--
      Container für Login-Inhalt:
      Der Bereich enthält die Login-Komponente, die zentriert angezeigt wird.
      -->
      <div class="flex flex-col items-center border-r border-gray-700 pr-6">
        <Login />
      </div>
    </div>
  </Dialog>
</template>
