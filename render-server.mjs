import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const clientDir = resolve(rootDir, "dist/client");
const serverEntryPath = resolve(rootDir, "dist/server/server.js");
const handlerModule = await import(pathToFileURL(serverEntryPath));
const handler = handlerModule.default;

if (!handler?.fetch) {
  throw new Error(`Server entry ${serverEntryPath} does not export default.fetch`);
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getStaticFile(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const safePath = normalize(decodedPath).replace(/^([/\\])+/, "");
  const filePath = resolve(clientDir, safePath);

  if (!filePath.startsWith(clientDir + "/")) return null;
  if (!existsSync(filePath)) return null;
  if (!statSync(filePath).isFile()) return null;

  return filePath;
}

function sendStaticFile(res, filePath) {
  const ext = extname(filePath).toLowerCase();
  res.statusCode = 200;
  res.setHeader("content-type", mimeTypes[ext] ?? "application/octet-stream");

  if (filePath.includes(`${clientDir}/assets/`)) {
    res.setHeader("cache-control", "public, max-age=31536000, immutable");
  } else {
    res.setHeader("cache-control", "public, max-age=0, must-revalidate");
  }

  createReadStream(filePath).pipe(res);
}

async function sendFetchResponse(res, response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (!response.body) {
    res.end();
    return;
  }

  const reader = response.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (error) {
    res.destroy(error);
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const staticFile =
      req.method === "GET" || req.method === "HEAD" ? getStaticFile(url.pathname) : null;

    if (staticFile) {
      if (req.method === "HEAD") {
        res.statusCode = 200;
        res.end();
      } else {
        sendStaticFile(res, staticFile);
      }
      return;
    }

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        for (const item of value) headers.append(key, item);
      } else if (value !== undefined) {
        headers.set(key, value);
      }
    }

    const method = req.method ?? "GET";
    const body = method === "GET" || method === "HEAD" ? undefined : req;
    const request = new Request(url, {
      method,
      headers,
      body,
      duplex: body ? "half" : undefined,
    });

    const response = await handler.fetch(request, process.env, {});
    await sendFetchResponse(res, response);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain; charset=utf-8");
    }
    res.end("Internal Server Error");
  }
});

const port = Number(process.env.PORT) || 10000;
const host = process.env.HOST || "0.0.0.0";

server.listen(port, host, () => {
  console.log(`TaskFlow listening on http://${host}:${port}`);
});
