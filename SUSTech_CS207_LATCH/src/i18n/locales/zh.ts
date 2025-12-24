export default {
  common: {
    latch: 'LATCH',
    subtitle: '硬件概念教学学习代理',
    back: '返回',
    loading: '加载中...',
  },
  home: {
    selectTopic: '选择一个主题进行教学',
    studentPersona: '学生角色：',
  },
  topics: {
    combinational: {
      title: '组合逻辑',
      description: '讲解基本门电路、布尔代数和电路化简。',
      persona: '困惑的新手',
    },
    verilog: {
      title: 'Verilog 语法',
      description: '帮助调试代码并解释阻塞与非阻塞赋值。',
      persona: 'Bug 频出的程序员',
    },
    fsm: {
      title: 'FSM 设计',
      description: '讨论状态机、状态转换和最佳实践。',
      persona: '怀疑论者',
    },
  },
  chat: {
    teaching: '教学主题：{topic}',
    student: '学生：{persona}',
    endSession: '结束会话',
    startPrompt: '开始讲解 {topic} 的概念...',
    you: '你',
    ai: 'AI',
    placeholder: '在此输入你的讲解...',
    send: '发送',
    sessionEnded: '会话已结束。评估报告将在此处生成。',
    initialGreeting: '你好！我想学习关于 {topic} 的知识，但我有点困惑。你能帮我理解它吗？',
    simulatedResponse: '[模拟 {persona} 回复] 我不太明白 "{userText}" 是什么意思。你能换个说法解释一下吗？',
  },
}
