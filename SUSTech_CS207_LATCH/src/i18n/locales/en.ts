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
    level1: {
      title: 'Level 1: The Phantom Latch',
      description: 'Combinational Logic & Incomplete if-else. Stop the software engineer from creating latches.',
      persona: 'Stubborn Software Engineer',
      initialMessage: "Why are you forcing me to write an empty `else` or default assignment? It's redundant code! If `sel` isn't 1, `out` should obviously just stay whatever it was before. That's how memory works!",
      goals: {
        identify_latch: "Identify the Latch generation",
        explain_harm: "Explain why Latches are bad",
        propose_fix: "Propose adding 'else' or default value"
      },
      code: `always @(*) begin
    if (sel == 1'b1) begin
        out = a;
    end
    // "Why write else? In C++, if I don't touch the variable, it keeps its value!"
end`,
    },
    level2: {
      title: 'Level 2: The Time-Traveler',
      description: 'Sequential Logic & Blocking vs. Non-Blocking. Explain why "immediate update" is bad.',
      persona: 'Efficiency-Obsessed C++ Dev',
      initialMessage: "Blocking assignment (`=`) is superior. It executes sequentially like a CPU instruction. Why would I use that weird `<=` arrow? I want my `current_state` to update *immediately* so the `if` check below it is valid. Waiting for the next clock edge is latency we can't afford!",
      goals: {
        identify_race: "Identify Race Condition / Order Dependency",
        explain_concurrency: "Explain Hardware Concurrency",
        propose_nba: "Propose Non-Blocking Assignment (<=)"
      },
      code: `always @(posedge clk) begin
    // "I want the state to update NOW, so the next line can use it!"
    current_state = next_state;

    // Immediate logic using the new state in the SAME cycle
    if (current_state == S_DONE) begin
        flag = 1'b1;
    end
end`,
    },
    level3: {
      title: 'Level 3: The NAND Obsession',
      description: 'Logic Gates & De Morgan\'s Laws. Prove that NAND is universal.',
      persona: 'High-Level Architect',
      initialMessage: "Refusing to use standard operators is madness. Trying to build an OR gate out of NAND gates is like starting a fire with sticks when you have a lighter. It's unreadable spaghetti code.",
      goals: {
        accept_nand: "Explain NAND Universality",
        demorgan_proof: "Provide De Morgan's Equivalent",
        implement_logic: "Implement using NAND/NOT structure"
      },
      code: `assign y = a | b;
// "Just use the pipe operator! It's readable! Stop making me use NANDs!"`,
    },
  },
  chat: {
    teaching: 'Challenge: {topic}',
    student: 'Student: {persona}',
    you: 'You',
    ai: 'AI',
    placeholder: 'Explain the concept...',
    send: 'Send',
    endSession: 'End Session',
    sessionEnded: 'Session ended.',
    startPrompt: 'Start teaching {topic}!',
    progress: 'Persuasion Progress',
    goals: 'Goals',
    successTitle: 'Challenge Completed!',
    successMessage: 'Congratulations! You have successfully persuaded the stubborn engineer.',
    initialGreeting: "```verilog\n{code}\n```\n\n{message}",
    hiddenGoal: "???"
  }
};

