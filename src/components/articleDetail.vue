<script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  import buttons from './buttons.vue';

  const route = useRoute();
  const router = useRouter();

  const articleId = route.params.id;
  const article = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const WORDPRESS_BASE_API_URL = 'http://localhost:8888/cms-api-test/wp-json/wp/v2/posts';

  onMounted(async () => {
    try {
      const response = await axios.get(`${WORDPRESS_BASE_API_URL}/${articleId}?_embed`);

      const fetchedArticle = response.data;
      if (fetchedArticle) {
        article.value = {

          id: fetchedArticle.id,
          title: fetchedArticle.title.rendered,
          
          body_html: fetchedArticle.content.rendered, 
          
          cover_image: fetchedArticle._embedded && fetchedArticle._embedded['wp:featuredmedia'] && fetchedArticle._embedded['wp:featuredmedia'][0] ? 
                        fetchedArticle._embedded['wp:featuredmedia'][0].source_url : null,
          user: fetchedArticle._embedded && fetchedArticle._embedded['author'] && fetchedArticle._embedded['author'][0] ? 
                { username: fetchedArticle._embedded['author'][0].name } : { username: 'Autore Sconosciuto' },
          published_at: fetchedArticle.date,
          url: fetchedArticle.link

        };
      } else {
        error.value = 'Articolo non trovato.';
      }
      loading.value = false;
    } catch (err) {
      console.error("Errore nel recupero dell'articolo da WordPress:", err);
      error.value = err.message || 'Errore durante il caricamento dell\'articolo.';
      loading.value = false;
    }
  });

  const backButton = computed(() => {
    return [
      {
        id: 1,
        label: '← Torna agli articoli',
        action: () => router.push('/'),
      },
    ];
  });
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center text-gray-600 text-lg">Caricamento articolo...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">Errore: {{ error }}</div>

    <div v-else-if="article">
      <buttons :buttons="backButton" class="mb-6" /> 

      <h2 class="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
        {{ article.title }}
      </h2>

      <div class="prose lg:prose-xl max-w-none" v-html="article.body_html"></div>
      
    </div>
  </div>
</template>
