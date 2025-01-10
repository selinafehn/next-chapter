<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
const router = useRouter()

// Dialog-States
const visibleProfile = ref(false)

// Logged-in-User
const userEmail = useStorage('auth_email', '')

// Kategorie-Auswahl
const selectedCategory = ref()

// Kategorien
const categories = ref([
  { name: 'Romane' },
  { name: 'Krimi und Thriller' },
  { name: 'Kinder- und Jugend' },
  { name: 'Sachbücher' },
  { name: 'Garten und Pflanzen' },
  { name: 'Politik und Gesellschaft' }
])

// Menüeinträge
const items = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push('/')
    }
  },
  {
    label: 'Bücher',
    icon: 'pi pi-book',
    items: categories.value.map((category) => ({
      label: category.name,
      command: () => {
        selectedCategory.value = category.name
      }
    }))
  },
  {
    label: 'Profil',
    icon: 'pi pi-user',
    command: () => {
      visibleProfile.value = true
    }
  },
  {
    label: 'Wunschliste',
    icon: 'pi pi-heart',
    command: () => {
      router.push(`/wishlist/${userEmail.value}`)
    }
  },
  {
    label: 'Warenkorb',
    icon: 'pi pi-shopping-cart',
    command: () => {
      router.push(`/shoppingcart/${userEmail.value}`)
    }
  }
]
</script>

<template>
  <!-- Menüleiste -->
  <MenuBar :model="items" class="text-gray-800" />

  <!-- Dialog Profil -->
  <Dialog
      v-model:visible="visibleProfile"
      modal
      :style="{ width: '50rem' }"
      :closable="true"
  >
    <div class="flex justify-center items-center h-full">
      <div class="flex flex-col items-center border-r border-gray-700 pr-6">
        <Login />
      </div>
    </div>
  </Dialog>

</template>
