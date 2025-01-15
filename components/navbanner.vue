<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
const router = useRouter()

// Dialog-States
const visibleProfile = ref(false)

// Logged-in-User
const userEmail = useStorage('auth_email', '')


// Menüeinträge
const items = computed(() => [
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push('/')
    }
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
    disabled: !userEmail.value,
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
