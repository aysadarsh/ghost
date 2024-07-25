<script setup lang="ts">
const props = defineProps<{ closeModal: Function }>()
</script>

<template>
  <div class="flex justify-center mt-8">
    <button
      type="submit"
      className="flex bg-blue-600 text-white p-2 px-4 rounded-md shadow-md me-2"
    >
      Submit
    </button>
    <button
      type="button"
      className="flex bg-orange-600 text-white p-2 px-4 rounded-md shadow-md"
      @click="closeModal"
    >
      Close
    </button>
  </div>
</template>
