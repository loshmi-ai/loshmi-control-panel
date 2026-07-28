import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/app-shell";
import { Button } from "@src/ui/components/button";
import { Variant } from "@src/ui/components/variants";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import { useBillingActions } from "@src/ui/domain/billing";
import type { BillingLoaderData } from "@src/ui/routes/billing.types";
import { BillingPlanCard } from "@src/ui/routes/billing/components/plan-card";
import { getBillingPlans } from "@src/ui/routes/billing/server";

export function meta() {
  return [{ title: "Billing | Loshmi Control Panel" }];
}

export async function loader(
  args: LoaderFunctionArgs,
): Promise<BillingLoaderData> {
  const user = getUserOrRedirectToLogin(args);
  const plans = await getBillingPlans();

  return {
    plans,
    user,
  };
}

export default function Billing({
  loaderData,
}: {
  loaderData: BillingLoaderData;
}) {
  const billing = useBillingActions(loaderData.plans);

  return (
    <AppShell user={loaderData.user}>
      <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] uppercase">
        Billing
      </p>
      <h1 className="text-4xl leading-tight font-bold">Subscription</h1>
      <p className="mt-4 leading-relaxed">
        Signed in as <strong>{loaderData.user.name}</strong>{" "}
        <span>({loaderData.user.email})</span>.
      </p>
      <p className="mt-4 leading-relaxed">
        {billing.customer.isLoading
          ? "Loading billing details..."
          : billing.currentPlanNames.length > 0
            ? `Current plan: ${billing.currentPlanNames.join(", ")}.`
            : "No active paid plan yet."}
      </p>

      {billing.customer.error ? (
        <p className="mt-5 text-sm">
          {billing.customer.error.message || "Could not load billing details."}
        </p>
      ) : null}
      {billing.billingError ? (
        <p className="mt-5 text-sm">{billing.billingError}</p>
      ) : null}
      {billing.billingMessage ? (
        <p className="mt-5 text-sm">{billing.billingMessage}</p>
      ) : null}

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {loaderData.plans.map((plan) => (
          <BillingPlanCard
            isAttaching={billing.attachingPlanId === plan.id}
            isBillingLoading={billing.customer.isLoading}
            isCurrentPlan={billing.activePlanIds.has(plan.id)}
            key={plan.id}
            plan={plan}
            onSelectPlan={(planId) => void billing.attachPlan(planId)}
          />
        ))}
      </div>

      {billing.customer.data?.stripeId ? (
        <Button
          className="mt-5"
          disabled={billing.isOpeningBillingPortal}
          variant={Variant.Secondary}
          onClick={() => void billing.openBillingPortal()}
        >
          {billing.isOpeningBillingPortal ? "Opening..." : "Manage billing"}
        </Button>
      ) : null}
    </AppShell>
  );
}
