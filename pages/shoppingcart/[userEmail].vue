<script setup lang="ts">
import Header from '~/components/header.vue'
import Navbanner from '~/components/navbanner.vue'

import {useStorage} from "@vueuse/core";
import {onMounted, ref} from "vue";
import {useRoute} from "#vue-router";
const userEmailStorage = useStorage('auth_email', '');
const route = useRoute()
const isbn = route.params.isbn

const userEmail = userEmailStorage.value;

onMounted(async () => {
  await fetchList()
})

const cart = ref(null)
async function fetchList () {
  try {
    const response = await fetch(`https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/shoppingcart?userEmail=${userEmail}`)
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Wishlist')
    }
    const data = await response.json()
    cart.value = data
  } catch (error) {
    console.error('Fehler:', error)
  }
}

async function fetchBookByIsbn() {
  try {
    const response = await fetch(`https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/book?isbn=${isbn}`)
    if (!response.ok) {
      throw new Error('Fehler beim Laden des Buches')
    }
    const data = await response.json()
    cart.value = data
  } catch (error) {
    console.error('Fehler:', error)
    cart.value = null
  }
}

</script>

<template>
  <Header />
  <Navbanner />

  <pre>{{ cart }}</pre>

  <div class="container mx-auto p-4">
    <!-- Header -->
    <h1 class="text-2xl font-bold mb-4 text-center">Hier ist deine Wishlist, {{ userEmail }}</h1>
  </div>

</template>

<style scoped>

</style>