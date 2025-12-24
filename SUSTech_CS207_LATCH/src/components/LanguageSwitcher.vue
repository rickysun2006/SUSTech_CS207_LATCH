<template>
  <div class="language-switcher">
    <select v-model="$i18n.locale">
      <option value="en">English</option>
      <option value="zh">简体中文</option>
    </select>
  </div>
</template>

<script setup lang="ts">
// No script needed for simple binding
</script>

<style scoped>
.language-switcher select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.language-switcher select:focus {
  outline: none;
  border-color: #42b983;
}
</style>
