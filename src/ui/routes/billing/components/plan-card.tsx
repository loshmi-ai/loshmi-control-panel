import { Button } from "@src/ui/components/designSystem/button";
import type { BillingPlan } from "@src/ui/routes/billing.types";

type BillingPlanCardProps = {
  isAttaching: boolean;
  isBillingLoading: boolean;
  isCurrentPlan: boolean;
  plan: BillingPlan;
  onSelectPlan: (planId: BillingPlan["id"]) => void;
};

export function BillingPlanCard({
  isAttaching,
  isBillingLoading,
  isCurrentPlan,
  plan,
  onSelectPlan,
}: BillingPlanCardProps) {
  return (
    <article className="rounded-md border border-slate-200 p-4">
      <h2 className="text-lg font-bold">{plan.name}</h2>
      <p className="mt-2 text-sm leading-relaxed">{plan.description}</p>
      {plan.price ? (
        <p className="mt-4 text-sm font-semibold">{plan.price}</p>
      ) : null}
      <ul className="mt-4 space-y-2 text-sm leading-relaxed">
        {plan.features.map((featureText) => (
          <li className="flex gap-2" key={featureText}>
            <span aria-hidden="true">-</span>
            <span>{featureText}</span>
          </li>
        ))}
      </ul>
      <Button
        className="mt-5 w-full"
        disabled={isBillingLoading || isCurrentPlan}
        loading={isAttaching}
        onClick={() => onSelectPlan(plan.id)}
      >
        {isCurrentPlan ? "Current plan" : "Select plan"}
      </Button>
    </article>
  );
}
