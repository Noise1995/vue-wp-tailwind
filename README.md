# test-vue-dep



---

# Documentazione Progetto: Blog Vue.js + WordPress API

## Sommario

- [Descrizione generale](#descrizione-generale)
- [Stack tecnologico](#stack-tecnologico)
- [Struttura del progetto](#struttura-del-progetto)
- [Componenti principali](#componenti-principali)
- [Gestione delle rotte](#gestione-delle-rotte)
- [Gestione dati e API](#gestione-dati-e-api)
- [Stili e UI](#stili-e-ui)
- [Avvio e build del progetto](#avvio-e-build-del-progetto)
- [Personalizzazione e best practice](#personalizzazione-e-best-practice)

---

## Descrizione Generale

Questo progetto è una **single-page application (SPA)** sviluppata con **Vue 3** e **Tailwind CSS** per il frontend, che si interfaccia con un **backend WordPress** tramite le sue API REST.
L’obiettivo è fornire una piattaforma blog moderna, veloce e responsive, con contenuti dinamici gestiti da WordPress.

---

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

---

## Stack tecnologico

- **Frontend**
    - [Vue.js 3](https://vuejs.org/) (core framework)
    - [Vue Router](https://router.vuejs.org/) (gestione delle rotte)
    - [Tailwind CSS](https://tailwindcss.com/) (styling)
    - [Axios](https://axios-http.com/) (chiamate HTTP)
    - [Vite](https://vitejs.dev/) (bundler e dev server)
- **Backend**
    - [WordPress](https://wordpress.org/) (gestione contenuti, API REST)

---

## Struttura del Progetto

```

root/
├── dist/
│   └── assets/
│       ├── index.js
│       └── indexs.css
├── favicon.ico
├── index.html
├── node_modules/
├── public/
│   └── favicon.ico
├── src/
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
└── jsconfig.json


---

## Componenti Principali

### 1. **App.vue**

- **Ruolo:** Layout principale dell’applicazione.
- **Contenuto:**
    - Includi Header e Footer.
    - Gestisci le route: homepage (lista articoli) e altre pagine tramite `<router-view />`.


### 2. **Header.vue**

- **Ruolo:** Barra di navigazione superiore.
- **Funzionalità:**
    - Carica dinamicamente il menu da WordPress tramite API.
    - Gestisce correttamente link interni/esterni e sottocartelle WordPress.


### 3. **Footer.vue**

- **Ruolo:** Footer statico visualizzato in tutte le pagine.


### 4. **ArticleList.vue**

- **Ruolo:** Mostra la lista degli articoli del blog.
- **Funzionalità:**
    - Recupera articoli dal backend WordPress.
    - Gestisce loading, errori, immagine di fallback.
    - Implementa paginazione con pulsante “Carica altri”.


### 5. **ArticleCard.vue**

- **Ruolo:** Card per singolo articolo.
- **Funzionalità:**
    - Visualizza titolo, descrizione, pulsante per leggere il dettaglio.


### 6. **ArticleDetail.vue**

- **Ruolo:** Pagina di dettaglio di un articolo.
- **Funzionalità:**
    - Recupera un articolo tramite ID dalla route.
    - Mostra titolo, contenuto, autore, data, pulsante per tornare alla lista.


### 7. **PageDetail.vue**

- **Ruolo:** Pagina di dettaglio per pagine statiche o articoli via slug.
- **Funzionalità:**
    - Recupera e mostra contenuto WordPress tramite slug.
    - Gestisce sia pagine che articoli.


### 8. **Buttons.vue**

- **Ruolo:** Componente riutilizzabile per pulsanti dinamici.
- **Funzionalità:**
    - Riceve un array di pulsanti, ognuno con label, azione e classi personalizzabili.

---

## Gestione delle Rotte

Esempio di configurazione (in `router/index.js`):

```js
import { createRouter, createWebHistory } from 'vue-router';
import ArticleList from '../components/ArticleList.vue';
import ArticleDetail from '../components/ArticleDetail.vue';
import PageDetail from '../components/PageDetail.vue';

const routes = [
  { path: '/', component: ArticleList },
  { path: '/article/:id', component: ArticleDetail },
  { path: '/:slug', component: PageDetail }, // Attenzione: route dinamica per pagine/articoli via slug
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```


---

## Gestione Dati e API

- **Recupero dati:**
    - Tutti i dati vengono fetchati tramite chiamate HTTP alle API REST di WordPress.
    - Gli articoli e le pagine vengono mappati per estrarre solo i dati necessari (titolo, contenuto, immagini, autore, ecc.).
    - Gestione di loading ed errori in tutti i componenti che fanno fetch.
- **Immagine di fallback:**
    - Se un articolo non ha immagine in evidenza, viene mostrata un’immagine di default (`/images/default-image.jpg`).
- **Paginazione:**
    - Implementata in ArticleList tramite il parametro `page` delle API WordPress e un pulsante “Carica altri”.

---

## Stili e UI

- **Tailwind CSS:**
    - Tutti i componenti sono stilizzati con classi utility di Tailwind per una UI moderna e responsive.
    - Uso di classi come `prose` per il contenuto HTML degli articoli.
    - Responsive grid per la lista articoli.
- **Componenti riutilizzabili:**
    - Il componente `Buttons` permette di creare facilmente pulsanti dinamici e personalizzati.

---

## Avvio e Build del Progetto

### **Installazione**

1. Clona la repository.
2. Installa le dipendenze:

```bash
npm install
```

3. Avvia il server di sviluppo:

```bash
npm run dev
```

4. Per build di produzione:

```bash
npm run build
```


### **Dipendenze principali**

Dal tuo `package.json`:

```json
"dependencies": {
  "axios": "^1.8.4",
  "vue": "^3.5.13",
  "vue-router": "^4.5.0"
},
"devDependencies": {
  "@tailwindcss/vite": "^4.1.6",
  "@vitejs/plugin-vue": "^5.2.3",
  "tailwindcss": "^4.1.6",
  "vite": "^6.2.4",
  "vite-plugin-vue-devtools": "^7.7.2"
}
```


---

## Personalizzazione e Best Practice

- **URL API WordPress:**
    - Utilizza variabili d’ambiente (`.env`) per gestire facilmente gli endpoint tra sviluppo e produzione.
- **Gestione degli errori:**
    - Tutti i componenti che fanno fetch gestiscono loading ed errori in modo chiaro per l’utente.
- **SEO e accessibilità:**
    - Puoi migliorare il SEO impostando dinamicamente il titolo della pagina.
    - Aggiungi attributi ARIA e ruoli ai componenti di navigazione.
- **Ottimizzazione performance:**
    - Usa la paginazione per non caricare troppi articoli alla volta.
    - Usa immagini ottimizzate.

---

---

## Note Finali

- Questo progetto è **modulare** e facilmente estendibile.
- Ogni componente è pensato per essere riutilizzabile e facilmente personalizzabile.
- La separazione tra frontend (Vue) e backend (WordPress) ti permette di scalare e aggiornare indipendentemente le due parti.

---

# Analisi Blocchi del Progetto


---

## 1. **App.vue**

### **Responsabilità**

- Definisce il layout principale dell’app.
- Incapsula Header, Footer e la visualizzazione delle pagine tramite il router.


### **Flusso**

- All’avvio, imposta il titolo della pagina.
- Mostra sempre Header e Footer.
- Nel `<main>`, visualizza:
    - `ArticleList` se la route è `/`
    - Altrimenti, il componente corrispondente tramite `<router-view />`.


### **Punti chiave**

- Gestione centralizzata del layout.
- Utilizzo di Tailwind per struttura responsive.
- Routing dinamico.

---

## 2. **Header.vue**

### **Responsabilità**

- Visualizza la barra di navigazione superiore.
- Recupera dinamicamente il menu da WordPress.


### **Flusso**

1. **onMounted**:
    - Esegue una chiamata API per ottenere le voci di menu.
    - Per ogni voce, determina l’URL corretto (interno/esterno, con sottocartella).
    - Gestisce loading e errori.
2. **Funzioni di supporto**:
    - `fetchSlugById`: recupera lo slug di una risorsa WP tramite ID.
    - `getMenuItemUrl`: costruisce l’URL finale per ogni voce di menu.
3. **Template**:
    - Mostra "Home" sempre.
    - Mostra i link del menu, gestendo separatori, loading e errori.

### **Punti chiave**

- Gestione asincrona e robusta dei dati di menu.
- Compatibilità con WordPress in sottocartella.
- Navigazione accessibile e dinamica.

---

## 3. **Footer.vue**

### **Responsabilità**

- Visualizza un footer statico in fondo a tutte le pagine.


### **Flusso**

- Non ha logica JS.
- Template semplice con stile Tailwind.


### **Punti chiave**

- Statico, sempre presente, pronto per eventuali estensioni (es. copyright).

---

## 4. **ArticleList.vue**

### **Responsabilità**

- Mostra la lista degli articoli del blog.
- Gestisce il caricamento, la paginazione e gli errori.


### **Flusso**

1. **onMounted**:
    - Carica la prima pagina di articoli da WordPress.
2. **fetchArticles**:
    - Chiamata API con parametri `page` e `per_page`.
    - Mappa i dati per estrarre solo quelli necessari (id, titolo, descrizione, cover, autore, data, url).
    - Se manca la cover image, usa un’immagine di fallback.
    - Gestisce loading ed errori.
3. **Paginazione**:
    - Stato `currentPage` e `totalArticles` per sapere quanti articoli mostrare e se mostrare il pulsante “Carica altri”.
    - Il pulsante incrementa la pagina e richiama la fetch.
4. **Template**:
    - Mostra loading, errori, messaggio per lista vuota.
    - Griglia responsive di `ArticleCard`.
    - Pulsante “Carica altri” se ci sono ancora articoli da mostrare.

### **Punti chiave**

- Fetch robusto con fallback immagini.
- Paginazione efficiente.
- UI responsive e user-friendly.

---

## 5. **ArticleCard.vue**

### **Responsabilità**

- Visualizza una card per ogni articolo.


### **Flusso**

- Riceve l’oggetto `article` come prop.
- Mostra titolo e descrizione (HTML).
- Usa il componente `Buttons` per mostrare pulsanti dinamici (es. “Leggi l’articolo”).
- Il pulsante usa il router per navigare al dettaglio dell’articolo.


### **Punti chiave**

- Separazione tra presentazione e logica di navigazione.
- Facilmente estendibile (immagini, autore, data, badge, ecc.).

---

## 6. **Buttons.vue**

### **Responsabilità**

- Componente riutilizzabile per la visualizzazione di uno o più pulsanti dinamici.


### **Flusso**

- Riceve un array di pulsanti via prop, ognuno con label, azione e classi opzionali.
- Calcola le classi CSS per ogni pulsante combinando base, extra e classi specifiche.
- Al click, esegue la funzione `action` associata al pulsante.


### **Punti chiave**

- Altamente personalizzabile (stili, larghezza, classi).
- Validazione rigorosa dei dati in ingresso.

---

## 7. **PageDetail.vue**

### **Responsabilità**

- Visualizza il dettaglio di una pagina o di un articolo WordPress in base allo slug nella route.


### **Flusso**

1. **onMounted**:
    - Richiama `fetchContentBySlug` con lo slug attuale.
2. **fetchContentBySlug**:
    - Tenta prima di recuperare una pagina (`pages?slug=...`).
    - Se non trova nulla, tenta come articolo (`posts?slug=...`).
    - Aggiorna gli stati loading, error, postContent.
3. **watch**:
    - Se lo slug nella route cambia, richiama la fetch.
4. **Template**:
    - Mostra loading, error, contenuto (titolo, corpo, data, tipo), o messaggio di assenza.

### **Punti chiave**

- Gestione slug universale (pagine e articoli).
- UI chiara per tutti gli stati (caricamento, errore, successo, vuoto).

---

## 8. **ArticleDetail.vue**

### **Responsabilità**

- Visualizza il dettaglio di un singolo articolo tramite ID dalla route.


### **Flusso**

1. **onMounted**:
    - Recupera l’articolo tramite ID (`posts/:id?_embed`).
    - Mappa i dati (id, titolo, contenuto, cover, autore, data, url).
    - Gestisce loading ed errori.
2. **Pulsante di ritorno**:
    - Usa il componente `Buttons` per un pulsante “← Torna agli articoli” che riporta alla home.
3. **Template**:
    - Mostra loading, error, contenuto (titolo, corpo), e pulsante di ritorno.

### **Punti chiave**

- Dettaglio articolo completo, pronto per estensioni (commenti, autore, data, ecc.).
- Navigazione user-friendly.

---

## 9. **Struttura delle rotte**

- `/` → ArticleList
- `/article/:id` → ArticleDetail
- `/:slug` → PageDetail (gestione pagine/articoli via slug)

---

## 10. **Gestione dati e API**

- Tutti i dati vengono fetchati tramite chiamate HTTP alle API REST di WordPress.
- Gestione loading ed errori in ogni componente che fa fetch.
- Uso di fallback per immagini mancanti.
- Paginazione tramite parametri API.

---

## 11. **Stili e UI**

- Tailwind CSS per tutta la UI.
- Responsive grid e layout flessibile.
- Componenti riutilizzabili e facilmente personalizzabili.

---

## 12. **Avvio e build**

- `npm install` per installare le dipendenze.
- `npm run dev` per avviare il server di sviluppo.
- `npm run build` per la build di produzione.

---