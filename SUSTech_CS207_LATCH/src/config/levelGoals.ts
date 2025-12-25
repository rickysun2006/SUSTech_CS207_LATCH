export interface LevelGoal {
  id: string;
  judgePrompt: string; // Description for the AI Judge
  i18nKey: string; // Key for UI translation
}

export const LEVEL_GOALS: Record<string, LevelGoal[]> = {
  'level-1': [
    {
      id: 'identify_latch',
      judgePrompt: "The user must explicitly identify that the code generates a 'Latch' (or 'Phantom Latch').",
      i18nKey: 'topics.level1.goals.identify_latch'
    },
    {
      id: 'explain_harm',
      judgePrompt: "The user must explain why Latches are undesirable in combinational logic (e.g., timing issues, unpredictability, not pure combinational).",
      i18nKey: 'topics.level1.goals.explain_harm'
    },
    {
      id: 'propose_fix',
      judgePrompt: "The user must propose a valid fix: adding an 'else' branch or a default assignment at the beginning.",
      i18nKey: 'topics.level1.goals.propose_fix'
    }
  ],
  'level-2': [
    {
      id: 'identify_race',
      judgePrompt: "The user must identify that using blocking assignment (=) causes race conditions or order-dependency issues.",
      i18nKey: 'topics.level2.goals.identify_race'
    },
    {
      id: 'explain_concurrency',
      judgePrompt: "The user must explain that hardware is concurrent/parallel, unlike sequential software execution.",
      i18nKey: 'topics.level2.goals.explain_concurrency'
    },
    {
      id: 'propose_nba',
      judgePrompt: "The user must propose using non-blocking assignment (<=) for sequential logic.",
      i18nKey: 'topics.level2.goals.propose_nba'
    }
  ],
  'level-3': [
    {
      id: 'accept_nand',
      judgePrompt: "The user must explain that NAND is a universal gate or that structural constraints are sometimes necessary.",
      i18nKey: 'topics.level3.goals.accept_nand'
    },
    {
      id: 'demorgan_proof',
      judgePrompt: "The user must provide the De Morgan equivalent for OR: ~(~a & ~b) or NOT(NOT a AND NOT b).",
      i18nKey: 'topics.level3.goals.demorgan_proof'
    },
    {
      id: 'implement_logic',
      judgePrompt: "The user must convince the AI to implement the logic using the NAND/AND/NOT structure.",
      i18nKey: 'topics.level3.goals.implement_logic'
    }
  ]
};
