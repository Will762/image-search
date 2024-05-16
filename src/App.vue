<script setup>
  import { ref, watch } from 'vue';

  let searchTerm = ref('');
  let lastSearched = ref('');
  let results = ref('No results yet');
  let searchDisabled = ref(false);
  let page = ref(1);

  function search() {
    searchDisabled.value = true;
    lastSearched.value = searchTerm.value;

    const sanitizeURL = './api/sanitize.js';
    const headers = {
      "userquery": searchTerm.value,
      "page": page.value,
    };
    const options = {
      "headers": headers,
    };
    const request = new Request(sanitizeURL, options);

    fetch(request)
      .then(response => response.json())
      .then(data => {
        results.value = data;
        console.log(data);
      });
  }

  watch(searchTerm, () => searchDisabled.value = lastSearched.value === searchTerm.value);

</script>

<template>
  <form>
    <input v-model="searchTerm" placeholder="Search query">
    <button class="search" v-bind:disabled="searchDisabled" v-on:click="search">Search</button>
  </form>

  <div class="results">
    <p> {{ results }} </p>
    <!-- <p> Search term: {{ searchTerm }} </p> -->
  </div>
</template>

<style scoped>

</style>
