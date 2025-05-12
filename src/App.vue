<script setup>
import Header from './components/header.vue'
import Footer from './components/footer.vue'
import ArticleList from './components/articleList.vue';

document.title = 'test vue + tailwind + wp';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />

      <main class="flex-grow p-4">
        <ArticleList v-if="$route.path === '/'"/>
        <router-view v-else/>
      </main>

    <Footer />
  </div>
</template>