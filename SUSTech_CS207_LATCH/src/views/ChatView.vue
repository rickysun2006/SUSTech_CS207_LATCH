<template>
  <div class="chat-view">
    <div class="sidebar">
      <div class="progress-section">
        <h3>{{ $t('chat.progress') }}</h3>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <span class="progress-text">{{ Math.round(progressPercentage) }}%</span>
      </div>

      <div class="goals-list">
        <h4>{{ $t('chat.goals') }}</h4>
        <ul>
          <li v-for="goal in levelGoals" :key="goal.id" :class="{ completed: satisfiedGoals.includes(goal.id) }">
            <span class="status-icon">{{ satisfiedGoals.includes(goal.id) ? '✅' : '⚪' }}</span>
            <span>{{ satisfiedGoals.includes(goal.id) ? $t(goal.i18nKey) : $t('chat.hiddenGoal') }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-chat-area">
      <header class="chat-header">
        <button @click="goBack" class="back-btn">← {{ $t('common.back') }}</button>
        <div class="header-info">
          <h2>{{ $t('chat.teaching', { topic: topicTitle }) }}</h2>
          <span class="persona">{{ $t('chat.student', { persona: persona }) }}</span>
        </div>
        <button class="end-session-btn" @click="endSession">{{ $t('chat.endSession') }}</button>
      </header>

      <div class="chat-container" ref="chatContainer">
        <div v-if="messages.length === 0" class="empty-state">
          <p>{{ $t('chat.startPrompt', { topic: topicTitle }) }}</p>
        </div>

        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message-wrapper"
          :class="msg.role"
        >
          <div class="avatar">
            {{ msg.role === 'user' ? $t('chat.you') : $t('chat.ai') }}
          </div>
          <div class="message-bubble" v-if="msg.role === 'user'">
            {{ msg.content }}
          </div>
          <div class="message-bubble markdown-body" v-else v-html="renderMarkdown(msg.content)"></div>
        </div>
      </div>

      <div class="input-area">
        <textarea
          v-model="userInput"
          @keydown.enter.prevent="sendMessage"
          :placeholder="$t('chat.placeholder')"
          rows="3"
        ></textarea>
        <button @click="sendMessage" :disabled="!userInput.trim() || isLoading">
          {{ isLoading ? $t('common.loading') : $t('chat.send') }}
        </button>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <h2>🎉 {{ $t('chat.successTitle') }}</h2>
        <p>{{ $t('chat.successMessage') }}</p>
        <button @click="goBack">{{ $t('common.back') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import { getAIResponse, evaluateProgress } from '../services/aiService'
import { LEVEL_GOALS } from '../config/levelGoals'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const chatContainer = ref<HTMLElement | null>(null)
const isLoading = ref(false)
const satisfiedGoals = ref<string[]>([])
const showSuccessModal = ref(false)

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  typographer: true
})

const renderMarkdown = (text: string) => {
  return md.render(text)
}

const topicId = route.params.topicId as string

// Map topicId to translation keys
const topicKeyMap: Record<string, string> = {
  'level-1': 'level1',
  'level-2': 'level2',
  'level-3': 'level3'
}

const currentTopicKey = topicKeyMap[topicId]
const levelGoals = computed(() => LEVEL_GOALS[topicId] || [])

const progressPercentage = computed(() => {
  if (levelGoals.value.length === 0) return 0
  return (satisfiedGoals.value.length / levelGoals.value.length) * 100
})

const topicTitle = computed(() => currentTopicKey ? t(`topics.${currentTopicKey}.title`) : 'Unknown Topic')
const persona = computed(() => currentTopicKey ? t(`topics.${currentTopicKey}.persona`) : 'Unknown')

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([])
const userInput = ref('')

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: userInput.value
  })

  const userText = userInput.value
  userInput.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    // Call AI Service
    const aiResponse = await getAIResponse(topicId, messages.value)

    messages.value.push({
      role: 'assistant',
      content: aiResponse || '...'
    })

    // Evaluate Progress in background
    evaluateProgress(topicId, messages.value).then((goals) => {
      satisfiedGoals.value = goals
      if (progressPercentage.value >= 100) {
        showSuccessModal.value = true
      }
    })

  } catch (e) {
    messages.value.push({
      role: 'assistant',
      content: '[Connection Error] The engineer is ignoring you.'
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const goBack = () => {
  router.push('/')
}

const endSession = () => {
  alert(t('chat.sessionEnded'))
  router.push('/')
}

// Clear messages when language changes to avoid mixed language content (optional, but cleaner for demo)
watch(locale, () => {
  messages.value = []
  addInitialGreeting()
})

const addInitialGreeting = () => {
  if (!currentTopicKey) return

  const code = t(`topics.${currentTopicKey}.code`)
  const message = t(`topics.${currentTopicKey}.initialMessage`)

  messages.value.push({
    role: 'assistant',
    content: t('chat.initialGreeting', { code, message })
  })
}

onMounted(() => {
  addInitialGreeting()
})
</script>

<style scoped>
.chat-view {
  display: flex;
  height: 100vh;
  background: var(--c-bg-soft);
  position: relative;
}

/* --- Sidebar Styles --- */
.sidebar {
  width: 300px;
  background: var(--c-bg-card);
  border-right: 1px solid var(--color-border);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
}

.progress-section h3, .goals-list h4 {
  margin-bottom: 1rem;
  color: var(--c-text-primary);
}

.progress-bar-container {
  width: 100%;
  height: 12px;
  background: var(--c-bg-soft);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--c-primary), #ec4899);
  transition: width 0.5s ease-out;
}

.progress-text {
  font-size: 0.9rem;
  color: var(--c-text-secondary);
  font-weight: bold;
  float: right;
}

.goals-list ul {
  list-style: none;
  padding: 0;
}

.goals-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  color: var(--c-text-secondary);
  line-height: 1.4;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s;
}

.goals-list li.completed {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  font-weight: 500;
}

.status-icon {
  font-size: 1rem;
}

/* --- Main Chat Area --- */
.main-chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.chat-header {
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--c-text-secondary);
  cursor: pointer;
  font-weight: 600;
  transition: color 0.2s;
}

.back-btn:hover {
  color: var(--c-primary);
}

.header-info {
  text-align: center;
}

.header-info h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--c-text-primary);
  margin: 0;
}

.persona {
  font-size: 0.85rem;
  color: var(--c-text-secondary);
  background: var(--c-bg-soft);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  margin-top: 0.2rem;
  display: inline-block;
}

.end-session-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}

.end-session-btn:hover {
  background: #dc2626;
}

.chat-container {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  scroll-behavior: smooth;
}

.empty-state {
  text-align: center;
  color: var(--c-text-secondary);
  margin-top: 4rem;
  font-style: italic;
}

.message-wrapper {
  display: flex;
  gap: 1rem;
  max-width: 80%;
  animation: fadeIn 0.25s ease-out;
  align-items: flex-start;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-wrapper.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.user .avatar {
  background: var(--c-primary);
  color: white;
}

.assistant .avatar {
  background: var(--c-bg-card);
  color: var(--c-primary);
  border: 1px solid var(--color-border);
}

.message-bubble {
  padding: 0.8rem 1.2rem;
  border-radius: 18px;
  line-height: 1.6;
  font-size: 0.95rem;
  position: relative;
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  flex: 1;
}

.user .message-bubble {
  background: var(--c-primary);
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

.assistant .message-bubble {
  background: var(--c-bg-card);
  color: var(--color-heading);
  border: 1px solid var(--color-border);
  border-bottom-left-radius: 4px;
  box-shadow: var(--shadow-sm);
}

.input-area {
  background: transparent;
  padding: 1.5rem;
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  position: relative;
}

textarea {
  width: 100%;
  padding: 1rem 4rem 1rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 28px;
  background: var(--c-bg-card);
  box-shadow: var(--shadow-md);
  color: var(--color-heading);
  font-family: inherit;
  font-size: 1rem;
  resize: none;
  transition: all 0.3s;
  outline: none;
}

textarea:focus {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px var(--c-primary-light), var(--shadow-lg);
}

.input-area button {
  position: absolute;
  right: 2.2rem;
  bottom: 2.2rem;
  padding: 0.6rem 1.2rem;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}

.input-area button:hover {
  background: var(--c-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.input-area button:disabled {
  background: var(--color-text);
  opacity: 0.5;
  transform: none;
  cursor: not-allowed;
  box-shadow: none;
}

/* --- Modal Styles --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-content h2 {
  color: var(--c-primary);
  margin-bottom: 1rem;
}

.modal-content p {
  color: var(--c-text-secondary);
  margin-bottom: 1.5rem;
}

.modal-content button {
  background: var(--c-primary);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-content button:hover {
  background: var(--c-primary-hover);
}

/* --- Markdown Styles --- */
.markdown-body :deep(p) {
  margin-bottom: 0.8em;
}

.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(ul), .markdown-body :deep(ol) {
  margin-left: 1.5em;
}
</style>
