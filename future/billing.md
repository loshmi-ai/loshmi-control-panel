# Future Billing

## Immediate Cancellation

When a billing subscription is active, the user should have a way to cancel it
immediately instead of only cancelling at the end of the billing period.

Immediate cancellation should:

- stop the active billing subscription on the cancellation date
- charge the user for the infrastructure fee up to that date
- refund the unused token amount for the remaining period
- make the final charge and refund amounts clear before the user confirms

The infrastructure fee is not refundable for usage that has already been
incurred. Only the unused token amount should be refundable.

## Upgrade Path

There should be a clear upgrade path from the current plan to a higher plan.

For now, there are only two plans, but the billing flow should not assume that
there will always be exactly two. Future plan selection and upgrade logic should
support multiple paid plans and choose eligible upgrade targets from plan
metadata instead of hardcoded two-plan branching.

Upgrades should define how billing is handled when the user changes plans
mid-cycle, including prorated charges, token entitlement changes, and whether
the upgrade takes effect immediately or at the next billing period.
