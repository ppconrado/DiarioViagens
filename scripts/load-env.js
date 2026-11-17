const fs = require("node:fs");
const path = require("node:path");

for (const fileName of [".env", ".env.local"]) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) continue;

  const contents = fs.readFileSync(filePath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const [, name, rawValue] = match;
    const value = rawValue
      .replace(/^(['"])(.*)\1$/, "$2")
      .replace(/\s+#.*$/, "")
      .trim();
    if (process.env[name] === undefined) process.env[name] = value;
  }
}
