<script setup lang="ts">

import Header from "~/components/header.vue";
import {computed, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import {useStorage} from "@vueuse/core";

const router = useRouter()

const userToken = useStorage("auth_token", "");
const userNameStorage = useStorage('auth_username', '');

const orderStat = ref('');
const userStat = ref('');
const bookStat = ref('');
const allOrders = ref([])

const items = computed(() => [
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push('/')
    }
  },{
    label: 'Dashboard',
    icon: 'pi pi-home',
    command: () => {
      router.push('/admin/dashboard')
    }
  },{
    label: 'Bücher',
    icon: 'pi pi-book',
    command: () => {
      router.push('/admin/books')
    }
  }]);

onMounted(() => {
  getAllOrders();
  getOrderStats();
  getUserStats();
  getBookStats();
});

async function getOrderStats (){
  try{
    const response = await fetch(
    `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/count/orders`
    );
  if (!response.ok) {
    throw new Error('Fehler beim Abrufen der Order Statistiken');
  }
  orderStat.value = await response.json();
  } catch (error) {
    console.error('Order Statistik laden fehlgeschlagen:', error);
  }
}

async function getUserStats (){
  try{
    const response = await fetch(
        `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/count/users`
    );
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der User Statistiken');
    }
    userStat.value = await response.json();
  } catch (error) {
    console.error('User Statistik laden fehlgeschlagen:', error);
  }
}

async function getBookStats (){
  try{
    const response = await fetch(
        `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/count/books`
    );
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Book Statistiken');
    }
    bookStat.value = await response.json();
  } catch (error) {
    console.error('Book Statistik laden fehlgeschlagen:', error);
  }
}

async function getAllOrders () {
  try{
    const response = await fetch (
      `https://b2c-backend-927d63ee0883.herokuapp.com/api/v1.0/order/all?token=${userToken.value}`
    );
    console.log(allOrders.value)
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der gesamten Orders');
    }
    const data = await response.json();
    console.log('Response data:', data);
    allOrders.value = data.orders;
  } catch (error) {
    console.error('Laden aller Orders fehlgeschlagen:', error);
  }
}

</script>

<template>
  <Header />
  <MenuBar :model="items" class="text-gray-800" />

  <div class="max-w-6xl mx-auto my-4 p-2">
  <h1> Willkommen auf dem Dashboard {{userNameStorage}} </h1>

  <p class="text-xl"> Hier sind die aktuellen Statistiken:</p>
  <div class="mt-4 pb-4">
    <p class="text-gray-600 dark:text-gray-100 mt-2 leading-relaxed">
      So viele Bestellungen sind bisher eingegangen:
      {{orderStat || 'Keine Bestellungen vorhanden' }}
    </p>
    <p class="text-gray-600 dark:text-gray-100 mt-2 leading-relaxed">
      So viele User haben sich bisher registriert:
      {{userStat || 'Noch kein User vorhanden' }}
    </p>
    <p class="text-gray-600 dark:text-gray-100 mt-2 leading-relaxed">
      So viele Bücher sind im Shop verfügbar:
      {{bookStat || 'Keine Bücher im Shop vorhanden' }}
    </p>
  </div>


    <h2 class="text-xl font-bold mb-4 text-gray-600 dark:text-gray-100">Alle eingegangenen Bestellungen</h2>
    <!-- PrimeVue-DataTable -->
    <DataTable
        :value="allOrders"
        responsiveLayout="scroll"
        :paginator="true"
        :rows="10"
    >
      <Column field="orderID" header="Order ID" sortable />
      <Column field="cartID" header="Cart ID" sortable />
      <Column field="order_Date" header="Order Date" sortable />
      <Column field="order_Status" header="Order Status" sortable />
      <Column field="total_amount" header="Total Amount" sortable />
    </DataTable>
  </div>





</template>

<style scoped>

</style>