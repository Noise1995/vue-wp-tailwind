<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';


const WORDPRESS_MENU_API_URL = 'http://localhost:8888/cms-api-test/wp-json/wp/v2/menu-items?menus=4';

const WORDPRESS_SUBDIRECTORY = '/cms-api-test';

const menuItems = ref([]);
const loadingMenu = ref(false);
const errorMenu = ref(null);

async function fetchSlugById(type, id) {
    try {
        const response = await axios.get(`<span class="math-inline">\{WORDPRESS\_BASE\_API\_URL\}</span>{type}/${id}`);
        if (response.data && response.data.slug) {
            return response.data.slug;
        }
    } catch (error) {
        console.error(`Errore nel recupero dello slug per ${type} con ID ${id}:`, error);
    }
    return null;
}

// Funzione principale per determinare l'URL di una voce di menu
async function getMenuItemUrl(item) {
  // L'item ha già un URL completo 
  if (item.url && item.url.startsWith('http')) {
    const urlPath = new URL(item.url).pathname;
    // se sottocartella wp sempre inclusa
    if (urlPath.startsWith(WORDPRESS_SUBDIRECTORY)) {
        return urlPath;
    } else {
        // altrimenti la prependiamo
        return `<span class="math-inline">\{WORDPRESS\_SUBDIRECTORY\}</span>{urlPath}`;
    }
  }
  // L'item è una Pagina, Articolo, Categoria, dove dobbiamo recuperare lo slug
  else if (item.object && item.object_id) {
      let endpoint = '';
      if (item.object === 'page') {
          endpoint = 'pages';
      } else if (item.object === 'post') {
          endpoint = 'posts';
      }

      if (endpoint) {
          const slug = await fetchSlugById(endpoint, item.object_id);
          const finalUrl = slug ? `<span class="math-inline">\{WORDPRESS\_SUBDIRECTORY\}/</span>{slug}/` : '#';
          return finalUrl;
      }
  }
  return '#'; // Fallback 
}


// Hook del ciclo di vita: Esegui la logica quando il componente è montato
onMounted(async () => {
  loadingMenu.value = true;
  errorMenu.value = null;
  try {
    const response = await axios.get(WORDPRESS_MENU_API_URL);

    if (Array.isArray(response.data)) {
      const resolvedMenuItems = [];
      for (const item of response.data) {
        const url = await getMenuItemUrl(item);
        resolvedMenuItems.push({
          id: item.id,
          title: item.title.rendered,
          url: url
        });
      }
      menuItems.value = resolvedMenuItems;

    } else {
      errorMenu.value = 'Struttura dati del menu non riconosciuta o menu vuoto.';
    }

    loadingMenu.value = false;
  } catch (err) {
    console.error("Errore nel recupero del menu da WordPress:", err);
    errorMenu.value = err.message || 'Errore durante il caricamento del menu.';
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