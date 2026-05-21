# Regroup Refocus Rebuild — Full-Stack Web Application

React + Node.js + PostgreSQL rebuild of [regrouprefocusrebuild.org](https://www.regrouprefocusrebuild.org/)

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express, Multer, Nodemailer |
| Database | PostgreSQL 15 |
| Server | Nginx (reverse proxy + static files) |
| Deployment | Docker Compose on Vultr Cloud Compute |

## Pages

- **Home** — Hero slider, author profile, books, philosophy, blog preview
- **About** — Natalie's bio, credentials, mission statement
- **Public Speaking** — Topics, formats, booking CTA
- **The Boutique** — Merchandise shop with category filtering
- **Auction Items** — Fundraising auction with live bidding display
- **RRR Non Profit** — Mission, programs, get-involved section
- **Signed Books** — Full book catalog with signed copy ordering
- **Blog** — Paginated posts with category filtering + individual post pages
- **Contact** — Form with email notification + database storage

## Local Development

```bash
# 1. Start PostgreSQL (Docker)
docker compose up postgres -d

# 2. Backend
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev            # http://localhost:5000

# 3. Frontend
cd frontend
npm install
npm run dev            # http://localhost:3000
```

## Production (Docker Compose)

```bash
cp .env.example .env   # fill in production values
docker compose up -d --build
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `DB_PASSWORD` | PostgreSQL password |
| `SMTP_USER` | Gmail address for contact form |
| `SMTP_PASS` | Gmail App Password |
| `FRONTEND_URL` | Your domain (for CORS) |

## Vultr Deployment

```bash
# On a fresh Ubuntu 22.04 VPS:
bash deployment/vultr-setup.sh

# For subsequent deploys:
bash deployment/deploy.sh
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/books` | All books |
| GET | `/api/blog` | Blog posts (paginated) |
| GET | `/api/blog/recent` | 3 most recent posts |
| GET | `/api/blog/:slug` | Single post |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/products` | Boutique products |
| GET | `/api/auction` | Auction items |
| GET | `/api/speaking` | Speaking events |
| GET | `/api/nonprofit` | Nonprofit programs |
| GET | `/api/slides` | Hero slider data |
| POST | `/api/upload` | Upload image |

## Author

Natalie Cabinda — Educator, Author, Mentor, Speaker, Consultant  
[nataliecabinda@gmail.com](mailto:nataliecabinda@gmail.com)
