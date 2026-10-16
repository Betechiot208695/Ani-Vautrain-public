const DEFAULT_TIMEOUT_MS = 20_000;

function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, "");
}

function getConfig() {
  return {
    target: (process.env.AI_TARGET || "auto").toLowerCase(),
    timeoutMs: Math.max(1000, Number(process.env.AI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS),
    maxTokens: Math.max(1, Number(process.env.AI_MAX_TOKENS) || 512),
    servers: {
      pc: {
        name: "pc",
        url: process.env.PC_AI_URL ? normalizeBaseUrl(process.env.PC_AI_URL) : "",
        model: process.env.PC_AI_MODEL || "mistral:latest",
        headers: {},
      },
      android: {
        name: "android",
        url: process.env.ANDROID_AI_URL ? normalizeBaseUrl(process.env.ANDROID_AI_URL) : "",
        model: process.env.ANDROID_AI_MODEL || "llama3.2:3b",
        headers: process.env.ANDROID_AI_API_KEY
          ? { Authorization: `Bearer ${process.env.ANDROID_AI_API_KEY}` }
          : {},
      },
    },
  };
}

async function requestJson(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Réponse non JSON (HTTP ${response.status})`);
    }

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${data.error || "requête refusée"}`);
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function testServer(server, timeoutMs) {
  if (!server.url) return { available: false, error: "URL non configurée" };

  try {
    const data = await requestJson(
      `${server.url}/api/tags`,
      { method: "GET", headers: server.headers },
      timeoutMs
    );

    const models = Array.isArray(data.models)
      ? data.models.map((model) => model.name)
      : [];

    return { available: true, models };
  } catch (error) {
    return {
      available: false,
      error: error.name === "AbortError" ? "Délai dépassé" : error.message,
    };
  }
}

function getServerOrder(config) {
  if (config.target === "pc") return ["pc"];
  if (config.target === "android") return ["android"];
  return ["pc", "android"];
}

export async function chat(messages, options = {}) {
  const config = getConfig();
  const errors = [];

  for (const name of getServerOrder(config)) {
    const server = config.servers[name];

    if (!server.url) {
      errors.push(`${name}: URL absente`);
      continue;
    }

    try {
      const payload = {
        model: server.model,
        messages,
        stream: false,
        options: { num_predict: config.maxTokens },
      };

      if (Number.isFinite(options.temperature)) {
        payload.options.temperature = options.temperature;
      }

      const result = await requestJson(
        `${server.url}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...server.headers },
          body: JSON.stringify(payload),
        },
        config.timeoutMs
      );

      if (typeof result.message?.content !== "string") {
        throw new Error("Réponse du modèle invalide");
      }

      return {
        ok: true,
        server: name,
        model: server.model,
        content: result.message.content,
        done: result.done,
      };
    } catch (error) {
      // Do not log request headers, tokens, or environment values.
      errors.push(`${name}: ${error.name === "AbortError" ? "délai dépassé" : error.message}`);
    }
  }

  const error = new Error(`Aucun serveur IA disponible. ${errors.join(" | ")}`);
  error.statusCode = 503;
  throw error;
}

export async function status() {
  const config = getConfig();
  const servers = {};

  for (const [name, server] of Object.entries(config.servers)) {
    servers[name] = {
      configured: Boolean(server.url),
      model: server.model,
      ...(await testServer(server, config.timeoutMs)),
    };
  }

  return {
    mode: config.target,
    preferredOrder: getServerOrder(config),
    servers,
  };
}
