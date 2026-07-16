#!/usr/bin/env bun
import { $ } from "bun";
import { Command } from "commander";

const program = new Command();

program
  .name("loshmi-ops")
  .description("Operational tasks for the Loshmi control panel");

const autumnConfigPath = "autumn.config.ts";
const autumnPlanId = "loshmi_one";

const billing = program
  .command("billing")
  .description("Billing plan operations");

billing
  .command("preview")
  .description("Preview the Autumn plan")
  .action(async () => {
    await $`bunx atmn preview --config ${autumnConfigPath} --plan ${autumnPlanId}`;
  });

billing
  .command("push")
  .description("Push the active Autumn plan to Autumn")
  .option("-p, --prod", "Target Autumn production instead of sandbox")
  .option("-y, --yes", "Auto-confirm Autumn prompts")
  .action(async (options: { prod?: boolean; yes?: boolean }) => {
    if (options.prod && options.yes) {
      await $`doppler run -c prd -- bunx atmn push --config ${autumnConfigPath} --prod --yes`;
      return;
    }

    if (options.prod) {
      await $`doppler run -c prd -- bunx atmn push --config ${autumnConfigPath} --prod`;
      return;
    }

    if (options.yes) {
      await $`doppler run -c dev -- bunx atmn push --config ${autumnConfigPath} --yes`;
      return;
    }

    await $`doppler run -c dev -- bunx atmn push --config ${autumnConfigPath}`;
  });

program.parse();
