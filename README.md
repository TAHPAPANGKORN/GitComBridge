# 🌉 GitComBridge

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-626cd9?style=for-the-badge&logo=stripe)](https://stripe.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**GitComBridge** is a premium, unified contribution graph generator. It merges your coding activity from **GitHub** and **GitLab** into a single, stunning SVG visualization that you can embed anywhere.

## ✨ Key Features

- 🔗 **Dual-Platform Sync**: Unified view of your impact across the world's leading git platforms.
- 🎨 **12+ Premium Themes**: Choose from `Neon`, `Monokai`, `Sakura`, `Ocean`, and more.
- 📐 **Flexible Layouts**: Standard **Horizontal** or space-saving **Vertical** (Sidebar style).
- 🛠 **Pro Customization**: Custom titles, adjustable cell sizes (S to XL), and flexible time ranges.
- 💳 **Localized Payments**: One-time Pro upgrade via Stripe with PromptPay support (Thailand).
- 🔐 **Military-Grade Security**: 
  - **AES-256-GCM**: Industry-standard encryption for all stored access tokens.
  - **Token Scrubbing**: Automatic removal of plaintext tokens from the database.
  - **XSS Protection**: Full SVG entity escaping for safe embedding.
- 🇹🇭 **Bi-lingual Support**: Native support for English and Thai languages.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub & GitLab OAuth Applications
- Stripe Account (Optional, for Pro tier)

### Environment Variables

The project uses a split environment strategy to isolate development and production data. Create a `.env` (development) and `.env.prod` (production) file:

```env
# Database (Managed via prisma.config.ts)
POSTGRES_URL_NON_POOLING="postgresql://user:pass@localhost:5432/gitcombridge"
POSTGRES_PRISMA_URL="postgresql://user:pass@localhost:5432/gitcombridge"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_a_long_random_string"

# OAuth Credentials (for Web App)
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"
GITLAB_ID="your_gitlab_client_id"
GITLAB_SECRET="your_gitlab_client_secret"

# Local CLI / Script (Optional - for npm run generate:local)
GITHUB_TOKEN="your_personal_access_token"
GITLAB_TOKEN="your_personal_access_token"
GITLAB_USERNAME="your_username"
GITLAB_INSTANCE_URL="https://gitlab.com"

# Security (32-byte hex key for AES-256-GCM)
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# Stripe Localized for Thailand (PromptPay support)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."
```

### Installation & Run

```bash
# 1. Start the database (using Docker)
docker compose up -d

# 2. Install dependencies
npm install

# 3. Push database schema
npx prisma db push

# 4. Start development server
npm run dev
```

### Docker (Local Database)

For local development, we provide a pre-configured `docker-compose.yml` to spin up a PostgreSQL instance:

```bash
# Start the database container
docker compose up -d

# Stop the database container
docker compose down

# Check database logs
docker compose logs -f db
```

The database is exposed on port `5432` with the following credentials (defined in `docker-compose.yml`):
- **User**: `postgres`
- **Password**: `local_password`
- **Database**: `gitcombridge`

## 🛠 Developer Utilities

### Local SVG Generation
Generate a contribution graph locally without running the full web server:

```bash
# Set GH_TOKEN and GITLAB_TOKEN in your .env
npm run generate:local
```
This will output `contribution-graph.svg` in the root directory.

## 📐 Parameters API

Embed your dynamic graph using our optimized API endpoint:

`![Graph](https://gitcombridge.com/api/graph/username?theme=neon&layout=vertical)`

| Parameter | Tier | Description | Options |
|-----------|------|-------------|---------|
| `theme`   | Mixed | Visual style | `dark`, `light`, `neon`, `monokai`, etc. |
| `layout`  | Pro | Graph orientation | `horizontal`, `vertical` |
| `cellSize`| Pro | Size of squares | `S`, `M`, `L`, `XL` |
| `title`   | Pro | Custom header text | Any escaped string |
| `weeks`   | Pro | Time range | `26`, `52`, `104` |
| `hideWatermark` | Pro | Brand removal | `true` / `false` |

## 🛡 Security Architecture

1. **Token Isolation**: We never store plaintext OAuth tokens. All tokens are encrypted using `AES-256-GCM` with a unique Initialization Vector (IV) and Authentication Tag per record.
2. **Database Integrity**: The `prisma.config.ts` ensures that database connections are handled strictly, preventing accidental leaks between environments.
3. **SVG Sanitization**: Advanced sanitization ensures that even with custom titles, your embed remains XSS-free.

---

Created with ❤️ by [Papangkorn PJ.](https://github.com/tahpapangkorn)
