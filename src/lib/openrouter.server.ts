// Server-only AI client. Prefers Lovable AI Gateway (free, no separate key needed),
// with OpenRouter as an optional fallback when explicit keys are configured.
const LOVABLE_BASE = "https://ai.gateway.lovable.dev/v1";
const OR_BASE = "https://openrouter.ai/api/v1";

function openRouterKeys() {
  return [
    process.env.OPENROUTER_API_KEY,
    process.env.QWEN3_80B_API_KEY,
    process.env.QWEN3_CODER_480B_API_KEY,
  ].filter(Boolean) as string[];
}

async function lovableChat(opts: {
  model?: string;
  system?: string;
  prompt: string;
  json?: boolean;
  temperature?: number;
}): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const messages = [
    ...(opts.system ? [{ role: "system", content: opts.system }] : []),
    { role: "user", content: opts.prompt },
  ];
  const res = await fetch(`${LOVABLE_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: opts.model ?? "google/gemini-2.5-flash-lite",
      messages,
      temperature: opts.temperature ?? 0.45,
      max_tokens: 1800,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`LovableAI ${res.status}: ${await res.text().catch(() => "")}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

export async function orChat(opts: {
  model?: string;
  system?: string;
  prompt: string;
  json?: boolean;
  temperature?: number;
}): Promise<string> {
  // Primary: Lovable AI Gateway (managed, no external account needed)
  try {
    return await lovableChat(opts);
  } catch (lovableErr) {
    const keys = openRouterKeys();
    if (!keys.length) throw lovableErr;
    // Fallback: OpenRouter, only when explicit keys are configured
    const messages = [
      ...(opts.system ? [{ role: "system", content: opts.system }] : []),
      { role: "user", content: opts.prompt },
    ];
    let lastError = "";
    for (const key of keys) {
      const res = await fetch(`${OR_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
          "HTTP-Referer": "https://the-united-hell.lovable.app",
          "X-Title": "The United Hell",
        },
        body: JSON.stringify({
          model: opts.model ?? "qwen/qwen3-next-80b-a3b-instruct",
          messages,
          temperature: opts.temperature ?? 0.45,
          max_tokens: 1800,
          ...(opts.json ? { response_format: { type: "json_object" } } : {}),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data?.choices?.[0]?.message?.content ?? "";
      }
      lastError = `OpenRouter ${res.status}: ${await res.text().catch(() => "")}`;
    }
    throw new Error(lastError || (lovableErr as Error).message);
  }
}

export async function orJson<T = unknown>(opts: {
  model?: string;
  system?: string;
  prompt: string;
  temperature?: number;
}): Promise<T> {
  const txt = await orChat({ ...opts, json: true });
  try {
    return JSON.parse(txt) as T;
  } catch {
    const m = txt.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]) as T;
    throw new Error("AI returned non-JSON");
  }
}


export async function pexelsImage(query: string): Promise<string | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch(
      `https://api.pexels.com/v1/search?per_page=5&query=${encodeURIComponent(query)}`,
      { headers: { Authorization: key } },
    );
    if (!r.ok) return null;
    const d = await r.json();
    const pick = d?.photos?.[Math.floor(Math.random() * Math.min(5, d?.photos?.length || 0))];
    return pick?.src?.large2x || pick?.src?.large || null;
  } catch {
    return null;
  }
}
