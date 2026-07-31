import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
const client = join(dist, "client");
const server = join(dist, "server");

rmSync(dist, { recursive: true, force: true });
mkdirSync(client, { recursive: true });
mkdirSync(server, { recursive: true });
mkdirSync(join(dist, ".openai"), { recursive: true });

for (const item of ["index.html", "styles.css", "app.js", "downloads"]) {
  cpSync(join(root, item), join(client, item), { recursive: true });
}

cpSync(join(root, ".openai", "hosting.json"), join(dist, ".openai", "hosting.json"));

writeFileSync(
  join(server, "index.js"),
  `export default {
  async fetch(request, env) {
    if (!env || !env.ASSETS) {
      return new Response("Static asset binding is unavailable.", { status: 500 });
    }

    const url = new URL(request.url);
    if (url.pathname === "/") {
      url.pathname = "/index.html";
    }

    const response = await env.ASSETS.fetch(new Request(url, request));
    if (response.status !== 404 || url.pathname.includes(".")) {
      return response;
    }

    url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url, request));
  }
};
`,
  "utf8",
);

console.log("Built OpenAI Sites artifact in dist/");
