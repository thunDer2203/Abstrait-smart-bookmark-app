# 🚀 SmartBookmark

SmartBookmark is a modern, private, real-time bookmark manager built using Next.js (App Router) and Supabase.

It allows users to securely log in with Google, save bookmarks, delete them, and see updates instantly across multiple tabs — while keeping all user data completely private using database-level security.

---

## 🌟 Live Demo

Live URL:
https://abstrait-smart-bookmark-app.vercel.app/

GitHub Repository:
https://github.com/thunDer2203/Abstrait-smart-bookmark-app

---

## 🧠 What This Project Does

SmartBookmark allows users to:

- Sign in securely using Google OAuth
- Add bookmarks (Title + URL)
- Delete their own bookmarks
- See real-time updates across multiple tabs
- Keep bookmarks fully private per user

Each user's data is isolated using Row Level Security (RLS) policies.

---

## 🛠️ Tech Stack

- Next.js (App Router)
- Supabase
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Realtime (WebSockets)
- Tailwind CSS
- Vercel (Deployment)

---

## 🏗️ Architecture Overview

Next.js Frontend
        ↓
Supabase Authentication (Google OAuth)
        ↓
PostgreSQL Database
        ↓
Row Level Security (User Isolation)
        ↓
Supabase Realtime (WebSockets)

---

## 🔐 Security Implementation

The bookmarks table is protected using Row Level Security policies:

auth.uid() = user_id

This ensures:

- Users can only view their own bookmarks
- Users cannot modify other users’ data
- Secure multi-user architecture

---

## 🗄️ Database Schema

create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp default now()
);

---

## ⚡ Real-Time Functionality

Supabase Realtime listens to database changes and broadcasts updates using WebSockets.

When a bookmark is:
- Added
- Deleted

All open tabs update instantly without refreshing.

To properly support DELETE events, the following was configured:

alter table bookmarks replica identity full;

The table was also added to:
Database → Publications → supabase_realtime

---

## 🧩 Challenges Faced & Solutions

1. Google OAuth "Unsupported provider" Error

Issue:
Unsupported provider: provider is not enabled

Cause:
Google provider was not enabled in Supabase Authentication settings.

Solution:
- Enabled Google provider in Supabase
- Configured OAuth credentials in Google Cloud Console
- Added correct redirect URI:
  https://PROJECT_ID.supabase.co/auth/v1/callback

---

2. Module Not Found (`@/lib/supabaseClient`)

Issue:
Next.js could not resolve the Supabase client import.

Cause:
The project used a `src/` directory structure, but the file was created outside it.

Solution:
Moved the file to:
src/lib/supabaseClient.js

---

3. Delete Not Updating in Real-Time

Issue:
Bookmarks were deleted successfully but changes were not reflected across tabs in real time.

Cause:
- The bookmarks table was not added to supabase_realtime publication
- PostgreSQL replica identity was not set to FULL

Solution:
- Added bookmarks table to Database → Publications → supabase_realtime
- Ran:
  alter table bookmarks replica identity full;

---

4. Understanding RLS + Realtime Interaction

Issue:
Realtime DELETE events were not firing even though delete worked.

Cause:
Supabase must be able to SELECT deleted rows to broadcast them.

Solution:
Ensured correct SELECT policy:

create policy "Users can view their own bookmarks"
on bookmarks
for select
using (auth.uid() = user_id);

---

## 🚀 Running Locally

1. Clone the repository

git clone https://github.com/thunDer2203/Abstrait-smart-bookmark-app.git
cd Abstrait-smart-bookmark-app

2. Install dependencies

npm install

3. Create a .env.local file

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Start development server

npm run dev

Open:
http://localhost:3000

---

## 🌍 Deployment

This project is deployed using Vercel.

Deployment steps:

1. Push project to GitHub
2. Import repository into Vercel
3. Add environment variables
4. Deploy

---

## 🎯 Key Learnings

Through building SmartBookmark, I gained experience in:

- Implementing OAuth authentication
- Securing applications with Row Level Security
- Working with PostgreSQL logical replication
- Handling real-time updates via WebSockets
- Debugging production-level auth and realtime issues
- Deploying full-stack applications

---

## 🔮 Future Improvements

- Edit bookmark functionality
- Bookmark tagging system
- Search & filtering
- Dark mode toggle
- Optimistic UI updates
- Improved error handling and loading states

---

## 👨‍💻 Author

Built as part of a full-stack development assignment using modern web technologies.
