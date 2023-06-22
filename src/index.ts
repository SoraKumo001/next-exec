import path from "path";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";

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
