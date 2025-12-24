<template>
  <div class="chat-view">
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
        <div class="message-bubble">
          {{ msg.content }}
        </div>
      </div>
    </div>

    <div class="input-area">
      <textarea
        v-model="userInput"
        @keydown.enter.prevent="sendMessage"
        :placeholder="$t('chat.placeholder')"
        rows="3"
      ></textarea>
      <button @click="sendMessage" :disabled="!userInput.trim()">{{ $t('chat.send') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const chatContainer = ref<HTMLElement | null>(null)

const topicId = route.params.topicId as string

// Map topicId to translation keys
const topicKeyMap: Record<string, string> = {
  'combinational-logic': 'combinational',
  'verilog-syntax': 'verilog',
  'fsm-design': 'fsm'
}

const currentTopicKey = topicKeyMap[topicId]

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
  if (!userInput.value.trim()) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: userInput.value
  })

  const userText = userInput.value
  userInput.value = ''
  await scrollToBottom()

  // Simulate AI response (placeholder)
  setTimeout(async () => {
    messages.value.push({
      role: 'assistant',
      content: t('chat.simulatedResponse', { persona: persona.value, userText })
    })
    await scrollToBottom()
  }, 1000)
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
  messages.value.push({
    role: 'assistant',
    content: t('chat.initialGreeting', { topic: topicTitle.value })
  })
}

onMounted(() => {
  addInitialGreeting()
})
</script>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

.chat-header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.header-info {
  text-align: center;
}

.header-info h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.persona {
  font-size: 0.85rem;
  color: #666;
  background: #eee;
  padding: 2px 8px;
  border-radius: 10px;
}

.back-btn, .end-session-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.back-btn {
  background: transparent;
  color: #666;
}

.back-btn:hover {
  background: #eee;
}

.end-session-btn {
  background: #e74c3c;
  color: white;
}

.end-session-btn:hover {
  background: #c0392b;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.empty-state {
  text-align: center;
  color: #999;
  margin-top: 2rem;
}

.message-wrapper {
  display: flex;
  gap: 1rem;
  max-width: 80%;
}

.message-wrapper.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-wrapper.assistant {
  align-self: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  flex-shrink: 0;
}

.user .avatar {
  background: #42b983;
  color: white;
}

.assistant .avatar {
  background: #3498db;
  color: white;
}

.message-bubble {
  padding: 1rem;
  border-radius: 12px;
  line-height: 1.5;
  position: relative;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.user .message-bubble {
  background: #42b983;
  color: white;
  border-top-right-radius: 2px;
}

.assistant .message-bubble {
  background: white;
  color: #2c3e50;
  border-top-left-radius: 2px;
}

.input-area {
  background: white;
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

textarea {
  flex: 1;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  outline: none;
}

textarea:focus {
  border-color: #42b983;
}

.input-area button {
  padding: 0 2rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.input-area button:hover {
  background: #3aa876;
}

.input-area button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
