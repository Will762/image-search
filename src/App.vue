<script setup>
  import { ref, watch } from 'vue';

  let searchTerm = ref('');
  let lastSearched = ref('');
  let searchDisabled = ref(false);
  let searchResults = ref(null);
  let page = ref(1);
  let savedPageNumber;

  watch(searchTerm, () => {
    if (lastSearched.value === searchTerm.value) {
      searchDisabled.value = true;
      page.value = savedPageNumber;
    } else {
      searchDisabled.value = false;
      savedPageNumber = page.value;
      page.value = 1;
    }
    // searchDisabled.value = lastSearched.value === searchTerm.value;
    // page.value = 1;
  });

  function search() {
    if (lastSearched.value !== searchTerm.value) {
      searchResults.value = null;
      lastSearched.value = searchTerm.value;
      searchDisabled.value = true;
      page.value = 1;
    }

    const sanitizeURL = `./api/sanitize.js?userQuery=${searchTerm.value}&page=${page.value}`;
    fetch(sanitizeURL)
      .then((response) => response.json())
      .then((json) => {
        searchResults.value = searchResults.value ? searchResults.value.concat(json) : json;
        console.log(searchResults.value);
      });
  }

  // infinite scroooool
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        page.value++;
        search();
        // only the relevant APIS?
        observer.disconnect();
      }
    });
  });

  watch(searchResults, () => {
    if (!searchResults.value) return;
    const target = document.querySelector('.last-container .last-item');
    console.log(target);
    observer.observe(target);
  }, {
    flush: 'post'
  });


</script>

<template>

  <form>
    <input v-model="searchTerm" placeholder="Search query">
    <button class="search" v-bind:disabled="searchDisabled" v-on:click="search">Search</button>
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
    height: 400px;
    width: 400px;
    object-fit: cover;
  }
</style>
