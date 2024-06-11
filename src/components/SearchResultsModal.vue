<script setup>
const props = defineProps(['id', 'smallURL', 'largeURL', 'user', 'userProfile', 'userPic']);
const emits = defineEmits(['clearActive']);
</script>

<template>
  <dialog id="modal">
    <div class="modal-header">
      <button
        class="close-modal"
        @click="$emit('clearActive')"
        aria-label="close"
      >
        &#xd7;
      </button>
    </div>

    <div class="modal-content">
      <a
        :href="props.largeURL"
        target="_blank"
      >
        <img
          class="display-img"
          :src="props.smallURL"
        >
      </a>

      <a
        :href="props.userProfile"
        target="_blank"
      >
        <p> {{ props.user }}</p>
        <img
          class="profile-img"
          :src="props.userPic"
        >
      </a>
    </div>

  </dialog>
</template>

<style scoped>
  ::backdrop {
    background-color: rgba(50, 50, 50, .8);
  }

  .modal-header {
    text-align: right;
    margin-bottom: 1em;
  }

  .close-modal {
    line-height: 1;
    font-size: 20px;
    color: white;
    padding: 10px;
  }

  .display-img {
    width: 100%;
  }

  .profile-img {
    max-width: 120px;
    max-height: 120px;
    object-fit: cover;
    border-radius: 50%;
  }
</style>