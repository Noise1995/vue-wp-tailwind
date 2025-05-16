<script setup>
import { computed } from 'vue'; 
import { useRouter } from 'vue-router'; 
import Buttons from './buttons.vue'; 

const props = defineProps({
  article: {
    type: Object,
    required: true,
  }
});

const router = useRouter();


const articleCardButtons = computed(() => [
  { 
    label: "Leggi l'articolo", 
    action: () => router.push(`/article/${props.article.id}`) 
  }
]);

</script>

<template>
  <router-link 
    :to="`/article/${article.id}`"
    class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group"
  >
    
      <img 
        :src="article.cover_image" 
        :alt="article.title" 
        class="w-full h-64 object-cover group-hover:opacity-90 transition"
      />
      
      <div class="p-6 pb-4 flex-grow">

        <h2 class="text-2xl font-bold text-gray-900 mb-3 leading-tight">
          {{ article.title }}
        </h2>
        
        <div 
          class="text-gray-700 text-base line-clamp-3" 
          v-html="article.description"
        ></div>
        
      </div>

    <div class="p-6 pt-0">
      <Buttons 
        :buttons="articleCardButtons" 
        buttonExtraClass="bg-indigo-600 hover:bg-indigo-700 text-white text-sm cursor-pointer" 
        @click.stop
      />
    </div>
  </router-link> 
</template>