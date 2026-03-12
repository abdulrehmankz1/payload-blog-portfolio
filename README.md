# 🚀 Payload Blog & Portfolio

A production-ready **Blog + Portfolio CMS** built with [Payload CMS 3](https://payloadcms.com/) and [Next.js 15](https://nextjs.org/). Manage your blog posts and projects from a beautiful admin panel with a fast, SEO-friendly Next.js frontend.

**Built by [Abdul Rehman Khanzada](https://github.com/abdulrehmankz1)**

---

## 🔗 Links

- **Repository:** [github.com/abdulrehmankz1/payload-blog-portfolio](https://github.com/abdulrehmankz1/payload-blog-portfolio)
- **Live Demo:** Coming soon

---

## 🎯 Demo Access

Want to explore the admin panel? Use these credentials:

| Field | Value |
|-------|-------|
| **URL** | `/admin` |
| **Email** | `user@demo.com` |
| **Password** | `demo12345` |

> ⚠️ Please do not change the demo credentials or delete existing content.

---

## ✨ Features

- **Blog** — Rich text posts with cover images, categories, tags, author, reading time, and full SEO control
- **Portfolio** — Project showcase with tech stack badges, screenshot gallery, live demo & GitHub links
- **Admin Panel** — Full Payload CMS admin at `/admin` — batteries included
- **Role-Based Access** — Admin and Author roles with per-collection permissions
- **Auto Slug Generation** — Slugs auto-generate from titles on creation
- **Responsive Images** — Auto-generates thumbnail, card, and hero sizes on every upload
- **Draft / Publish System** — Work in drafts, publish when ready
- **Reading Time** — Auto-calculated from post content
- **SEO Ready** — Meta title, meta description, and Open Graph image per post and project
- **Type Safe** — Full TypeScript with auto-generated Payload types

---

## 🗄️ Collections

| Collection | Purpose |
|------------|---------|
| `users` | Authentication with Admin / Author roles |
| `media` | Image uploads with auto-resize (thumbnail, card, hero) |
| `categories` | Shared taxonomy for posts and projects |
| `posts` | Blog posts with rich text, SEO, and publishing workflow |
| `projects` | Portfolio projects with tech stack, links, and gallery |

---

## 📁 Project Structure

```
src/
├── collections/
│   ├── Users.ts
│   ├── Media.ts
│   ├── Categories.ts
│   ├── Posts.ts
│   └── Projects.ts
├── app/
│   ├── (frontend)/
│   │   ├── page.tsx              # Homepage
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing
│   │   │   └── [slug]/page.tsx   # Single post
│   │   └── projects/
│   │       ├── page.tsx          # Projects listing
│   │       └── [slug]/page.tsx   # Single project
│   └── (payload)/
│       └── api/[...slug]/route.ts  # Payload API handler
└── payload.config.ts
```

---

## 🛠️ Local Setup

### Prerequisites

- Node.js 18.20+ or 20+
- pnpm (`npm install -g pnpm`)
- MongoDB — local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)

### 1. Clone the Repository

```bash
git clone https://github.com/abdulrehmankz1/payload-blog-portfolio.git
cd payload-blog-portfolio
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URI=mongodb://localhost:27017/payload-blog
PAYLOAD_SECRET=your-random-secret-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Generate a secure `PAYLOAD_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start Development Server

```bash
pnpm dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

### 5. Create First Admin User

On first visit to `/admin`, you will be prompted to create an admin account. This becomes your CMS login.

### 6. Generate TypeScript Types

Run this whenever you change a collection:

```bash
pnpm generate:types
```

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add these environment variables in the Vercel dashboard:

| Variable | Value |
|----------|-------|
| `DATABASE_URI` | Your MongoDB Atlas connection string |
| `PAYLOAD_SECRET` | A strong random secret |
| `NEXT_PUBLIC_SERVER_URL` | Your Vercel URL e.g. `https://my-site.vercel.app` |

4. Deploy — done!

---

## 🔌 REST API

Payload auto-generates REST endpoints for all collections:

```bash
# Get all published posts
GET /api/posts?where[status][equals]=published

# Get a single post by slug
GET /api/posts?where[slug][equals]=my-post-slug

# Get all published projects
GET /api/projects?where[status][equals]=published

# Login
POST /api/users/login
Body: { "email": "user@demo.com", "password": "demo12345" }
```

---

## 🧩 Tech Stack

| Technology | Purpose |
|------------|---------|
| [Payload CMS 3](https://payloadcms.com/) | Headless CMS + Admin Panel |
| [Next.js 15](https://nextjs.org/) | React Framework (App Router) |
| [MongoDB](https://www.mongodb.com/) | Database |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Lexical](https://lexical.dev/) | Rich Text Editor |
| [Sharp](https://sharp.pixelplumbing.com/) | Image Processing |

---

## 📄 License

MIT © [Abdul Rehman Khanzada](https://github.com/abdulrehmankz1)
