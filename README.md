# 🌉 GitComBridge

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![NextAuth](https://img.shields.io/badge/NextAuth-v4-blueviolet?style=for-the-badge&logo=next.js)](https://next-auth.js.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=for-the-badge&logo=prisma)](https://prisma.io)

**GitComBridge** is a powerful, unified contribution graph generator that seamlessly merges your coding activity from both **GitHub** and **GitLab** into one stunning, real-time SVG visualization.

<p align="center">
  <img src="./public/logo.png" width="150" alt="GitComBridge Logo" />
</p>

## ✨ Key Features

- 🔗 **Dual-Platform Sync**: Connect both GitHub and GitLab accounts to see your complete impact.
- 🎨 **Premium SVG Generation**: Beautiful, GitHub-style contribution squares with high-quality gradients.
- 🌓 **Dynamic Themes**: Built-in support for Dark and Light modes.
- ⚡ **High Performance**: Optimized with parallel API fetching and edge caching.
- 🔐 **Security First**: AES-256-GCM encryption for all stored access tokens.
- 🇹🇭 **Bi-lingual Support**: Full support for English and Thai languages.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub OAuth App credentials
- GitLab OAuth Application credentials

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your_postgresql_url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_here"

# GitHub
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"

# GitLab
GITLAB_ID="your_gitlab_client_id"
GITLAB_SECRET="your_gitlab_client_secret"

# Security
ENCRYPTION_KEY="your_32_byte_or_64_hex_key"
```

### Installation

```bash
# Install dependencies
npm install

# Push database schema
npx prisma db push

# Run development server
npm run dev
```

## 🛠 Usage

Once your accounts are linked, you can embed your unified graph anywhere using our dynamic API:

### Markdown Hook
```markdown
![Unified Graph](https://your-domain.com/api/graph/YOUR_USERNAME?theme=dark)
```

### Parameters
| Parameter | Description | Options |
|-----------|-------------|---------|
| `theme`   | Visual style | `dark` (default), `light` |
| `t`       | Cache breaker | Any timestamp string |

## 📐 Architecture

- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Framer Motion
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: Prisma ORM with PostgreSQL
- **Visualization**: Custom SVG Generator (Vanilla JS)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/tahpapangkorn/gitcombridge/issues).

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Created with ❤️ by [Papangkorn PJ.](https://github.com/tahpapangkorn)
