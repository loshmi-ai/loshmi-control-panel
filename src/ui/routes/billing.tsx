import { useState } from "react";
import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { Button } from "@src/ui/components/designSystem/button";
import { useBillingActions } from "@src/ui/domain/billing";
import { authClient } from "@src/ui/lib/auth";
import { getUserOrRedirectToLogin } from "@src/ui/lib/route-context.server";
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
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    window.location.assign("/login");
  }

  return (
    <AppShell
      actions={[
        { label: "Home", to: "/" },
        { label: "Dashboard", to: "/dashboard" },
      ]}
      isSigningOut={isSigningOut}
      navItems={[{ label: "Dashboard", shortLabel: "D", to: "/dashboard" }]}
      title="Billing"
      userEmail={loaderData.user.email}
      userName={loaderData.user.name}
      onSignOut={handleSignOut}
    >
      <section className="rounded-[28px] border border-slate-200 bg-white p-7">
        <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] text-indigo-600 uppercase">
          Billing
        </p>
        <h1 className="text-4xl leading-tight font-bold">Subscription</h1>
        <p className="mt-4 leading-relaxed text-slate-600">
          Signed in as <strong>{loaderData.user.name}</strong>{" "}
          <span className="text-slate-500">({loaderData.user.email})</span>.
        </p>
        <p className="mt-4 leading-relaxed text-slate-600">
          {billing.customer.isLoading
            ? "Loading billing details..."
            : billing.currentPlanNames.length > 0
              ? `Current plan: ${billing.currentPlanNames.join(", ")}.`
              : "No active paid plan yet."}
        </p>

        {billing.customer.error ? (
          <p className="mt-5 text-sm text-red-700">
            {billing.customer.error.message ||
              "Could not load billing details."}
          </p>
        ) : null}
        {billing.billingError ? (
          <p className="mt-5 text-sm text-red-700">{billing.billingError}</p>
        ) : null}
        {billing.billingMessage ? (
          <p className="mt-5 text-sm text-emerald-700">
            {billing.billingMessage}
          </p>
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
            variant="secondary"
            onClick={() => void billing.openBillingPortal()}
          >
            {billing.isOpeningBillingPortal ? "Opening..." : "Manage billing"}
          </Button>
        ) : null}
      </section>
    </AppShell>
  );
}
