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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import { getAIResponse } from '../services/aiService'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const chatContainer = ref<HTMLElement | null>(null)
const isLoading = ref(false)

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
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-background); /* 使用全局背景色变量 */
}

/* --- 头部设计 --- */
.chat-header {
  background: rgba(255, 255, 255, 0.85); /* 如果是暗黑模式需调整这里，暂时保持明亮 */
  backdrop-filter: blur(12px);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-info h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-heading);
}

.persona {
  font-size: 0.8rem;
  color: var(--c-primary);
  background: var(--c-primary-light);
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 600;
  margin-left: 0.5rem;
}

.back-btn, .end-session-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.back-btn {
  background: transparent;
  color: var(--color-text);
}
.back-btn:hover {
  background: var(--color-border);
  color: var(--color-heading);
}

.end-session-btn {
  background: #fee2e2;
  color: #dc2626;
}
.end-session-btn:hover {
  background: #fecaca;
}

/* --- 消息区域 --- */
.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 850px; /*稍微加宽一点*/
  margin: 0 auto;
  /* 优化滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

.message-wrapper {
  display: flex;
  gap: 1rem; /* 头像和气泡的间距 */
  max-width: 90%; /* 防止消息太宽 */
  animation: fadeIn 0.25s ease-out;
  /* 关键：对其方式 */
  align-items: flex-start;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 用户消息靠右，并反转flex方向 */
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
  flex-shrink: 0; /* 关键：防止头像被挤压 */
  box-shadow: var(--shadow-sm);
}

.user .avatar {
  background: var(--c-primary); /* 使用主色调 */
  color: white;
}

.assistant .avatar {
  background: var(--c-bg-card);
  color: var(--c-primary);
  border: 1px solid var(--color-border);
}

/* --- 消息气泡核心修复 --- */
.message-bubble {
  padding: 0.8rem 1.2rem;
  border-radius: 18px;
  line-height: 1.6;
  font-size: 0.95rem;
  position: relative;

  /* 关键修复：确保文字换行，防止溢出重合 */
  word-break: break-word;
  overflow-wrap: break-word;
  /* 确保在Flex容器中能正确计算宽度 */
  min-width: 0;
  flex: 1; /* 让气泡占据剩余空间，但不超过 max-width */
}

.user .message-bubble {
  background: var(--c-primary);
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25); /* 增加一点主色调的投影 */
}

.assistant .message-bubble {
  background: var(--c-bg-card);
  color: var(--color-heading);
  border: 1px solid var(--color-border);
  border-bottom-left-radius: 4px;
  box-shadow: var(--shadow-sm);
}

/* --- 输入区域 --- */
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

/* --- Markdown Styles --- */
.markdown-body :deep(p) {
  margin-bottom: 0.8em;
}

.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(ul), .markdown-body :deep(ol) {
  margin-left: 1.5em;
  margin-bottom: 0.8em;
}

.markdown-body :deep(li) {
  margin-bottom: 0.4em;
}

.markdown-body :deep(pre) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.8em;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 0.8em;
}

.markdown-body :deep(code) {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}

.markdown-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.markdown-body :deep(h1), .markdown-body :deep(h2), .markdown-body :deep(h3) {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.3;
}

.markdown-body :deep(a) {
  color: var(--c-primary);
  text-decoration: underline;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--color-border);
  margin: 0;
  padding-left: 1em;
  color: var(--color-text);
  font-style: italic;
}
</style>
