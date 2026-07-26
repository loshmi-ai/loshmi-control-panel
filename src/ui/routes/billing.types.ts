import type { getUserOrRedirectToLogin } from "@src/ui/lib/route-context.server";

export type BillingPlan = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  features: string[];
};

export type BillingLoaderData = {
  plans: BillingPlan[];
  user: ReturnType<typeof getUserOrRedirectToLogin>;
};
