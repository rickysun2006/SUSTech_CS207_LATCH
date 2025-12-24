# LATCH Project Design Document

**Project Name**: SUSTech_CS207_LATCH (Learning Agent for Teaching Concepts in Hardware)  
**Type**: CS207 Digital Logic Bonus Project / EdTech Innovation  
**Core Philosophy**: The Feynman Technique + Socratic Questioning

---

## 1. Motivation & Background

### Pain Point Analysis
Students in CS207 (Digital Logic) often face several challenges:
* **Abstract Concepts**: Topics like Setup/Hold Time in sequential logic are difficult to visualize without a physical model.
* **Theory-Practice Gap**: Students may solve exam problems correctly but struggle to explain the underlying principles during Verilog implementation or debugging.
* **Passive Learning**: The traditional "Lecture + Homework" model often lacks opportunities for active knowledge reconstruction.

### Solution
LATCH introduces a **role-reversal** platform where the student acts as the "Teaching Assistant," explaining core concepts to an AI-driven "Virtual Novice." By "learning through teaching," students are compelled to externalize and structure their implicit knowledge.

---

## 2. Pedagogical Foundation

This project goes beyond a standard AI chatbot by deeply integrating two educational psychology theories:

1.  **The Feynman Technique**:
    * *Core*: If you can't explain it simply, you don't understand it well enough.
    * *Application*: Students must explain complex logic circuits in natural language. The AI's simulated "confusion" forces the student to simplify their language and identify gaps in their understanding.

2.  **Socratic Questioning**:
    * *Core*: Rather than providing answers, the teacher uses disciplined questioning to guide the learner to truth or to reveal contradictions.
    * *Application*: The AI does not directly correct the student. Instead, it asks probing questions (e.g., "If the Enable signal is high here, does the output really change immediately?"), guiding the student toward self-correction.

---

## 3. Core Interaction Loop

The system operates on a closed-loop interaction model:

1.  **Topic Selection**: The student selects a specific module (e.g., Karnaugh Map, FSM, Flip-Flops).
2.  **Context Injection**: The system loads a specific System Prompt, defining the AI's "confusion points" and "persona."
3.  **Teaching Phase**:
    * The student provides an explanation.
    * The AI, based on its settings, asks misleading or deep questions (simulating common student misconceptions).
    * The student attempts to clarify until the AI indicates "understanding" or an "Aha moment."
4.  **Evaluation Phase**:
    * Upon completion, a background **Judge Agent** is triggered.
    * It generates an analysis report, scoring dimensions such as "Logical Clarity," "Conceptual Accuracy," and "Edge Case Coverage."

---

## 4. AI Personas & Modules

To cover different aspects of the CS207 curriculum, we will design distinct AI modes:

| Mode Name | AI Persona Characteristics | Target Topic Examples |
| :--- | :--- | :--- |
| **The Confused Novice** | Confuses concepts, focuses on trivial details, lacks intuition | Combinational Logic, Two's Complement, Boolean Algebra |
| **The Buggy Coder** | Writes code but with logical errors; confuses Blocking/Non-blocking assignments | Verilog Syntax, Sequential Logic, Race Conditions |
| **The Skeptic** | Questions best practices; asks "Why can't I do it this way?" | FSM Design, Pipelining |

---

## 5. Technical Architecture

The project utilizes a lightweight, modern Web architecture for easy deployment and maintenance:

* **Frontend**: Next.js (React) + Tailwind CSS
    * *Feature*: Responsive design providing an immersive, ChatGPT-like conversation experience.
* **AI Orchestration**:
    * *Model*: OpenAI GPT-4o / GPT-4o-mini (via API).
    * *Prompt Engineering*: The core asset. Contains a library of System Prompts customized for the CS207 syllabus.
* **Evaluation Engine**:
    * An independent LLM call that takes the conversation history as input and outputs a scoring report in JSON format.

---

## 6. Expected Value

1.  **For Students**: Provides a low-pressure sandbox for practicing the Feynman Technique, reinforcing understanding of core CS207 concepts.
2.  **For the Course**: Accumulates a "Database of Common Misconceptions" (by analyzing points where students fail to explain clearly to the AI), helping instructors adjust teaching focus.
3.  **For EdTech**: Explores the paradigm of Generative AI in "Reverse Teaching" scenarios.

---

### Next Steps
1.  **GitHub Repo Initialization**: Complete the `README.md`.
2.  **Prompt Prototyping**: Manually test the "Simulated Novice" prompts in ChatGPT.
3.  **MVP Development**: Build a minimal web interface to enable a full dialogue loop for one specific topic (e.g., D Flip-Flop).