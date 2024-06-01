<script setup>
const props = defineProps(['searchResults']);
const emits = defineEmits(['setActive']);
</script>

<template>
  <div class="search-results">
    <span
      v-for="(api, j) in searchResults"
      v-bind:class="j === searchResults.length - 1 ? 'last-container' : null">
      
      <button
        v-for="(photo, i) in api.value.photos"
        @click="$emit('setActive', j, i)"
        >
        <img
          v-bind:src="photo.smallURL"
          v-bind:class="i === api.value.photos.length - 1 ? 'last-item' : null"
        />
      </button>

    </span>
  </div>
</template>

<style scoped>
  .search-results {
    padding: 2rem;
  }

  button {
   padding: 0; 
   margin: 2px;
   border-radius: 0;
  }

  img {
    height: 200px;
    width: 200px;
    object-fit: cover;
    vertical-align: bottom;
  }
</style>