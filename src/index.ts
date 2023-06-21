#!/usr/bin/env node

import path from "path";
import spawn from "cross-spawn";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import minimist from "minimist";

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

export const getEnvFiles = (node_env: string) => {
  return [
    `.env.${node_env}.local`,
    node_env !== "test" ? ".env.local" : [],
    `.env.${node_env}`,
    ".env",
  ].flat();
};

export const loadNextEnv = (node_env?: string) => {
  const files = getEnvFiles(node_env ?? process.env.NODE_ENV ?? "development");
  files.forEach((env: string) => {
    expand(dotenv.config({ path: path.resolve(env) }));
  });
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
    spawn(command[0], command.slice(1), { stdio: "inherit", shell: true }).on(
      "exit",
      function (exitCode: number) {
        process.exit(exitCode);
      }
    );
  }
};

main();
