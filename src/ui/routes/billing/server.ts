import type { Feature, Plan, PlanItem } from "atmn";

import type { BillingPlan } from "@src/ui/routes/billing.types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
  style: "currency",
});

function formatPlanPrice(plan: Plan) {
  if (!plan.price) {
    return null;
  }

  return `${currencyFormatter.format(plan.price.amount)}/${plan.price.interval}`;
}

function formatPlanFeature(
  item: PlanItem,
  featuresById: ReadonlyMap<string, Feature>,
) {
  const feature = featuresById.get(item.featureId);

  if (!feature) {
    return item.featureId;
  }

  const includedPrefix = item.included === undefined ? "" : `${item.included} `;
  const resetSuffix =
    item.reset === undefined ? "" : ` per ${item.reset.interval}`;

  return `${includedPrefix}${feature.name}${resetSuffix}`;
}

function isAutumnPlan(value: unknown): value is Plan {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "items" in value
  );
}

function isAutumnFeature(value: unknown): value is Feature {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "type" in value &&
    !("items" in value)
  );
}

export async function getBillingPlans(): Promise<BillingPlan[]> {
  const autumnConfig = await import("../../../../autumn.config");
  const autumnConfigExports = Object.values(autumnConfig);
  const featuresById: ReadonlyMap<string, Feature> = new Map(
    autumnConfigExports
      .filter(isAutumnFeature)
      .map((feature) => [feature.id, feature]),
  );
  const plans = autumnConfigExports.filter(isAutumnPlan) as Plan[];

  return plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description ?? null,
    price: formatPlanPrice(plan),
    features: (plan.items ?? []).map((planItem) =>
      formatPlanFeature(planItem, featuresById),
    ),
  }));
}
