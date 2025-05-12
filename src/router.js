import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import ArticleDetail from './components/articleDetail.vue';
import PageDetail from './components/pageDetail.vue';

const router = createRouter({
  // PER MESSA IN PRODUZIONE
  // Se la tua app Vue.js sarà servita dalla stessa sottocartella di WordPress in produzione
  // (es. build finale copiata in http://localhost:8888/cms-api-test/),
  // allora dovresti usare createWebHistory('/cms-api-test/').
  // Per lo sviluppo locale (npm run dev), createWebHistory() è spesso sufficiente,
  // ma le rotte sotto DEVONO includere la sottocartella per matchare i link generati.
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: App
    },
    {
      path: '/article/:id',
      name: 'article-detail',
      component: ArticleDetail,
      props: true
    },
    {
      path: '/cms-api-test/:slug', 
      name: 'page-detail-wp', // Un nome più specifico per questa rotta
      component: PageDetail,
      props: true // Permette di passare lo slug come prop al componente PageDetail
    }
  ]
});

export default router;