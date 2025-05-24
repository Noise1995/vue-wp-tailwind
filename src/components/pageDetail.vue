<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { fetchPageBySlug, fetchPostBySlug, fetchFeaturedImage } from '@/api/wordpress.js';

  const route = useRoute();

  const postContent = ref(null);
  const featuredImage = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const extraFields = ref(null);

  const fetchContentBySlug = async (slug) => {
    loading.value = true;
    error.value = null;
    postContent.value = null;
    extraFields.value = null;

    if (!slug) {
      error.value = "URL della pagina/articolo non valido.";
      loading.value = false;
      return;
    }

    try {
      // Prima tenta come pagina
      let content = await fetchPageBySlug(slug);

      // Se non trova, tenta come articolo
      if (!content) {
        content = await fetchPostBySlug(slug);
      }

      if (content) {
        postContent.value = content;
        if (content.acf) {
          extraFields.value = content.acf;
        }
        // Recupera immagine in evidenza se presente
        if (content._links && content._links["wp:featuredmedia"]) {
          featuredImage.value = await fetchFeaturedImage(content._links["wp:featuredmedia"][0].href);
        } else {
          featuredImage.value = null;
        }
      } else {
        error.value = 'Contenuto non trovato per questo slug nelle pagine o negli articoli.';
        postContent.value = null;
        extraFields.value = null;
        featuredImage.value = null;
      }
    } catch (err) {
      error.value = err.message || 'Errore durante il caricamento del contenuto.';
      postContent.value = null;
      extraFields.value = null;
      featuredImage.value = null;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchContentBySlug(route.params.slug);
  });

  watch(
    () => route.params.slug,
    (newSlug, oldSlug) => {
      if (newSlug && newSlug !== oldSlug) {
        fetchContentBySlug(newSlug);
      } else if (!newSlug && oldSlug) {
        postContent.value = null;
        loading.value = false;
        error.value = "URL della pagina/articolo non valido dopo la navigazione.";
      }
    },
    { immediate: false }
  );
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <span v-if="loading" class="text-center text-gray-600 text-lg">Caricamento contenuto...</span>
    <span v-else-if="error" class="text-center text-red-600 text-lg">Errore: {{ error }}</span>

    <div v-else-if="postContent">
      <h2 class="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
        {{ postContent.title?.rendered }}
      </h2>

      <img v-if="featuredImage" :src="featuredImage" :alt="postContent.title?.rendered" class="mb-4" />

      <div class="prose lg:prose-xl max-w-none" v-html="postContent.content?.rendered"></div>

      <div v-if="extraFields">
        <p><b>Campo extra:</b> {{ extraFields.test_esempio }}</p>
      </div>

      <p v-if="postContent.date" class="mt-8 text-gray-600 text-sm">
        Data: {{ new Date(postContent.date).toLocaleDateString() }}
      </p>
      <p v-if="postContent.type" class="text-gray-600 text-sm">
        Tipo: {{ postContent.type === 'page' ? 'Pagina' : 'Articolo' }}
      </p>
    </div>

    <span v-else class="text-center text-gray-600 text-lg">Nessun contenuto da visualizzare.</span>
  </div>
</template>