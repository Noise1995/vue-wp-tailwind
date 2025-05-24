<script setup>
  import { ref, onMounted, computed } from 'vue';
  import ArticleCard from './articleCard.vue';
  import { fetchArticles } from '@/api/wordpress.js';
  
  const articles = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  onMounted(async () => {
    await loadArticles();
  });
  
  async function loadArticles() {
    loading.value = true;
    error.value = null;
    try {
      // Puoi passare page/perPage se vuoi, qui default 1/10
      articles.value = await fetchArticles({ page: 1, perPage: 10 });
    } catch (err) {
      error.value = err.message || 'Errore durante il caricamento degli articoli da WordPress.';
    } finally {
      loading.value = false;
    }
  }

  const articlesToShow = 8; 
  const limitedArticles = computed(() => articles.value.slice(0, articlesToShow));
</script>
  
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Articoli del Blog</h1>

    <div v-if="loading" class="text-center text-gray-600 text-lg">Caricamento articoli...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">Errore nel caricamento degli articoli: {{ error }}</div>
    <div v-else-if="articles.length === 0" class="text-center text-gray-600 text-lg">
      Nessun articolo trovato
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ArticleCard v-for="article in limitedArticles" :key="article.id" :article="article" />
    </div>
  </div>
</template>