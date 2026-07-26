import { useCustomer } from "autumn-js/react";
import { atom, useAtom } from "jotai";
import { useMemo } from "react";

import type { BillingActions } from "@src/ui/domain/billing.types";
import type { BillingPlan } from "@src/ui/routes/billing/types";

type BillingState = {
  attachingPlanId: BillingPlan["id"] | null;
  error: string | null;
  isOpeningBillingPortal: boolean;
  message: string | null;
};

const initialBillingState: BillingState = {
  attachingPlanId: null,
  error: null,
  isOpeningBillingPortal: false,
  message: null,
};

export const billingAtom = atom<BillingState>(initialBillingState);

function getBillingErrorMessage(caughtError: unknown, fallback: string) {
  return caughtError instanceof Error ? caughtError.message : fallback;
}

export function useBillingActions(plans: BillingPlan[]): BillingActions {
  const customer = useCustomer({
    expand: ["subscriptions.plan", "balances.feature"],
  });
  const [billingState, setBillingState] = useAtom(billingAtom);

  async function ensureBillingCustomer() {
    const result = await customer.refetch();

    if (!result.data?.id) {
      throw new Error(
        "Could not load your billing customer. Please try again.",
      );
    }
  }

  async function attachPlan(planId: BillingPlan["id"]) {
    setBillingState((state) => ({
      ...state,
      attachingPlanId: planId,
      error: null,
      message: null,
    }));

    try {
      await ensureBillingCustomer();
      await customer.attach({
        planId,
        redirectMode: "always",
      });
      setBillingState((state) => ({
        ...state,
        message: "Billing flow started.",
      }));
    } catch (caughtError) {
      setBillingState((state) => ({
        ...state,
        error: getBillingErrorMessage(
          caughtError,
          "Could not start the billing flow.",
        ),
      }));
    } finally {
      setBillingState((state) => ({
        ...state,
        attachingPlanId: null,
      }));
    }
  }

  async function openBillingPortal() {
    setBillingState((state) => ({
      ...state,
      error: null,
      isOpeningBillingPortal: true,
      message: null,
    }));

    try {
      await ensureBillingCustomer();
      await customer.openCustomerPortal({
        returnUrl: window.location.href,
      });
    } catch (caughtError) {
      setBillingState((state) => ({
        ...state,
        error: getBillingErrorMessage(
          caughtError,
          "Could not open the billing portal.",
        ),
      }));
    } finally {
      setBillingState((state) => ({
        ...state,
        isOpeningBillingPortal: false,
      }));
    }
  }

  const activePlanIds = useMemo(
    () =>
      new Set(
        (customer.data?.subscriptions ?? [])
          .filter((subscription) => subscription.status === "active")
          .map((subscription) => subscription.planId),
      ),
    [customer.data?.subscriptions],
  );
  const currentPlanNames = useMemo(
    () =>
      plans
        .filter((plan) => activePlanIds.has(plan.id))
        .map((plan) => plan.name),
    [activePlanIds, plans],
  );

  return {
    activePlanIds,
    attachingPlanId: billingState.attachingPlanId,
    billingError: billingState.error,
    billingMessage: billingState.message,
    customer,
    currentPlanNames,
    isOpeningBillingPortal: billingState.isOpeningBillingPortal,
    attachPlan,
    openBillingPortal,
  };
}
