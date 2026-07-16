import { feature, item, plan } from "atmn";

const LOSHMI_ONE_PLAN_ID = "loshmi_one";

export const customDomain = feature({
  id: "custom_domain",
  name: "Custom domain",
  type: "boolean",
});

export const browserUse = feature({
  id: "unlimited_browser_use",
  name: "Unlimited browser usage on device",
  type: "boolean",
});

export const byokAiProviders = feature({
  id: "byok_ai_providers",
  name: "BYOK for Codex, Claude, Gemini, Grok, DeepSeek, and GLM",
  type: "boolean",
});

export const loshmiOne = plan({
  id: LOSHMI_ONE_PLAN_ID,
  name: "Loshmi One",
  price: {
    amount: 24.99,
    interval: "month",
  },
  group: "loshmi-main",
  items: [
    item({
      featureId: customDomain.id,
    }),
    item({
      featureId: browserUse.id,
    }),
    item({
      featureId: byokAiProviders.id,
    }),
  ],
});
