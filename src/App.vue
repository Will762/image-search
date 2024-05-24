<script setup>
  import { ref, watch } from 'vue';
  import Modal from './components/modal.vue';
  import SearchResults from './components/SearchResults.vue';

  let searchTerm = ref('');
  let lastSearched = ref('');
  let searchDisabled = ref(true);
  let searchResults = ref(null);
  let page = ref(1);
  let loading = ref(false);
  const remainingResults = {
    searchUnsplash: Infinity,
    searchPexels: Infinity,
    searchPixabay: Infinity,
  };
  let allOut = false;
  let activeItem = ref(null);

  watch(searchTerm, () => {
    searchDisabled.value = lastSearched.value === searchTerm.value;
    searchDisabled.value = !searchTerm.value;
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

        console.log(searchResults.value);

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

</script>

<template>

  <form>
    <input v-model="searchTerm" placeholder="Search query">
    <button class="search" v-bind:disabled="searchDisabled" v-on:click="newSearch">Search</button>
  </form>

  <SearchResults
    v-if="searchResults"
    :searchResults="searchResults"
  />

  <img v-if="loading" class="loader" src="./assets/spinner.png"/>

  <Modal
    v-if="activeItem"
    @close-modal="activeItem = null;"
    :id="activeItem.id"
    :smallURL="activeItem.smallURL"
    :largeURL="activeItem.largeURL"
    :user="activeItem.user"
    :userProfile="activeItem.userProfile"
    :userPic="activeItem.userPic"
  >
  </Modal>

</template>

<style scoped>
  .loader {
    width: 50px;
    height: auto;
    margin: 40px;
    animation: spin .75s linear infinite;
  }

  @keyframes spin {
    100% {
      rotate: 360deg;
    }
  }

</style>
