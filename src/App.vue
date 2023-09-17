<script setup>
  import HelloWorld from './components/HelloWorld.vue'
  let searchTerm;
  async function searchUnsplash() {
    const response = await fetch(`./api/sanitize.js?query=${searchTerm}`);
    const data = await response.json();
    console.log(data);
  }
</script>

<template>
  <input v-model="searchTerm" placeholder="Search query">
  <button class="search" v-bind:disabled="searchDisabled" v-on:click="searchUnsplash">Search</button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
