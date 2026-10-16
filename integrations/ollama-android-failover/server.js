import "dotenv/config";
import express from "express";
import { chat, status } from "./ollama-router.js";

const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT) || 3001;
const apiToken = process.env.API_TOKEN || "";

app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));

function requireToken(req, res, next) {
  if (!apiToken) {
    return res.status(503).json({
      error: "API_TOKEN non configuré. Configurez un secret avant d'utiliser la passerelle.",
    });
  }

  const supplied = req.get("authorization") || "";
  if (supplied !== `Bearer ${apiToken}`) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  next();
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ani-ollama-failover" });
});

app.get("/api/ai/status", requireToken, async (_req, res) => {
  try {
    res.json(await status());
  } catch {
    res.status(502).json({ error: "Impossible de vérifier les serveurs IA" });
  }
});

app.post("/api/ai/chat", requireToken, async (req, res) => {
  const messages = req.body?.messages;

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > 50 ||
    messages.some((message) =>
      !message ||
      !["system", "user", "assistant"].includes(message.role) ||
      typeof message.content !== "string" ||
      message.content.length > 20_000
    )
  ) {
    return res.status(400).json({ error: "Le tableau messages est invalide" });
  }

  const temperature = req.body?.temperature;
  if (temperature !== undefined &&
      (typeof temperature !== "number" || temperature < 0 || temperature > 2)) {
    return res.status(400).json({ error: "temperature doit être un nombre entre 0 et 2" });
  }

  try {
    res.json(await chat(messages, { temperature }));
  } catch {
    // Keep upstream details and credentials out of public responses.
    res.status(503).json({ error: "Aucun serveur IA configuré n'a pu répondre" });
  }
});

app.listen(port, host, () => {
  console.log(`Ani Ollama failover écoute sur http://${host}:${port}`);
  console.log("Les routes /api/ai/* exigent Authorization: Bearer <API_TOKEN>.");
});
