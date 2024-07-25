<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { onBeforeMount, onMounted, watch, watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/store'
import { apiUrl, pass } from './lib'
import { storeToRefs } from 'pinia'

const router = useRouter()

const store = useStore()

const { state } = storeToRefs(store)

const isLoading = ref<boolean>(true)

// const testLoading = ref<boolean>(true)

watch(
  state.value,
  () => {
    // if (oldState.loading !== newState.loading) {
    isLoading.value = state.value.loading
    // }
  },
  { deep: true }
)

onMounted(() => {
  console.log(state.value.loading, 'mounted')
  if (!state.value.loading) {
    isLoading.value = false
  }
})
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <!-- progress bar -->
  <div class="progress-container">
    <div class="progress" :class="state.awating ? 'await' : ''"></div>
  </div>
  <!-- loader component -->
  <div v-if="isLoading">
    <div
      class="fixed min-h-screen flex justify-center items-center w-full bg-secondry"
      style="z-index: 999"
    >
      <div class="sk-wandering-cubes">
        <div class="sk-cube sk-cube-1"></div>
        <div class="sk-cube sk-cube-2"></div>
      </div>
    </div>
  </div>
  <!-- /loader component -->
  <div class="bg-secondry min-h-screen">
    <RouterView />
  </div>
</template>

<style scoped>
.progress-container {
  max-width: '100vw';
  overflow: 'hidden';
}
.progress.await {
  animation: animat-bg 2s linear infinite;
  -webkit-animation: animat-bg 2s linear infinite;
  -moz-animation: animate-bg 2s linear infinite;
  background-image: linear-gradient(90deg, #8abbff, transparent, #8abbff);
}

.progress {
  background-size: 200% 100%;
  background-color: #383e47;
  height: 3px;
  width: 100%;
  max-width: '100vw';
}

@keyframes animate-bg {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 100% 0%;
  }

  100% {
    background-position: 0% 0%;
  }
}

@-webkit-keyframes animate-bg {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 100% 0%;
  }

  100% {
    background-position: 0% 0%;
  }
}

@-moz-keyframes animate-bg {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 100% 0%;
  }

  100% {
    background-position: 0% 0%;
  }
}

.sk-wandering-cubes {
  width: 4em;
  height: 4em;
  position: relative;
  margin: auto;
}

.sk-wandering-cubes .sk-cube {
  background-color: #337ab7;
  width: 1em;
  height: 1em;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-animation: sk-wandering-cubes 1.8s ease-in-out -1.8s infinite both;
  animation: sk-wandering-cubes 1.8s ease-in-out -1.8s infinite both;
}

.sk-wandering-cubes .sk-cube-2 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

@-webkit-keyframes sk-wandering-cubes {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: translateX(2em) rotate(-90deg) scale(0.5);
  }

  50% {
    /* Hack to make FF rotate in the right direction */
    transform: translateX(2em) translateY(2em) rotate(-179deg);
  }

  50.1% {
    transform: translateX(2em) translateY(2em) rotate(-180deg);
  }

  75% {
    transform: translateX(0) translateY(2em) rotate(-270deg) scale(0.5);
  }

  100% {
    transform: rotate(-360deg);
  }
}

@keyframes sk-wandering-cubes {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: translateX(2em) rotate(-90deg) scale(0.5);
  }

  50% {
    /* Hack to make FF rotate in the right direction */
    transform: translateX(2em) translateY(2em) rotate(-179deg);
  }

  50.1% {
    transform: translateX(2em) translateY(2em) rotate(-180deg);
  }

  75% {
    transform: translateX(0) translateY(2em) rotate(-270deg) scale(0.5);
  }

  100% {
    transform: rotate(-360deg);
  }
}
</style>
