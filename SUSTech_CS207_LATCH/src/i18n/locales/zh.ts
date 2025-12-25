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
    level1: {
      title: '第一关：幽灵锁存器',
      description: '组合逻辑与不完整的 if-else。阻止软件工程师生成锁存器。',
      persona: '固执的软件工程师',
      initialMessage: "为什么要强迫我写一个空的 `else` 或者默认赋值？这是冗余代码！如果 `sel` 不是 1，`out` 显然应该保持原来的值。内存就是这么工作的！",
      goals: {
        identify_latch: "指出代码生成了锁存器 (Latch)",
        explain_harm: "解释锁存器的危害",
        propose_fix: "提议添加 'else' 或默认赋值"
      },
      code: `always @(*) begin
    if (sel == 1'b1) begin
        out = a;
    end
    // "为什么要写 else？在 C++ 里，如果我不动变量，它就保持原值！"
end`,
    },
    level2: {
      title: '第二关：时空穿梭者',
      description: '时序逻辑与阻塞 vs 非阻塞赋值。解释为什么“立即更新”是坏事。',
      persona: '效率至上的 C++ 开发者',
      initialMessage: "阻塞赋值 (`=`) 更优越。它像 CPU 指令一样顺序执行。我为什么要用那个奇怪的 `<=` 箭头？我要我的 `current_state` *立即*更新，这样下面的 `if` 检查才有效。等待下一个时钟沿是我们无法承受的延迟！",
      goals: {
        identify_race: "指出竞争冒险 / 顺序依赖问题",
        explain_concurrency: "解释硬件的并发性",
        propose_nba: "提议使用非阻塞赋值 (<=)"
      },
      code: `always @(posedge clk) begin
    // "我要状态现在就更新，这样下一行就能用了！"
    current_state = next_state;

    // 在同一个周期内使用新状态的立即逻辑
    if (current_state == S_DONE) begin
        flag = 1'b1;
    end
end`,
    },
    level3: {
      title: '第三关：与非门的执念',
      description: '逻辑门与德摩根定律。证明 NAND 是万能的。',
      persona: '高层架构师',
      initialMessage: "拒绝使用标准操作符是疯狂的。试图用与非门构建或门就像有打火机却非要钻木取火。这是不可读的面条代码。",
      goals: {
        accept_nand: "解释 NAND 的通用性",
        demorgan_proof: "提供德摩根定律等价式",
        implement_logic: "使用 NAND/NOT 结构实现"
      },
      code: `assign y = a | b;
// "就用管道符！这很易读！别逼我用与非门！"`,
    },
  },
  chat: {
    teaching: '挑战：{topic}',
    student: '学生：{persona}',
    you: '你',
    ai: 'AI',
    placeholder: '解释概念...',
    send: '发送',
    endSession: '结束会话',
    sessionEnded: '会话已结束。',
    startPrompt: '开始教学 {topic}！',
    progress: '说服进度',
    goals: '说服目标',
    successTitle: '挑战完成！',
    successMessage: '恭喜！你成功说服了这位固执的工程师。',
    initialGreeting: "```verilog\n{code}\n```\n\n{message}",
    hiddenGoal: "???"
  }
};

