import axios from 'axios';

// variabile ambiente || fallback
const BASE_URL = import.meta.env.VITE_WORDPRESS_API_URL || 'http://localhost:8888/cms-api-test/wp-json/wp/v2/';
// wp directory
const WORDPRESS_SUBDIRECTORY = '/cms-api-test';

// articleList.vue
export async function fetchArticles({ page = 1, perPage = 10 } = {}) {
  try {
    const response = await axios.get(`${BASE_URL}posts`, {
      params: {
        _embed: true,
        page,
        per_page: perPage
      }
    });

    // mappa dati 
    return response.data.map(article => ({
      id: article.id,
      title: article.title.rendered,
      description: article.excerpt.rendered || '',
      body_markdown: article.content.rendered || '',
      cover_image: article._embedded && article._embedded['wp:featuredmedia'] && article._embedded['wp:featuredmedia'][0]
        ? article._embedded['wp:featuredmedia'][0].source_url
        : null,
      user: article._embedded && article._embedded['author'] && article._embedded['author'][0]
        ? { username: article._embedded['author'][0].name }
        : { username: 'Autore Sconosciuto' },
      published_at: article.date,
      url: article.link
    }));
  } catch (error) {
    throw error;
  }
}

// articleDetail.vue
export async function fetchArticleById(id) {
  try {
    const response = await axios.get(`${BASE_URL}posts/${id}`, {
      params: { _embed: true }
    });
    const article = response.data;
    return {
      id: article.id,
      title: article.title.rendered,
      body_html: article.content.rendered,
      cover_image: article._embedded && article._embedded['wp:featuredmedia'] && article._embedded['wp:featuredmedia'][0]
        ? article._embedded['wp:featuredmedia'][0].source_url
        : null,
      user: article._embedded && article._embedded['author'] && article._embedded['author'][0]
        ? { username: article._embedded['author'][0].name }
        : { username: 'Autore Sconosciuto' },
      published_at: article.date,
      url: article.link
    };
  } catch (error) {
    throw error;
  }
}

// artileDetail.vue
// Recupera una pagina per slug
export async function fetchPageBySlug(slug) {
  try {
    const response = await axios.get(`${BASE_URL}pages`, {
      params: {
        slug,
        acf_format: 'standard'
      }
    });
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    throw error;
  }
}

// Recupera un post per slug
export async function fetchPostBySlug(slug) {
  try {
    const response = await axios.get(`${BASE_URL}posts`, {
      params: {
        slug,
        acf_format: 'standard'
      }
    });
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    throw error;
  }
}

// Recupera immagine in evidenza da link
export async function fetchFeaturedImage(mediaLink) {
  if (!mediaLink) return null;
  try {
    const res = await axios.get(mediaLink);
    return (
      res.data.media_details?.sizes?.large?.source_url ||
      res.data.media_details?.sizes?.medium?.source_url ||
      res.data.source_url ||
      null
    );
  } catch {
    return null;
  }
}

// heaqder.vue
// Recupera il menu per ID (o slug, se usi plugin diversi)
export async function fetchMenuItems(menuId = 4) {
  try {
    const response = await axios.get(`${BASE_URL}menu-items`, {
      params: { menus: menuId }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw error;
  }
}

// Recupera lo slug di una risorsa WP tramite ID
export async function fetchSlugById(type, id) {
  try {
    const response = await axios.get(`${BASE_URL}${type}/${id}`);
    if (response.data && response.data.slug) {
      return response.data.slug;
    }
  } catch (error) {
    console.error(`Errore nel recupero dello slug per ${type} con ID ${id}:`, error);
  }
  return null;
}

// Costruisce l'URL finale per una voce di menu
export async function getMenuItemUrl(item) {
  if (item.url && item.url.startsWith('http')) {
    const urlPath = new URL(item.url).pathname;
    if (urlPath.startsWith(WORDPRESS_SUBDIRECTORY)) {
      return urlPath;
    } else {
      return `${WORDPRESS_SUBDIRECTORY}${urlPath}`;
    }
  } else if (item.object && item.object_id) {
    let endpoint = '';
    if (item.object === 'page') {
      endpoint = 'pages';
    } else if (item.object === 'post') {
      endpoint = 'posts';
    }
    if (endpoint) {
      const slug = await fetchSlugById(endpoint, item.object_id);
      return slug ? `${WORDPRESS_SUBDIRECTORY}/${slug}/` : '#';
    }
  }
  return '#';
}