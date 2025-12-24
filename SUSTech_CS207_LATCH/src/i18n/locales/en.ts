export default {
  common: {
    latch: 'LATCH',
    subtitle: 'Learning Agent for Teaching Concepts in Hardware',
    back: 'Back',
    loading: 'Loading...',
  },
  home: {
    selectTopic: 'Select a Topic to Teach',
    studentPersona: 'Student Persona:',
  },
  topics: {
    combinational: {
      title: 'Combinational Logic',
      description: 'Explain basic gates, boolean algebra, and circuit minimization.',
      persona: 'The Confused Novice',
    },
    verilog: {
      title: 'Verilog Syntax',
      description: 'Help debug code and explain blocking vs non-blocking assignments.',
      persona: 'The Buggy Coder',
    },
    fsm: {
      title: 'FSM Design',
      description: 'Discuss state machines, transitions, and best practices.',
      persona: 'The Skeptic',
    },
  },
  chat: {
    teaching: 'Teaching: {topic}',
    student: 'Student: {persona}',
    endSession: 'End Session',
    startPrompt: 'Start by explaining the concept of {topic}...',
    you: 'You',
    ai: 'AI',
    placeholder: 'Type your explanation here...',
    send: 'Send',
    sessionEnded: 'Session ended. Evaluation report would be generated here.',
    initialGreeting: "Hi! I'm trying to learn about {topic}, but I'm a bit confused. Can you help me understand it?",
    simulatedResponse: '[Simulated {persona} Response] I\'m not sure I understand "{userText}". Can you explain it differently?',
  },
}
