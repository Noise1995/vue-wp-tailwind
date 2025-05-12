<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';

  const route = useRoute();
  const WORDPRESS_BASE_API_URL = 'http://localhost:8888/cms-api-test/wp-json/wp/v2/';

  const postContent = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const fetchContentBySlug = async (slug) => {

    loading.value = true;
    error.value = null;
    postContent.value = null; 

    if (!slug) {
      console.warn("fetchContentBySlug: Lo slug è nullo o indefinito. Non è possibile recuperare il contenuto.");
      error.value = "URL della pagina/articolo non valido.";
      loading.value = false;
      return;
    }

    try {
      let response = null;
      let contentFound = false;

      // Recupera come pagina
      try {
        response = await axios.get(`${WORDPRESS_BASE_API_URL}pages?slug=${slug}`);
        if (response && response.data.length > 0) {
          postContent.value = response.data[0];
          console.log("fetchContentBySlug: Contenuto trovato come pagina. Titolo:", postContent.value.title?.rendered); // Utile per la conferma
          contentFound = true;
        }
      } catch (e) {
        console.warn(`Non trovato come pagina per slug '${slug}'. Prossimo tentativo: post. Errore specifico:`, e.message); 
      }

      // Recupera come Post se non trovato come Pagina
      if (!contentFound) { 
          response = await axios.get(`${WORDPRESS_BASE_API_URL}posts?slug=${slug}`);
          
          if (response && response.data.length > 0) {
            postContent.value = response.data[0];
            contentFound = true;
          } else {
            error.value = 'Contenuto non trovato per questo slug nelle pagine o negli articoli.';
            console.warn("fetchContentBySlug: Nessun contenuto trovato per lo slug:", slug); 
          }
      }
      // segnala errore se non trovato
      if (!contentFound) {
          error.value = error.value || 'Nessun contenuto trovato per questo slug.';
          postContent.value = null;
      }

    } catch (err) {
      console.error(`WorkspaceContentBySlug: Errore critico durante il recupero del contenuto per lo slug ${slug}:`, err); 
      error.value = err.message || 'Errore sconosciuto durante il caricamento del contenuto.';
      postContent.value = null;
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
          console.warn("watch: Nuovo slug nullo o indefinito dopo un vecchio slug valido. Svuotamento del contenuto.");
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

      <div class="prose lg:prose-xl max-w-none" v-html="postContent.content?.rendered"></div>

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