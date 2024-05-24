<script setup>
const props = defineProps(['searchResults']);
</script>

<template>
  <span
    v-for="(api, j) in searchResults"
    v-bind:class="j === searchResults.length - 1 ? 'last-container' : null">
    
    <img
      v-for="(photo, i) in api.value.photos"
      v-bind:src="photo.smallURL"
      v-bind:class="i === api.value.photos.length - 1 ? 'last-item' : null"
      v-on:click="activeItem = searchResults[j].value.photos[i]; console.log(activeItem)" />
  </span>
</template>

<style scoped>
img {
  height: 200px;
  width: 200px;
  object-fit: cover;
  margin-left: 5px;
}
</style>