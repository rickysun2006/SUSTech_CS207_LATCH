<template>
  <div class="topic-selection">
    <header class="header">
      <h1>{{ $t('common.latch') }}</h1>
      <p>{{ $t('common.subtitle') }}</p>
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.header p {
  color: #666;
  font-size: 1.1rem;
}

.main-content h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #34495e;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.topic-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.topic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  border-color: #42b983;
}

.topic-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.description {
  color: #666;
  margin-bottom: 1.5rem;
  flex-grow: 1;
  line-height: 1.5;
}

.persona-badge {
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  border: 1px solid #eee;
}

.persona-badge .label {
  color: #999;
  margin-right: 0.5rem;
}

.persona-badge .value {
  color: #42b983;
  font-weight: 600;
}
</style>
