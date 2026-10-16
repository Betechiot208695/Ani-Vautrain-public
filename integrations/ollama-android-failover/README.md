# Ani Vautrain — Ollama PC + Android failover

Petit service Node.js autonome qui essaie d'abord Ollama sur le PC puis l'API Ollama d'Android si le PC échoue. Il est isolé du frontend React/Vite existant.

## Prérequis

- Node.js 20+
- Ollama sur le PC
- Un service Android accessible depuis la machine qui lance ce routeur
- Les deux serveurs exposent l'API native Ollama : `/api/tags` et `/api/chat`

> Le port Android `12434` n'est pas le port Ollama par défaut. Si ton service Android expose plutôt `/v1/chat/completions`, il faudra adapter le connecteur. Vérifie l'API avant de lancer les tests.

## Installation

Depuis ce dossier :

```bash
npm install
cp .env.example .env
```

Modifie `.env` avec les adresses LAN et les noms exacts des modèles. Définis impérativement `API_TOKEN` avec une valeur longue et aléatoire. Ne publie jamais le fichier `.env`.

Générer un jeton aléatoire sous Linux/Termux :

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

## Lancement

```bash
npm start
```

Par défaut, le service écoute seulement sur `127.0.0.1:3001`. Pour le rendre accessible depuis un autre appareil du réseau local, configure `HOST=0.0.0.0` seulement après avoir défini `API_TOKEN`, puis limite l'accès au port avec le pare-feu du système. Ne publie pas ce service directement sur Internet.

## Tester les serveurs

Test local sans authentification :

```bash
curl http://127.0.0.1:3001/health
```

Vérifier l'état des deux moteurs (remplace le jeton par la valeur de ton fichier local) :

```bash
curl http://127.0.0.1:3001/api/ai/status \
  -H "Authorization: Bearer TON_JETON_LOCAL"
```

Envoyer un message :

```bash
curl -X POST http://127.0.0.1:3001/api/ai/chat \
  -H "Authorization: Bearer TON_JETON_LOCAL" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Bonjour Ani, présente-toi."}]}'
```

En mode `AI_TARGET=auto`, le routeur essaie le PC puis Android. Les modes `pc` et `android` permettent de cibler un seul serveur.

## Réseau PC / Android

- Vérifie que les adresses dans `.env` sont actuelles et joignables depuis la machine qui héberge ce service.
- Ollama sur Windows écoute souvent seulement sur localhost. Si tu changes son interface d'écoute, limite l'accès au réseau privé et au sous-réseau local avec le pare-feu.
- Ne suppose pas que le service Android parle l'API native Ollama : vérifie `/api/tags` avant le basculement.
- Le basculement est séquentiel et peut prendre jusqu'au délai configuré pour le premier serveur.
- Cette première version ne met pas en cache les réponses et ne garantit pas que les deux modèles aient la même qualité.

## Intégration à Ani

Ce service est indépendant du frontend Vite/React. Il peut être utilisé par ton backend Node.js existant via HTTP. N'expose jamais le jeton dans du code frontend, une variable `VITE_*`, une capture d'écran ou un dépôt Git.

## Sécurité

- `.env` est ignoré par Git.
- Toutes les routes de statut et de chat sont protégées par `API_TOKEN`.
- Le endpoint `/health` ne révèle aucune adresse ni clé.
- Les erreurs renvoyées aux clients ne contiennent pas de détails internes.
