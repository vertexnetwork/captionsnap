#!/usr/bin/env node
import { build, context } from "esbuild";
import { copyFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "dist");
const watch = process.argv.includes("--watch");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: [path.join(__dirname, "src/popup.tsx")],
  outfile: path.join(dist, "popup.js"),
  bundle: true,
  format: "esm",
  target: ["chrome120"],
  jsx: "automatic",
  jsxImportSource: "preact",
  minify: !watch,
  sourcemap: watch ? "inline" : false,
  tsconfig: path.join(__dirname, "tsconfig.json"),
  logLevel: "info",
};

async function copyStatic() {
  await copyFile(
    path.join(__dirname, "manifest.json"),
    path.join(dist, "manifest.json"),
  );
  await copyFile(
    path.join(__dirname, "popup.html"),
    path.join(dist, "popup.html"),
  );
  await copyFile(
    path.join(__dirname, "src/styles.css"),
    path.join(dist, "popup.css"),
  );
}

if (watch) {
  const ctx = await context({
    ...buildOptions,
    plugins: [
      {
        name: "copy-static",
        setup(b) {
          b.onEnd(async () => {
            await copyStatic();
            console.log("[copy-static] static assets refreshed");
          });
        },
      },
    ],
  });
  await ctx.watch();
  console.log("Watching extension for changes…");
} else {
  await build(buildOptions);
  await copyStatic();
  console.log(`Built extension to ${dist}`);
}
