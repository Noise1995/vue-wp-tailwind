# Blog Vue.js + WordPress API

**Documentazione Completa**

---

## Sommario

- [Descrizione Generale](#descrizione-generale)
- [Stack Tecnologico](#stack-tecnologico)
- [Struttura del Progetto](#struttura-del-progetto)
- [Componenti Principali](#componenti-principali)
- [Gestione delle Rotte](#gestione-delle-rotte)
- [Gestione Dati e API](#gestione-dati-e-api)
- [Gestione dei Campi ACF](#gestione-dei-campi-acf)
- [Stili e UI](#stili-e-ui)
- [Avvio e Build del Progetto](#avvio-e-build-del-progetto)
- [Personalizzazione e Best Practice](#personalizzazione-e-best-practice)
- [Analisi Dettagliata dei Componenti](#analisi-dettagliata-dei-componenti)
- [Esempi di Risposta delle API](#esempi-di-risposta-delle-api)
- [Debug e Suggerimenti](#debug-e-suggerimenti)
- [FAQ](#faq)

---

## Descrizione Generale

Questa applicazione è una **Single Page Application (SPA)** sviluppata con **Vue 3** e **Tailwind CSS**.
Il frontend comunica con un backend **WordPress** tramite le sue REST API, offrendo una piattaforma blog moderna, veloce e responsive, con contenuti dinamici gestiti da WordPress.

---

## Stack Tecnologico

- **Frontend**
    - [Vue.js 3](https://vuejs.org/)
    - [Vue Router](https://router.vuejs.org/)
    - [Tailwind CSS](https://tailwindcss.com/)
    - [Axios](https://axios-http.com/)
    - [Vite](https://vitejs.dev/)
- **Backend**
    - [WordPress](https://wordpress.org/)
    - [Advanced Custom Fields (ACF)](https://www.advancedcustomfields.com/) (per campi personalizzati)

---

## Struttura del Progetto

```
root/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── wordpress.js
│   ├── assets/
│   │   ├── logo.svg
│   │   └── styles.css
│   ├── components/
│   │   ├── articleCard.vue
│   │   ├── articleDetail.vue
│   │   ├── articleList.vue
│   │   ├── buttons.vue
│   │   ├── footer.vue
│   │   ├── header.vue
│   │   └── pageDetail.vue
│   ├── App.vue
│   ├── main.js
│   └── router.js
├── package.json
├── tailwind.config.js
├── vite.config.js
└── ...
```


---

## Componenti Principali

### App.vue

- Layout principale: include Header, Footer e `<router-view />`.


### header.vue

- Barra di navigazione superiore.
- Carica dinamicamente il menu da WordPress tramite funzioni centralizzate.


### footer.vue

- Footer statico visualizzato in tutte le pagine.


### **articleList.vue**

- Recupera articoli dal backend WordPress tramite API centralizzate.
- Gestisce loading, errori, immagine di fallback.
- Implementa la paginazione progressiva: mostra 8 articoli alla volta e, se presenti altri articoli, visualizza un pulsante “Carica altri” che permette di caricare progressivamente altri 8 articoli alla volta senza ricaricare la pagina.
- Utilizza il componente `buttons.vue` per il pulsante “Carica altri”.


### articleCard.vue

- Card riutilizzabile per singolo articolo.


### articleDetail.vue

- Pagina di dettaglio di un articolo, recuperato tramite ID dalla route.


### pageDetail.vue

- Pagina di dettaglio per pagine statiche o articoli via slug.


### buttons.vue

- Componente riutilizzabile per pulsanti dinamici.

---

## Gestione delle Rotte

Esempio di configurazione (`src/router.js`):

```js
import { createRouter, createWebHistory } from 'vue-router';
import articleList from './components/articleList.vue';
import articleDetail from './components/articleDetail.vue';
import pageDetail from './components/pageDetail.vue';

const routes = [
  { path: '/', component: articleList },
  { path: '/article/:id', component: articleDetail },
  { path: '/:slug', component: pageDetail }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```


---

## Gestione Dati e API

Tutte le chiamate HTTP alle API di WordPress sono **centralizzate** in `src/api/wordpress.js`.
I componenti importano solo le funzioni di fetch di cui hanno bisogno.

### Esempio di funzioni in `src/api/wordpress.js`:

```js
import axios from 'axios';

const BASE_URL = 'http://localhost:8888/cms-api-test/wp-json/wp/v2/';
const WORDPRESS_SUBDIRECTORY = '/cms-api-test';

// Recupera lista articoli
export async function fetchArticles({ page = 1, perPage = 10 } = {}) {
  try {
    const response = await axios.get(`${BASE_URL}posts`, {
      params: { _embed: true, page, per_page: perPage }
    });
    return response.data.map(article => ({
      id: article.id,
      title: article.title.rendered,
      description: article.excerpt.rendered || '',
      body_markdown: article.content.rendered || '',
      cover_image: article._embedded?.['wp:featuredmedia']?.[^0]?.source_url || null,
      user: article._embedded?.['author']?.[^0]?.name
        ? { username: article._embedded['author'][^0].name }
        : { username: 'Autore Sconosciuto' },
      published_at: article.date,
      url: article.link
    }));
  } catch (error) {
    throw error;
  }
}

// Recupera articolo per ID
export async function fetchArticleById(id) {
  try {
    const response = await axios.get(`${BASE_URL}posts/${id}`, { params: { _embed: true } });
    const article = response.data;
    return {
      id: article.id,
      title: article.title.rendered,
      body_html: article.content.rendered,
      cover_image: article._embedded?.['wp:featuredmedia']?.[^0]?.source_url || null,
      user: article._embedded?.['author']?.[^0]?.name
        ? { username: article._embedded['author'][^0].name }
        : { username: 'Autore Sconosciuto' },
      published_at: article.date,
      url: article.link
    };
  } catch (error) {
    throw error;
  }
}

// Recupera pagina per slug
export async function fetchPageBySlug(slug) {
  try {
    const response = await axios.get(`${BASE_URL}pages`, {
      params: { slug, acf_format: 'standard' }
    });
    return response.data.length > 0 ? response.data[^0] : null;
  } catch (error) {
    throw error;
  }
}

// Recupera post per slug
export async function fetchPostBySlug(slug) {
  try {
    const response = await axios.get(`${BASE_URL}posts`, {
      params: { slug, acf_format: 'standard' }
    });
    return response.data.length > 0 ? response.data[^0] : null;
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

// Recupera menu per ID
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

// Recupera slug di una risorsa WP tramite ID
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
```

**Paginazione progressiva ("Carica altri")**

Il componente `articleList.vue` implementa la paginazione progressiva tramite il parametro `page` delle API WordPress.
Vengono caricati 8 articoli per volta. Se ci sono altri articoli disponibili, viene visualizzato un pulsante **“Carica altri”** che consente di aggiungere altri 8 articoli alla lista senza ricaricare la pagina.
Questa funzionalità migliora l’esperienza utente e ottimizza le performance della pagina.

**Esempio di utilizzo nel template:**

```vue
<Buttons :buttons="loadMoreButton" buttonExtraClass="mt-8" v-if="hasMore && !loading" />
```


---

## Gestione dei Campi ACF

### 1. Configurazione lato WordPress

- Installa il plugin **Advanced Custom Fields**.
- Crea i campi e abilita "Show in REST API".
- Associa il gruppo di campi alle pagine/articoli desiderati.


### 2. Recupero e visualizzazione

- I dati ACF sono disponibili nella proprietà `acf` dell’oggetto pagina/articolo.
- Nel template puoi accedere ai campi tramite `extraFields.nome_campo`.

**Esempio:**

```vue
<div v-if="extraFields">
  <p><b>Campo extra:</b> {{ extraFields.test_esempio }}</p>
</div>
```


### 3. Debug

- Se la chiave `acf` non compare nella risposta, verifica che "Show in REST API" sia attivo.
- Il nome del campo in `extraFields` corrisponde a quello definito in ACF.

---

## Stili e UI

- Tutti i componenti sono stilizzati con **Tailwind CSS**.
- Responsive grid per la lista articoli.
- Uso di classi `prose` per la formattazione del contenuto HTML.
- Componenti riutilizzabili e facilmente personalizzabili.

---

## Avvio e Build del Progetto

```sh
npm install           # Installa le dipendenze
npm run dev           # Avvia il server di sviluppo
npm run build         # Build di produzione
```


---

## Personalizzazione e Best Practice

- **Centralizza tutte le chiamate API** in `src/api/wordpress.js`.
- **Gestisci loading e errori** a livello di componente.
- **Utilizza variabili d’ambiente** (file `.env`) per l’URL delle API se prevedi ambienti diversi.
- **Mantieni i componenti puliti**: nessun riferimento diretto ad axios o chiamate HTTP nei componenti.
- **Estendi facilmente**: aggiungi nuove funzioni di fetch nel modulo API, non nei componenti.
- **SEO e accessibilità**: imposta dinamicamente il titolo della pagina, usa attributi ARIA e ruoli per la navigazione.
- **Performance**: usa la paginazione per non caricare troppi articoli alla volta, immagini ottimizzate.

---

## Analisi Dettagliata dei Componenti

### articleList.vue

- Carica la prima pagina di articoli da WordPress su mount.
- Usa `fetchArticles` dal modulo API.
- Gestisce paginazione, loading, errori e fallback immagini.
- Mostra i dati tramite `articleCard.vue`.


### articleDetail.vue

- Recupera un articolo tramite ID dalla route.
- Usa `fetchArticleById` dal modulo API.
- Mostra titolo, contenuto, autore, data, pulsante per tornare alla lista.


### pageDetail.vue

- Recupera e mostra contenuto WordPress tramite slug.
- Tenta prima come pagina, poi come post.
- Gestisce sia pagine che articoli, inclusi campi ACF.


### header.vue

- Recupera dinamicamente il menu da WordPress tramite `fetchMenuItems` e `getMenuItemUrl`.
- Gestisce link interni/esterni e sottocartelle WordPress.


### buttons.vue

- Riceve un array di pulsanti, ognuno con label, azione e classi personalizzabili.
- Componente riutilizzabile per tutte le azioni utente.

### **Flusso**

1. **onMounted**:
    - Carica la prima pagina di articoli da WordPress (8 articoli).
2. **loadArticles**:
    - Chiamata API con parametri `page` e `perPage`.
    - Aggiunge gli articoli recuperati a quelli già presenti.
    - Se il numero di articoli recuperati è inferiore a `perPage`, il pulsante “Carica altri” scompare.
3. **Paginazione**:
    - Stato `currentPage` per sapere quale pagina caricare.
    - Il pulsante “Carica altri” incrementa la pagina e richiama la fetch.
4. **Template**:
    - Mostra loading, errori, messaggio per lista vuota.
    - Griglia responsive di `ArticleCard`.
    - Pulsante “Carica altri” se ci sono ancora articoli da mostrare

---

## Esempi di Risposta delle API

**Articolo:**

```json
{
  "id": 12,
  "title": { "rendered": "Titolo articolo" },
  "content": { "rendered": "<p>Testo...</p>" },
  "excerpt": { "rendered": "<p>Riassunto...</p>" },
  "date": "2024-06-01T12:00:00",
  "link": "http://localhost:8888/cms-api-test/articolo/slug-articolo/",
  "_embedded": {
    "author": [{ "name": "Mario Rossi" }],
    "wp:featuredmedia": [{ "source_url": "http://..." }]
  }
}
```

**Pagina con ACF:**

```json
{
  "id": 42,
  "title": { "rendered": "Titolo pagina" },
  "content": { "rendered": "<p>Contenuto principale</p>" },
  "acf": {
    "test_esempio": "Valore inserito in WordPress"
  }
}
```


---

## Debug e Suggerimenti

- **Menu non visualizzato?**
Verifica che l’ID del menu sia corretto e che le API siano raggiungibili.
- **Campi ACF mancanti?**
Controlla che "Show in REST API" sia attivo nel gruppo di campi ACF.
- **Immagini mancanti?**
Usa un’immagine di fallback nel mapping dei dati.
- **Problemi di CORS?**
Assicurati che il server WordPress consenta richieste dal dominio del frontend.

---

## FAQ

**Come aggiungo un nuovo campo ACF e lo visualizzo?**

1. Crea il campo in WordPress e abilita "Show in REST API".
2. Nel template Vue, accedi a `extraFields.nome_campo`.

**Come cambio l’URL delle API?**

- Modifica la costante `BASE_URL` in `src/api/wordpress.js`, oppure usa una variabile d’ambiente.

**Come aggiungo una nuova pagina statica?**

- Crea la pagina in WordPress, copia lo slug e visita `/:slug` nel frontend.

---

[^1]: README.md

