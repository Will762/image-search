<script setup>
import { ref, watch } from 'vue';
import SearchResults from './components/SearchResults.vue';
import SearchResultsModal from './components/SearchResultsModal.vue';

// Search stuff
let searchTerm = ref('');
let lastSearched = ref('');
let searchDisabled = ref(true);
let loading = ref(false);
// Results and pagination
let searchResults = ref(null);
let page = ref(1);
const remainingResults = {
  searchUnsplash: Infinity,
  searchPexels: Infinity,
  searchPixabay: Infinity,
};
let allOut = false;
// Modal
let activeItem = ref(null);

watch(searchTerm, () => {
  searchDisabled.value = lastSearched.value === searchTerm.value || !searchTerm.value;
});

function search() {
  loading.value = true;

  const params = new URLSearchParams();
  params.append('userQuery', searchTerm.value);
  params.append('page', page.value);
  for (const [key, value] of Object.entries(remainingResults)) {
    params.append(key, value > 0 ? true : '');
  }

  const sanitizeURL = `./api/sanitize.js?${params.toString()}`;
  fetch(sanitizeURL)
    .then((response) => response.json())
    .then((json) => {
      searchResults.value = searchResults.value ? searchResults.value.concat(json) : json;
      loading.value = false;
      allOut = false;

      json.forEach((api) => {
        remainingResults[api.value.api] = api.value.totalResults - (page.value * 24); //todo: per_page var?
      });
      for (const value of Object.values(remainingResults)) {
        if (value > 0) break;
        allOut = true;
      }
    });
}

function newSearch() {
  page.value = 1;
  searchResults.value = null;
  searchDisabled.value = true;
  lastSearched.value = searchTerm.value;
  for (const key of Object.keys(remainingResults)) {
    remainingResults[key] = Infinity;
  }
  search();
}

function scrollSearch() {
  page.value++;
  search();
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      observer.disconnect();
      scrollSearch();
    }
  });
});

watch(searchResults, () => {
  if (allOut) return;
  if (!searchResults.value) return;
  const target = document.querySelector('.last-container .last-item');
  observer.observe(target);
}, {
  flush: 'post'
});

watch(activeItem, () => {
  const modal = document.getElementById('modal');
  if (activeItem.value) {
    modal.showModal();
  } else {
    modal.close();
  }
});

document.body.addEventListener('keyup', (e) => {
  if (e.key !== 'Escape') return;
  activeItem.value = null;
});

</script>


<template>

  <form>
    <input v-model="searchTerm" placeholder="Search query">
    <button class="search" v-bind:disabled="searchDisabled" v-on:click="newSearch">Search</button>
  </form>

  <SearchResults
    v-if="searchResults"
    @setActive="(j, i) => activeItem = searchResults[j].value.photos[i]"
    :searchResults="searchResults"
  />

  <img v-if="loading" class="loader" src="./assets/spinner.png"/>

  <SearchResultsModal
    @clearActive="activeItem = null"
    :id="activeItem?.id"
    :smallURL="activeItem?.smallURL"
    :largeURL="activeItem?.largeURL"
    :user="activeItem?.user"
    :userProfile="activeItem?.userProfile"
    :userPic="activeItem?.userPic"
  />

</template>

<style scoped>
  form {
    padding: 2rem;
  }

  form > * {
    font-size: 1rem;
    display: block;
    width: 100%;
    max-width: 320px;
    min-width: 200px;
    border: 1px solid currentColor;
    padding: .6rem 1.2rem;
    margin: .2rem auto;
    border-radius: 4px;
  }

  form button {
    border-color: currentColor;
  }

  .loader {
    display: block;
    width: 40px;
    height: auto;
    margin: 20px auto;
    animation: spin 1s linear infinite;
    filter: contrast(.6);
  }

  @keyframes spin {
    100% {
      rotate: 360deg;
    }
  }

</style>
