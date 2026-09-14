import fs from "fs";
import path from "path";

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

async function check(name, url, opts = {}) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    const snippet = text.slice(0, 280).replace(/\s+/g, " ");
    console.log(JSON.stringify({ name, status: res.status, ok: res.ok, snippet }));
  } catch (e) {
    console.log(JSON.stringify({ name, ok: false, error: String(e.message || e) }));
  }
}

const td = env.TWELVEDATA_API_KEY;
const poly = env.POLYGON_API_KEY;
const fred = env.FRED_API_KEY;
const fh = env.FINNHUB_API_KEY;
const news = env.NEWS_API_KEY;
const groq = env.GROQ_API_KEY;

await check(
  "twelvedata",
  `https://api.twelvedata.com/quote?symbol=XAU/USD&apikey=${td}`,
);

const to = new Date().toISOString().slice(0, 10);
const from = new Date(Date.now() - 40 * 864e5).toISOString().slice(0, 10);
await check(
  "polygon",
  `https://api.polygon.io/v2/aggs/ticker/C:XAUUSD/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=5&apiKey=${poly}`,
);

await check(
  "fred",
  `https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=${fred}&file_type=json&sort_order=desc&limit=2`,
);

await check(
  "finnhub",
  `https://finnhub.io/api/v1/news?category=general&token=${fh}`,
);

await check(
  "newsapi",
  `https://newsapi.org/v2/everything?q=gold&language=en&pageSize=3&apiKey=${news}`,
);

await check("groq", "https://api.groq.com/openai/v1/models", {
  headers: { Authorization: `Bearer ${groq}` },
});
