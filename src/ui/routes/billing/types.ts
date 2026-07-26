export type BillingPlan = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  features: string[];
};

export type BillingLoaderData = {
  plans: BillingPlan[];
  user: {
    name: string;
    email: string;
  };
};
