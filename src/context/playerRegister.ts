export const playerRegister = {
  human: {
    customFields: [],
  },
  "monte-carlo": {
    customFields: [{name: "timeLimitMS", type: "number"}],
  },
  random: {
    customFields: [{name: "delayMs", type: "number"}],
  },
} as const;
