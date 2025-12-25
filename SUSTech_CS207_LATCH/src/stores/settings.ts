import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  const apiKey = ref(localStorage.getItem('latch_api_key') || '')

  function setApiKey(key: string) {
    apiKey.value = key
    localStorage.setItem('latch_api_key', key)
  }

  return { apiKey, setApiKey }
})
