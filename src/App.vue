<script setup>
  import { ref, watch } from 'vue';

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

  watch(searchTerm, () => {
    searchDisabled.value = lastSearched.value === searchTerm.value;
    searchDisabled.value = !searchTerm.value;
  });

  function search() {
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
        json.forEach((api) => {
          remainingResults[api.value.api] = api.value.totalResults - (page.value * 24); //todo: per_page var?
        });
      });
  }

  function newSearch() {
    loading.value = true;    
    searchResults.value = null;
    lastSearched.value = searchTerm.value;
    searchDisabled.value = true;
    page.value = 1;
    for (const key of Object.keys(remainingResults)) {
      remainingResults[key] = Infinity;
    }
    search();
  }

  function scrollSearch() {
    loading.value = true;    
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
    loading.value = false;
    for (const value of Object.values(remainingResults)) {
      if (value > 0) break;
      return;
    }
    const target = document.querySelector('.last-container .last-item');
    if (!target) return;
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

  <div v-if="searchResults" class="results">
    <span
      v-for="(api, j) in searchResults"
      v-bind:class="j === searchResults.length - 1 ? 'last-container' : ''"
    >
      <img
        v-for="(photo, i) in api.value.photos"
        v-bind:src="photo.smallURL"
        v-bind:class="i === api.value.photos.length - 1 ? 'last-item' : ''"
      />
    </span>

  </div>
  <img class="loader" src="./assets/spinner.png" v-if="loading"/>

</template>

<style scoped>
  img {
    height: 300px;
    width: 300px;
    object-fit: cover;
    margin-left: 5px;
  }

  .loader {
    width: 50px;
    height: auto;
    animation: spin .75s linear infinite;
  }

  @keyframes spin {
    to {
      rotate: 360deg;
    }
  }

</style>
