<script setup>
import { ref, onMounted } from 'vue';
import { fetchMenuItems, getMenuItemUrl } from '@/api/wordpress.js';

const menuItems = ref([]);
const loadingMenu = ref(false);
const errorMenu = ref(null);

onMounted(async () => {
  loadingMenu.value = true;
  errorMenu.value = null;
  try {
    const items = await fetchMenuItems(4); // Passa l'ID corretto del menu
    const resolvedMenuItems = [];
    for (const item of items) {
      const url = await getMenuItemUrl(item);
      resolvedMenuItems.push({
        id: item.id,
        title: item.title.rendered,
        url: url
      });
    }
    menuItems.value = resolvedMenuItems;
  } catch (err) {
    console.error("Errore nel recupero del menu da WordPress:", err);
    errorMenu.value = err.message || 'Errore durante il caricamento del menu.';
  } finally {
    loadingMenu.value = false;
  }
});

</script>

<template>
  <header class="bg-gray-800 text-white p-4 flex items-center justify-between w-full">
    <router-link to="/" class="flex items-center">
      <h1 class="text-2xl font-bold mr-4">Header</h1>
    </router-link>

    <nav class="flex items-center space-x-4">

      <span v-if="loadingMenu" class="text-gray-400">Caricamento menu...</span>
      <span v-else-if="errorMenu" class="text-red-400">Errore menu: {{ errorMenu }}</span>

      <template v-else>

        <template v-for="(item, index) in menuItems" :key="item.id">
          <router-link :to="item.url" class="text-gray-300 hover:text-white transition-colors duration-200 text-lg">
            {{ item.title }}
          </router-link>
          <span v-if="index < menuItems.length - 1" class="text-gray-500"> | </span>
        
        </template>
      </template>

    </nav>
  </header>
</template>