# pforge

> Des composants Svelte pour construire une page **Roadmap publique** à partir de tes données GitHub — **sans base de données**.

---

## Le problème

Tes utilisateurs finaux veulent suivre l'évolution de ton projet, mais GitHub est trop technique et hostile pour eux. Ils ne comprennent pas les numéros d'issues, les messages de commit techniques, ou les releases notes brutes.

Tu as besoin d'une interface simple, traduite et synthétisée, directement intégrable à ton site.

## La solution

**pforge** est une librairie de composants Svelte 5 accompagnée de fonctions serveur qui te permet de :

- **Récupérer automatiquement** les commits, issues et releases depuis GitHub
- **Générer des synthèses LLM** compréhensibles par tes utilisateurs, stockées en local
- **Afficher ta roadmap** sous deux formats switchables : **Timeline** ou **Kanban**
- **Permettre aux utilisateurs d'interagir** (upvote + commentaire) sans compte GitHub

**Zero base de données requise** — tout passe par une GitHub App et des fichiers locaux.

---

## Architecture

```mermaid
flowchart TD
    User["👤 Utilisateur final"] --> UI["🎨 Composants UI\n(Svelte 5)"]
    UI --> Page["📋 Page Roadmap\nTimeline / Kanban"]
    UI --> API["⚙️ Fonctions API\n(SvelteKit)"]

    API --> GH_API["🐙 GitHub API\n(données brutes)"]
    API --> Files["📁 Fichiers\nJSON / Markdown\n(synthèses LLM)"]
    API --> GH_APP["🔑 GitHub App\n(upvotes, commentaires)"]

    GH_API --> LLM["🧠 LLM\n(OpenAI, Anthropic...)"]
    LLM --> Files
```

### Frontend

- Composants Svelte 5 réutilisables : timeline, kanban, cartes de fonctionnalités, filtres
- Affichage switchable entre **Timeline verticale** et **Kanban par statut**

### Serveur

- Fonctions pour récupérer et formatter les données GitHub
- Génération de synthèses LLM via API

### Persistance

- **Données brutes GitHub** → fetch à la volée (toujours à jour)
- **Synthèses LLM** → fichiers JSON/Markdown versionnés dans le repo
- **Interactions utilisateurs** (upvotes, commentaires) → via GitHub App (pas de DB externe)

### Mise à jour des synthèses

Un script CLI / cron-job configurable permet de regénérer les synthèses sur une période donnée sans écraser les corrections manuelles que tu aurais pu faire.

---

## Installation

```bash
bun add pforge
```

### Prérequis

- Un compte GitHub
- Une clé API pour un LLM (OpenAI, Anthropic, etc.)

---

## Utilisation rapide

### 1. Créer la GitHub App

Lance le script d'initialisation — il crée automatiquement la GitHub App avec les bonnes permissions et écrit les credentials dans un fichier `.env` :

```bash
bunx pforge-init
```

Le script te demandera :

- le _owner_ / organisation GitHub
- le nom du _repository_
- le nom de l'app (optionnel, défaut: `pforge-{repo}`)

Une fois terminé, n'oublie pas d'**installer l'app sur ton repository** via le lien affiché dans le terminal.

### 2. Variables d'environnement

Le fichier `.env` généré contient :

```bash
GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
GITHUB_WEBHOOK_SECRET="..."
```

Tu peux aussi ajouter ta clé API LLM :

```bash
OPENAI_API_KEY=sk-...
```

### 2. Intégration dans une page SvelteKit

```svelte
<!-- src/routes/roadmap/+page.svelte -->
<script>
	import { Roadmap, RoadmapKanban, RoadmapTimeline } from 'pforge';
</script>

<Roadmap config={{ view: 'timeline' }}>
	<RoadmapTimeline />
	<!-- ou -->
	<RoadmapKanban />
</Roadmap>
```

### 3. Générer les premières synthèses

```bash
npx pforge generate-summaries --from 2024-01-01
```

---

## Configuration avancée

### Regénération sélective des synthèses

Pour ne regénérer que les synthèses d'une période donnée (sans écraser les corrections manuelles) :

```bash
npx pforge generate-summaries --from 2024-06-01 --to 2024-12-31
```

### Override manuel

Tu peux éditer directement les fichiers JSON/Markdown générés. La prochaine regénération sélective préservera tes modifications.

### Personnalisation des vues

```svelte
<RoadmapKanban
	columns={[
		{ status: 'planned', label: 'À venir' },
		{ status: 'in-progress', label: 'En cours' },
		{ status: 'shipped', label: 'Livré' }
	]}
/>
```

---

## Développement

```bash
# Lancer le dev server
bun run dev

# Build
bun run build

# Tests
bun run test
```

---

## Comment ça marche pour les utilisateurs finaux ?

1. Ils arrivent sur ta page Roadmap
2. Ils peuvent naviguer entre la vue **Timeline** et la vue **Kanban**
3. Ils lisent des descriptions claires et synthétisées des évolutions
4. Ils peuvent **upvoter** une fonctionnalité ou **laisser un commentaire** sans créer de compte GitHub
5. Leurs interactions sont relayées à ton repo GitHub via la GitHub App

---

## Roadmap (meta 😄)

- [x] Composants Timeline & Kanban
- [ ] Filtres avancés (par label, par date, par statut)
- [ ] Notifications par email pour les nouvelles releases
- [ ] Support multi-repo
- [ ] Thèmes personnalisables

---

## License

MIT
