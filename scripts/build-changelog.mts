#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

type ChangelogEntry = { date: string; title: string };

const OUT = resolve(process.cwd(), "content", "changelog.json");
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function readGitLog(): string {
  try {
    return execFileSync(
      "git",
      ["log", "--pretty=format:%ad|%s", "--date=short"],
      { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] },
    );
  } catch {
    return "";
  }
}

function parse(raw: string): ChangelogEntry[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const sep = line.indexOf("|");
      if (sep === -1) return null;
      const date = line.slice(0, sep).trim();
      const title = line.slice(sep + 1).trim();
      return { date, title };
    })
    .filter((e): e is ChangelogEntry => e !== null && ISO_DATE.test(e.date) && e.title.length > 0)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

const entries = parse(readGitLog());
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(entries, null, 2) + "\n", "utf-8");
process.stdout.write(`changelog: wrote ${entries.length} entries\n`);
