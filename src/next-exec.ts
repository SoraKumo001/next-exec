#!/usr/bin/env node

import spawn from "cross-spawn";
import minimist from "minimist";
import { loadNextEnv } from "./index";

const printHelp = () => {
  console.log(
    [
      "Usage: next-exec [-c <environment>] -- [command]",
      "  -c <environment>    development , production , test , etc…",
      "                      default: process.env.NODE_ENV ?? development",
      "                      https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables",
      "  command             Commands to execute",
    ].join("\n")
  );
};

const main = () => {
  const argv = process.argv.slice(2);
  const index = argv.findIndex((v) => v === "--");
  const option = index >= 0 ? argv.slice(0, index) : [];
  const command = index >= 0 ? argv.slice(index + 1) : argv;
  const params = minimist(option);

  if (params.help || argv.length === 0) {
    printHelp();
    process.exit();
  }
  loadNextEnv(params.c);
  if (command) {
    spawn(
      `${command[0]} ${command
        .slice(1)
        .map((v) => v.replace(/"/g, '\\"'))
        .map((v) => `"${v}"`)
        .join(" ")}`,
      {
        stdio: "inherit",
        shell: true,
      }
    ).on("exit", function (exitCode: number) {
      process.exit(exitCode);
    });
  }
};

main();
