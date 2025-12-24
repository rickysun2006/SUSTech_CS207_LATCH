import { createRouter, createWebHistory } from 'vue-router'
import TopicSelectionView from '../views/TopicSelectionView.vue'
import ChatView from '../views/ChatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TopicSelectionView,
    },
    {
      path: '/chat/:topicId',
      name: 'chat',
      component: ChatView,
    },
  ],
})

export default router
