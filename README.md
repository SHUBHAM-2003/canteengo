# CanteenGo - College Canteen Ordering System

A modern ordering system built with Next.js, Supabase, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase
- **Styling**: CSS (custom properties)
- **Deployment**: Vercel

## Features

- Student menu browsing and ordering
- Live order status tracking (5-second polling)
- Table-based ordering with QR codes
- Manager dashboard with:
  - Overview stats
  - Order management
  - Menu editing
  - Table & QR management
  - Banner offers
  - User accounts
- Authentication via Supabase Auth
- Mood popup (once per day)
- Banner carousel on homepage and menu

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd canteengo
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and click **Start a project**
2. Give it a name (e.g. "CanteenGo") and set a secure database password
3. Wait for the database to provision (~1 minute)

### 3. Get Your Supabase Keys

1. In your Supabase project dashboard, go to **Settings → API**
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy the **anon public** key (starts with `eyJ...`)

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the `supabase/schema.sql` file from this project and copy all contents
4. Paste into SQL Editor and click **Run**
5. This will create all required tables, seed data, and demo users

### 6. Set Up Authentication

1. In Supabase dashboard, go to **Authentication → Settings**
2. Under **Email Auth**, make sure it's enabled
3. Disable **Confirm email** for demo purposes (so users don't need email confirmation)

### 7. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 8. Demo Accounts

After running the schema.sql, you can log in with:

| Email | Password | Role |
|-------|----------|------|
| student@demo.com | demo123 | Student |
| manager@demo.com | demo123 | Manager |

## Deployment to Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**
3. Import your GitHub repository
4. Add the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key
5. Click **Deploy**
6. That's it! Your app is live.

## Project Structure

```
canteengo/
├── app/
│   ├── page.js              # Homepage
│   ├── layout.js            # Root layout
│   ├── login/page.js        # Login page
│   ├── menu/page.js         # Student menu
│   ├── order/[id]/page.js   # Order status page
│   ├── manager/page.js      # Manager dashboard
│   └── api/                 # API routes
│       ├── auth/login/route.js
│       ├── menu/route.js
│       ├── orders/route.js
│       ├── orders/[id]/route.js
│       ├── categories/route.js
│       ├── tables/route.js
│       ├── banners/route.js
│       ├── accounts/route.js
│       └── stats/route.js
├── lib/
│   └── supabase.js          # Supabase client
├── supabase/
│   └── schema.sql           # Database schema
├── next.config.mjs
├── .env.local.example
├── .gitignore
└── package.json
```
