# next-exec

## About

Get environment variables similar to Next.js from `.env` file, etc. and execute commands

## Usage

```sh
Usage: next-exec [-c <environment>] -- [command]
  -c [environment]    development , production , test , etc…
                      default: process.env.NODE_ENV ?? development
                      https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables
  command             Commands to execute
```

## Example

```sh
next-exec any-command

next-exec -c production -- any-command

```

## Operation details

Load environment variables according to the contents of the [VercelDocument](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables).

```ts
const getEnvFiles = (node_env: string) => {
  return [
    `.env.${node_env}.local`,
    node_env !== "test" ? ".env.local" : [],
    `.env.${node_env}`,
    ".env",
  ].flat();
};
```

## To use from within the program code

```ts
import { loadNextEnv } from "next-exec";

loadNextEnv(); // Set environment variables
```

```ts
import { loadNextEnv } from "next-exec";

loadNextEnv("production"); // Set the "production" environment variable
```
