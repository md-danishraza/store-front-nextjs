# 🛍️ Next.js Webshop

A **full-stack e-commerce application** built with **Next.js 14**, featuring authentication, an admin panel, product management, cart functionality, reviews, and payment integration (Razorpay) yet lo live.

---

## 🚀 Features

- **Authentication & Authorization** – powered by [Clerk](https://clerk.com) with middleware-protected routes
- **Admin Panel**
  - CRUD operations for products
  - View & manage sales
- **Product Management**
  - Featured products
  - Grid & list views
  - Global search bar with debouncing
  - Favorite & review products
  - Dedicated reviews & rating page for each user
- **Cart & Orders**
  - Add/remove/update items
  - Cart totals update dynamically with **animated count numbers**
  - Orders page for users
- **Checkout**
  - Integrated with **Razorpay** (not live)
- **UI/UX**
  - [shadcn/ui](https://ui.shadcn.com/) components
  - Dark/Light theme toggle with `next-themes`
  - Clerk-controlled inputs & forms
  - Responsive, modern design
- **Tech Stack**
  - **Next.js 14 App Router** (server actions, nested layouts)
  - **Supabase** (Postgres + Storage for images)
  - **Prisma** ORM
  - **TailwindCSS** + Radix UI
  - **Zod** for runtime validation

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: [Postgres](https://www.postgresql.org/) via [Supabase](https://supabase.com)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [Clerk](https://clerk.com)
- **Payments**: [Razorpay](https://razorpay.com/) (sandbox mode)
- **UI**: [shadcn/ui](https://ui.shadcn.com/), Radix UI, TailwindCSS
- **Validation**: [Zod](https://zod.dev/)

---
