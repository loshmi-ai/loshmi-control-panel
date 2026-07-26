import type { useCustomer } from "autumn-js/react";

import type { BillingPlan } from "@src/ui/routes/billing/types";

export type BillingCustomer = ReturnType<typeof useCustomer>;

export type BillingActions = {
  activePlanIds: ReadonlySet<BillingPlan["id"]>;
  attachingPlanId: BillingPlan["id"] | null;
  billingError: string | null;
  billingMessage: string | null;
  customer: BillingCustomer;
  currentPlanNames: string[];
  isOpeningBillingPortal: boolean;
  attachPlan: (planId: BillingPlan["id"]) => Promise<void>;
  openBillingPortal: () => Promise<void>;
};
