<script setup lang="ts">
import { RouterView } from 'vue-router'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
</script>

<template>
  <div class="app-container">
    <div class="global-lang-switch">
      <LanguageSwitcher />
    </div>
    <RouterView />
  </div>
</template>

<style>
/* Global styles can go here or in assets/main.css */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.global-lang-switch {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
}
</style>
