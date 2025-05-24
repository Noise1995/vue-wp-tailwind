<script setup>
  import { ref, onMounted, computed } from 'vue';
  import ArticleCard from './articleCard.vue';
  import Buttons from './buttons.vue';  
  import { fetchArticles } from '@/api/wordpress.js';
  
  const articles = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const perPage = 8;
  const hasMore = ref(true);

  async function loadArticles(page = 1) {
    loading.value = true;
    error.value = null;
    try {
      const newArticles = await fetchArticles({ page, perPage });
      if (page === 1) {
        articles.value = newArticles;
      } else {
        articles.value = [...articles.value, ...newArticles];
      }
      // Se ricevi meno articoli del perPage, hai finito gli articoli
      hasMore.value = newArticles.length === perPage;
    } catch (err) {
      error.value = err.message || 'Errore durante il caricamento degli articoli da WordPress.';
    } finally {
      loading.value = false;
    }
  }

  function loadMore() {
    currentPage.value += 1;
    loadArticles(currentPage.value);
  }

  onMounted(() => {
    loadArticles(currentPage.value);
  });

  const loadMoreButton = [
    {
      label: 'Carica altri',
      action: loadMore,
      class: 'bg-blue-600 text-white hover:bg-blue-700 mt-8'
    }
  ];
  
  onMounted(async () => {
    await loadArticles();
  });
  
</script>
  
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Articoli del Blog</h1>

    <div v-if="loading && articles.length === 0" class="text-center text-gray-600 text-lg">Caricamento articoli...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">Errore nel caricamento degli articoli: {{ error }}</div>
    <div v-else-if="articles.length === 0" class="text-center text-gray-600 text-lg">
      Nessun articolo trovato
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
      </div>

      <div v-if="hasMore && !loading" class="flex justify-center">
        <Buttons :buttons="loadMoreButton" buttonExtraClass="mt-8" />
      </div>
      <div v-if="loading && articles.length > 0" class="text-center text-gray-600 text-lg mt-4">Caricamento altri articoli...</div>
    </div>
  </div>
</template>