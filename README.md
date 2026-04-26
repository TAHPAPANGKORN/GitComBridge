# 🌉 GitComBridge

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-626cd9?style=for-the-badge&logo=stripe)](https://stripe.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=for-the-badge&logo=prisma)](https://prisma.io)

**GitComBridge** is a powerful, unified contribution graph generator that seamlessly merges your coding activity from both **GitHub** and **GitLab** into one stunning, real-time SVG visualization.

## ✨ Key Features

- 🔗 **Dual-Platform Sync**: Connect both GitHub and GitLab accounts to see your complete impact.
- 🎨 **12+ Premium Themes**: From classic `dark`/`light` to `Neon`, `Monokai`, `Sakura`, and `Ocean`.
- 📐 **Flexible Layouts**: Choose between **Horizontal** (standard) or **Vertical** (sidebar style).
- 🛠 **Pro Customization**: Set custom titles, adjust cell sizes (S to XL), and control time ranges.
- 💳 **PromptPay & Card Support**: Easy one-time upgrade to Pro via Stripe (Localized for Thailand).
- 🔐 **Security First**: 
  - **AES-256-GCM**: Industry-standard encryption for all stored access tokens.
  - **Token Scrubbing**: Automatic removal of plaintext tokens from the database.
  - **XSS Protection**: Full SVG entity escaping for user-generated content.
- 🇹🇭 **Bi-lingual Support**: Full support for English and Thai languages.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub OAuth App & GitLab OAuth Application
- Stripe Account (for Pro payments)

### Environment Variables

Create a `.env` file based on our requirements:

```env
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret"

# GitHub & GitLab OAuth
GITHUB_ID="..."
GITHUB_SECRET="..."
GITLAB_ID="..."
GITLAB_SECRET="..."

# Security
ENCRYPTION_KEY="32_byte_hex_key"

# Stripe (PromptPay ready)
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
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

## 📐 Parameters API

Embed your graph anywhere using our dynamic API:

`![Graph](https://gitcombridge.com/api/graph/username?theme=neon&layout=vertical)`

| Parameter | Tier | Description | Options |
|-----------|------|-------------|---------|
| `theme`   | Mixed | Visual style | `dark`, `light`, `neon`, `monokai`, etc. |
| `layout`  | Pro | Graph orientation | `horizontal` (default), `vertical` |
| `cellSize`| Pro | Size of squares | `S`, `M`, `L`, `XL` |
| `title`   | Pro | Custom header text | Any escaped string |
| `weeks`   | Pro | Time range | `26`, `52`, `104` |
| `hideWatermark` | Pro | Remove brand logo | `true` / `false` |

## 🛡 Security Architecture

1. **Encryption**: OAuth tokens are encrypted using `AES-256-GCM` before storage. The `IV` and `AuthTag` are stored to ensure data integrity.
2. **Server-Side Validation**: All Pro parameters are validated on the server. Free users cannot bypass restrictions via URL manipulation.
3. **SVG Sanitization**: User titles are escaped to prevent XSS attacks within SVG documents.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/tahpapangkorn/gitcombridge/issues).

---
Created with ❤️ by [Papangkorn PJ.](https://github.com/tahpapangkorn)
