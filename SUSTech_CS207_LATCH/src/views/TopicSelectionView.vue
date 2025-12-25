<template>
  <div class="topic-selection">
    <header class="header">
      <h1>{{ $t('common.latch') }}</h1>
      <p>{{ $t('common.subtitle') }}</p>
      
      <div class="api-key-section">
        <input 
          type="password" 
          v-model="apiKeyInput" 
          placeholder="Enter Google Gemini API Key"
          class="api-key-input"
          @change="saveApiKey"
        />
        <span v-if="isKeySaved" class="saved-indicator">✓ Saved</span>
      </div>
    </header>

    <main class="main-content">
      <h2>{{ $t('home.selectTopic') }}</h2>
      <div class="topic-grid">
        <div
          v-for="topic in topics"
          :key="topic.id"
          class="topic-card"
          @click="selectTopic(topic.id)"
        >
          <h3>{{ topic.title }}</h3>
          <p class="description">{{ topic.description }}</p>
          <div class="persona-badge">
            <span class="label">{{ $t('home.studentPersona') }}</span>
            <span class="value">{{ topic.persona }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '../stores/settings'

const router = useRouter()
const { t } = useI18n()
const settingsStore = useSettingsStore()

const apiKeyInput = ref('')
const isKeySaved = ref(false)

onMounted(() => {
  apiKeyInput.value = settingsStore.apiKey
})

const saveApiKey = () => {
  settingsStore.setApiKey(apiKeyInput.value)
  isKeySaved.value = true
  setTimeout(() => {
    isKeySaved.value = false
  }, 2000)
}

const topics = computed(() => [
  {
    id: 'level-1',
    title: t('topics.level1.title'),
    description: t('topics.level1.description'),
    persona: t('topics.level1.persona')
  },
  {
    id: 'level-2',
    title: t('topics.level2.title'),
    description: t('topics.level2.description'),
    persona: t('topics.level2.persona')
  },
  {
    id: 'level-3',
    title: t('topics.level3.title'),
    description: t('topics.level3.description'),
    persona: t('topics.level3.persona')
  }
])

const selectTopic = (id: string) => {
  router.push({ name: 'chat', params: { topicId: id } })
}
</script>

<style scoped>
.topic-selection {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  align-items: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%); /* 细微背景渐变 */
}

.header {
  text-align: center;
  margin-bottom: 4rem;
  max-width: 600px;
}

.header h1 {
  font-size: 3rem;
  font-weight: 800;
  color: var(--c-text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
  background: linear-gradient(to right, var(--c-primary), #ec4899); /* 标题渐变色 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header p {
  color: var(--c-text-secondary);
  font-size: 1.25rem;
}

.api-key-section {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.api-key-input {
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  width: 300px;
  background: rgba(255, 255, 255, 0.8);
  font-family: monospace;
  transition: all 0.3s;
}

.api-key-input:focus {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px var(--c-primary-light);
  outline: none;
}

.saved-indicator {
  color: #10b981;
  font-weight: 600;
  font-size: 0.9rem;
  animation: fadeIn 0.3s;
}

.main-content {
  width: 100%;
  max-width: 1000px;
}

.main-content h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--c-text-secondary);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.topic-card {
  background: var(--c-bg-card);
  border-radius: var(--radius-lg);
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* 顶部装饰条 */
.topic-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--c-primary);
  opacity: 0;
  transition: opacity 0.3s;
}

.topic-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.topic-card:hover::before {
  opacity: 1;
}

.topic-card h3 {
  color: var(--c-text-primary);
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.description {
  color: var(--c-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
  flex-grow: 1;
}

.persona-badge {
  background: #f1f5f9;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
}

.persona-badge .label {
  color: var(--c-text-secondary);
}

.persona-badge .value {
  color: var(--c-primary);
  font-weight: 600;
  background: #e0e7ff;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
