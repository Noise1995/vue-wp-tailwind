<script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import ArticleCard from './articleCard.vue';
  
  const articles = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const WORDPRESS_API_URL = 'http://localhost:8888/cms-api-test/wp-json/wp/v2/posts';
  
  onMounted(async () => {
    fetchArticles();
  });
  
  async function fetchArticles() {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${WORDPRESS_API_URL}?_embed`);
      
      articles.value = response.data.map(article => {
        return {
          id: article.id,
          title: article.title.rendered,
          description: article.excerpt.rendered || '',
          body_markdown: article.content.rendered || '',
          
          cover_image: article._embedded && article._embedded['wp:featuredmedia'] && article._embedded['wp:featuredmedia'][0] ? 
                      article._embedded['wp:featuredmedia'][0].source_url : null,
          
          user: article._embedded && article._embedded['author'] && article._embedded['author'][0] ? 
                { username: article._embedded['author'][0].name } : { username: 'Autore Sconosciuto' },
          
          published_at: article.date,
          
          url: article.link
        };
      });
      loading.value = false;
    } catch (err) {
      error.value = err.message || 'Errore durante il caricamento degli articoli da WordPress.';
      loading.value = false;
    }
  }

  const articlesToShow = 6; 
  const limitedArticles = computed(() => {
    return articles.value.slice(0, articlesToShow);
  });

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