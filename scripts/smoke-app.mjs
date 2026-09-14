import fs from "fs";
import path from "path";

const base = process.env.BASE_URL || "http://localhost:3000";

const envPath = path.join(process.cwd(), ".env.local");
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      let v = l.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      return [l.slice(0, i).trim(), v];
    }),
);

function cookieFrom(res) {
  const raw = res.headers.getSetCookie?.() ?? [];
  if (raw.length) {
    return raw.map((c) => c.split(";")[0]).join("; ");
  }
  const single = res.headers.get("set-cookie");
  return single ? single.split(";")[0] : "";
}

async function main() {
  const pin = env.SALAH_PIN || "2001";
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "salah", pin }),
  });
  const loginJson = await loginRes.json();
  const cookie = cookieFrom(loginRes);
  console.log(
    JSON.stringify({
      step: "login",
      status: loginRes.status,
      ok: loginRes.ok,
      hasCookie: Boolean(cookie),
      body: loginJson,
    }),
  );
  if (!loginRes.ok || !cookie) {
    process.exit(1);
  }

  async function hit(name, pathName, method = "GET") {
    const res = await fetch(`${base}${pathName}`, {
      method,
      headers: { Cookie: cookie },
    });
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text.slice(0, 200) };
    }

    const summary = {
      step: name,
      status: res.status,
      ok: res.ok,
    };

    if (name === "market") {
      const data = json.data ?? json;
      summary.source = data.source;
      summary.sample = data.sample;
      summary.price = data.price;
      summary.warnings = data.warnings?.slice?.(0, 2);
    } else if (name === "context") {
      const data = json.data ?? json;
      summary.macroSource = data.macro?.source;
      summary.macroSample = data.macro?.sample;
      summary.newsSource = data.news?.source;
      summary.newsSample = data.news?.sample;
      summary.newsCount = data.news?.items?.length;
      summary.macroWarnings = data.macro?.warnings?.slice?.(0, 2);
      summary.newsWarnings = data.news?.warnings?.slice?.(0, 2);
    } else if (name === "health") {
      const data = json.data ?? json;
      summary.productionReady = data.productionReady;
      summary.persist = data.persist;
      summary.issues = data.issues?.map?.((i) => i.code);
      summary.integrations = data.integrations;
    } else if (name === "run") {
      const data = json.data ?? json;
      summary.okFlag = json.ok;
      summary.error = json.error?.message ?? json.error;
      summary.bias = data.brief?.bias;
      summary.confidence = data.brief?.confidence;
      summary.market = data.data?.market;
      summary.macro = data.data?.macro;
      summary.news = data.data?.news;
      summary.warnings = data.warnings?.slice?.(0, 3);
    } else {
      summary.snippet = JSON.stringify(json).slice(0, 240);
    }

    console.log(JSON.stringify(summary));
    return { res, json };
  }

  await hit("market", "/api/market");
  await hit("context", "/api/context");
  await hit("health", "/api/desk/health");
  await hit("run", "/api/desk/run", "POST");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
