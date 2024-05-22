<script setup>
  import { ref, watch } from 'vue';

  let searchTerm = ref('');
  let lastSearched = ref('');
  let searchDisabled = ref(false);
  let searchResults = ref(null);
  let page = ref(1);
  const remainingResults = {
    searchUnsplash: Infinity,
    searchPexels: Infinity,
    searchPixabay: Infinity,
  };

  watch(searchTerm, () => {
    searchDisabled.value = lastSearched.value === searchTerm.value;
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
          remainingResults[api.value.api] = api.value.totalResults - (page.value * 20); //todo: per_page var?
          console.log(json);
        });
      });
    console.log(remainingResults);
  }

  function newSearch() {
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
    page.value++;
    search();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scrollSearch();
        // only the relevant APIS?
        observer.disconnect();
      }
    });
  });

  watch(searchResults, () => {
    if (!searchResults.value) return;
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

</template>

<style scoped>
  img {
    height: 300px;
    width: 300px;
    object-fit: cover;
    margin-left: 5px;
  }
</style>
