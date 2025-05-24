<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import buttons from './buttons.vue';
  import { fetchArticleById } from '@/api/wordpress.js';

  const route = useRoute();
  const router = useRouter();

  const articleId = route.params.id;
  const article = ref(null);
  const loading = ref(true);
  const error = ref(null);

onMounted(async () => {

  loading.value = true;
  error.value = null;

  try {
    article.value = await fetchArticleById(articleId);
  } catch (err) {
    console.error("Errore nel recupero dell'articolo da WordPress:", err);
    error.value = err.message || 'Errore durante il caricamento dell\'articolo.';
  } finally {
    loading.value = false;
  }
  
});

const backButton = computed(() => [
  {
    id: 1,
    label: '← Torna agli articoli',
    action: () => router.push('/'),
  },
]);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center text-gray-600 text-lg">Caricamento articolo...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg">Errore: {{ error }}</div>

    <div v-else-if="article">
      <buttons :buttons="backButton" buttonExtraClass="cursor-pointer" class="mb-6" /> 

      <h2 class="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
        {{ article.title }}
      </h2>

      <img :src="article.cover_image" :alt="article.title" class="mb-4">

      <div class="prose lg:prose-xl max-w-none" v-html="article.body_html"></div>
      
    </div>
  </div>
</template>
