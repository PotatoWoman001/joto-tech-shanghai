import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = resolve(projectRoot, "dist/server/index.js");

await mkdir(dirname(destination), { recursive: true });
await copyFile(resolve(projectRoot, "worker/index.js"), destination);
