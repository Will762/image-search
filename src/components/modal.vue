<script setup>
const props = defineProps(['id', 'smallURL', 'largeURL', 'user', 'userProfile', 'userPic'])
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <button
          @click="$emit('closeModal')"
          class="close-modal">&#xd7;
        </button>
      </div>
      <img :src="props.smallURL">
      <p>{{ props.id }}</p>
      <img :src="props.userPic">
    </div>
  </div>
</template>


<style scoped>
  .modal {
    position: fixed;
    inset: 0;
  }

  .modal-content {
    background-color: black;
    max-width: 500px;
    max-height: 500px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
  }

  .modal-header {
    text-align: right;
  }

  .close-modal {
    font-size: 20px;
    color: white;
    padding: 10px;
  }
</style>