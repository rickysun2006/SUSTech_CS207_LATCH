# LATCH 项目设计思路文档 (Design Document)

**项目名称**: SUSTech_CS207_LATCH (Learning Agent for Teaching Concepts in Hardware)  
**项目性质**: CS207 数字逻辑课程 Bonus Project / 辅助教学工具创新  
**核心理念**: 费曼学习法 (Feynman Technique) + 苏格拉底式提问 (Socratic Questioning)

---

## 1. 项目背景与动机 (Motivation)

### 痛点分析
在 CS207 数字逻辑课程的学习中，学生常面临以下挑战：
* **概念抽象**: 如时序逻辑中的 Setup/Hold Time，仅靠听讲难以构建直观物理模型。
* **知行脱节**: 能做对题，但在 Verilog 实践或 Debug 时无法解释底层原理。
* **被动接收**: 传统的“Lecture + Homework”模式下，学生缺乏主动重构知识的机会。

### 解决方案
LATCH 平台通过**翻转角色**，让学生扮演“助教”，向由 LLM 驱动的“虚拟新手”讲解核心概念。通过“以教代学”，迫使学生将模糊的知识显性化、逻辑化。

---

## 2. 教学法理论基础 (Pedagogical Foundation)

本项目并非单纯的 AI 聊天机器人，而是基于以下两种教育心理学理论的深度实践：

1.  **费曼学习法 (The Feynman Technique)**:
    * *核心*: 如果你不能简单地解释它，你就没有真正理解它。
    * *应用*: 学生必须用自然语言向 AI 解释复杂的逻辑电路，AI 的“听不懂”会倒逼学生简化语言、查漏补缺。

2.  **苏格拉底式提问 (Socratic Questioning)**:
    * *核心*: 不直接给出答案，而是通过连续的追问引导对方发现真理或谬误。
    * *应用*: AI 不会直接纠正学生的错误，而是像苏格拉底一样提问：“如果 Enable 信号在这里是高电平，那输出真的会立刻变化吗？”从而引导学生自我纠错。

---

## 3. 核心交互流程 (Core Interaction Loop)

系统的核心是一个闭环的交互过程：

1.  **选择模块 (Topic Selection)**: 学生选择特定知识点（如：Karnaugh Map, FSM, Flip-Flops）。
2.  **情境注入 (Context Injection)**: 系统加载特定的 System Prompt，设定 AI 的“困惑点”和“性格”。
3.  **教学对话 (Teaching Phase)**:
    * 学生输入解释。
    * AI 根据设定，提出具有误导性或深度的追问（模拟常见 Misconception）。
    * 学生尝试澄清，直到 AI 表示“理解”或“顿悟”。
4.  **评估与反馈 (Evaluation Phase)**:
    * 对话结束后，后台的 **Judge Agent** 介入。
    * 生成分析报告：评分维度包括“逻辑清晰度”、“概念准确性”、“对边缘情况的覆盖”。

---

## 4. 拟定功能模块与 AI 人设 (AI Personas)

为了覆盖 CS207 的不同侧面，我们将设计不同的 AI 模式：

| 模式名称 | AI 人设特征 | 针对知识点示例 |
| :--- | :--- | :--- |
| **The Confused Novice (困惑新手)** | 概念混淆，死抠字眼，无法建立直觉 | 组合逻辑, 补码运算, 布尔代数 |
| **The Buggy Coder (Bug 制造者)** | 会写代码但逻辑错误，混淆阻塞/非阻塞赋值 | Verilog 语法, 时序逻辑, 竞争冒险 |
| **The Skeptic (杠精/怀疑论者)** | 质疑最佳实践，问“为什么不能这样做？” | FSM 状态机设计, 流水线设计 |

---

## 5. 技术架构 (Technical Architecture)

本项目采用轻量级、现代化的 Web 架构，确保易于部署和维护：

* **Frontend**: Next.js (React) + Tailwind CSS
    * *特点*: 响应式设计，提供类似 ChatGPT 的沉浸式对话体验。
* **AI Orchestration**:
    * *Model*: OpenAI GPT-4o / GPT-4o-mini (通过 API 调用)。
    * *Prompt Engineering*: 核心资产。包含针对 CS207 教学大纲定制的 System Prompts 库。
* **Evaluation Engine**:
    * 独立的一个 LLM 调用，输入为用户的对话记录，输出为 JSON 格式的评分报告。

---

## 6. 预期成果与价值 (Expected Value)

1.  **对于学生**: 提供了一个无压力的“费曼技巧”演练场，强化对 CS207 核心概念的理解。
2.  **对于课程**: 积累一套“学生常见误区库”（通过分析学生无法向 AI 解释清楚的点），反向辅助老师调整教学重点。
3.  **对于 EdTech**: 探索了 Generative AI 在“反向教学”场景下的应用范式。