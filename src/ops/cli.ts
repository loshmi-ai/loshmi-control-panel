#!/usr/bin/env bun
import { Command } from "commander";

const program = new Command();

program
  .name("loshmi-ops")
  .description("Operational tasks for the Loshmi control panel");

program.parse();
