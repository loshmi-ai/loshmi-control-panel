import { feature, item, plan } from "atmn";

const LOSHMI_ONE_PLAN_ID = "loshmi_one";
const LOSHMI_ONE_BYOK_PLAN_ID = "loshmi_one_byok";

export const freeAgentSubdomain = feature({
  id: "free_agent_subdomain",
  name: "Free agent subdomain: {username}.agent.loshmi.com",
  type: "boolean",
});

export const agentCustomDomains = feature({
  id: "agent_custom_domains",
  name: "Custom domain support",
  type: "boolean",
});

export const browserUse = feature({
  id: "fair_browser_use",
  name: "Fair browser usage",
  type: "boolean",
});

export const byokAiProviders = feature({
  id: "byok_ai_providers",
  name: "Use your own AI API key or subscription",
  type: "boolean",
});

export const cpuCore = feature({
  id: "cpu_core",
  name: "Dedicated CPU core(s)",
  type: "metered",
  consumable: false,
});

export const memoryGb = feature({
  id: "memory_gb",
  name: "GB memory",
  type: "metered",
  consumable: false,
});

export const storageGb = feature({
  id: "storage_gb",
  name: "GB storage",
  type: "metered",
  consumable: false,
});

export const aiCredits = feature({
  id: "ai_credits",
  name: "$ AI credits",
  type: "ai_credit_system",
  defaultMarkup: 0.05,
});

export const extraAiCredits = feature({
  id: "extra_ai_credits",
  name: "Buy additional AI credits in the admin panel at 5% markup",
  type: "boolean",
});

export const loshmiOne = plan({
  id: LOSHMI_ONE_PLAN_ID,
  name: "Loshmi One",
  price: {
    amount: 19.99,
    interval: "month",
  },
  group: "loshmi-main",
  items: [
    item({
      featureId: aiCredits.id,
      included: 10,
      reset: { interval: "month" },
    }),
    item({ featureId: cpuCore.id, included: 1 }),
    item({ featureId: memoryGb.id, included: 2 }),
    item({ featureId: storageGb.id, included: 40 }),
    item({ featureId: browserUse.id }),
    item({ featureId: extraAiCredits.id }),
    item({ featureId: byokAiProviders.id }),
    item({ featureId: freeAgentSubdomain.id }),
    item({ featureId: agentCustomDomains.id }),
  ],
});

export const loshmiOneByok = plan({
  id: LOSHMI_ONE_BYOK_PLAN_ID,
  name: "Loshmi One BYOK",
  price: {
    amount: 9.99,
    interval: "month",
  },
  group: "loshmi-main",
  items: [
    item({ featureId: byokAiProviders.id }),
    item({ featureId: cpuCore.id, included: 1 }),
    item({ featureId: memoryGb.id, included: 2 }),
    item({ featureId: storageGb.id, included: 40 }),
    item({ featureId: browserUse.id }),
    item({ featureId: freeAgentSubdomain.id }),
    item({ featureId: agentCustomDomains.id }),
  ],
});
