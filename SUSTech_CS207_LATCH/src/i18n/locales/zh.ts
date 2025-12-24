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
      code: `assign y = a | b;
// "就用管道符！这很易读！别逼我用与非门！"`,
    },
  },
  chat: {
    teaching: '挑战：{topic}',
    student: '对手：{persona}',
    endSession: '放弃',
    startPrompt: '说服工程师修改他们的代码...',
    you: '你',
    ai: '工程师',
    placeholder: '解释为什么这是错的（例如“锁存器”、“竞争冒险”）...',
    send: '反驳',
    sessionEnded: '会话结束。你赢了吗？',
    initialGreeting: "{code}\n\n{message}",
    simulatedResponse: '[模拟 {persona} 回复] 在软件世界里，我们会优化这个。这看起来像是过时的硬件思维。说服我吧。',
  },
}
