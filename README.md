
# 💸 FlowTrack

> **One dashboard for all your money** — UPI apps, cards, wallets, bank accounts & subscriptions in plain Hindi/English language.

---

## 🔍 Problem Statement

**Why do people struggle to track where their money goes each month?**

Most Indians use 4–7 different payment apps — GPay, PhonePe, Paytm, credit cards, bank accounts, and cash — but none of them talk to each other. At the end of the month, there's no single place to see the full picture. People end up confused, overspending unknowingly, and missing subscription renewals — simply because their financial data is scattered everywhere.

---

## 💡 The Idea

FlowTrack is a **personal finance dashboard** built specifically for the Indian payment ecosystem. It brings all your money activity into one place and explains it back to you in plain, simple language — like having a financially aware friend who tells you:

> *"You spent ₹8,450 on food & beverages this month (mostly Swiggy & local dhabas)."*

No jargon. No 7 separate apps. Just clarity.

---

## 🧠 How It Works

### 1. Connect Your Accounts
Add your UPI apps (GPay, PhonePe), bank accounts, credit/debit cards, wallets, or cash accounts manually. Each account is tracked independently and shown on a unified dashboard.

### 2. Import Your Transactions
- **Manual entry** — add transactions one by one via a simple form
- **CSV Upload** — import directly from GPay, PhonePe, or bank statement exports

### 3. Auto-Categorization
FlowTrack reads transaction names and auto-assigns categories using a keyword-based rule engine (`categoryMap.js`):

| Keyword Match | Category |
|---------------|----------|
| Swiggy, Zomato, Dhaba | 🍔 Food & Drinks |
| Uber, Ola, Metro | 🚗 Transport |
| Netflix, Spotify, Hotstar | 📺 Subscriptions |
| Amazon, Flipkart, Myntra | 🛍️ Shopping |
| Apollo, Practo, Chemist | 💊 Health |

### 4. Dashboard & Insights
The dashboard gives you a full monthly overview:
- **Plain-language summary** of where your money went
- **Pie chart** — spending split by category
- **Bar chart** — daily or weekly spending trend
- **Recent transactions** — last 10 entries at a glance
- **Income vs Expense vs Net Savings** — monthly report

### 5. Subscription Tracker
FlowTrack detects recurring charges and shows upcoming renewals with a **7-day warning** so you're never caught off guard.

---

## 📸 Pages Overview

| Page | What It Does |
|------|--------------|
| 🏠 **Dashboard** | Monthly summary, charts, recent transactions, plain-language insight |
| 💸 **Transactions** | Full transaction list, filter by month/category, manual add |
| 🏦 **Accounts** | Manage GPay, PhonePe, Cards, Bank accounts, Cash |
| 📅 **Reports** | Month-wise breakdown, income vs expense, category table |
| 🔁 **Recurring** | Subscription tracker with 7-day renewal warnings |

---

## ✅ What We Are Building (Phase 1 — MVP)

- 🔐 **User Auth** — Signup / Login with JWT (dark theme by default)
- 🏦 **Multi-Account Support** — UPI, Bank, Card, Wallet, Cash
- 💸 **Manual Transaction Entry** — simple add-transaction form
- 📂 **CSV Import** — from GPay / PhonePe / Bank exports
- 🤖 **Auto-Categorization** — keyword-based rule engine
- 📊 **Dashboard** — summary sentence + pie chart + bar chart + recent list
- 📅 **Monthly Reports** — income, expense & net savings view
- 🔁 **Recurring Tracker** — subscriptions with renewal alerts

---

## 🚀 What Comes Next (Phase 2)

- 📢 Budget alerts — warn when you hit 85% of monthly limit
- 🧠 Smart Insight Cards — *"42% more on transport than last month"*
- 📄 Export monthly report as PDF
- 📱 Full mobile responsive + PWA support
- 🤖 Gemini API integration for smarter AI categorization

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + JSX |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Free 512MB) |
| Auth | JWT + bcrypt |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

Everything used is **100% free tier** — no paid services required to run or deploy.

---
## 🎨 Design & Prototype

Explore the UI/UX design and interactive prototype below:

* 🔗 [Figma Design](https://www.figma.com/design/drhC7vDVlQUDH97dLY1XoT/Untitled?node-id=0-1&t=5bhMn4Wi6TsHoY4d-1)
* 🚀 [Figma Prototype](https://www.figma.com/proto/drhC7vDVlQUDH97dLY1XoT/Untitled?node-id=2-286&viewport=-2915%2C157%2C0.36&t=JxkcVty4PfyYElJ2-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=2%3A348&page-id=0%3A1)

## 🎯 Who Is This For?

Any Indian who earns a salary, uses UPI, and wonders where their money disappears every month. FlowTrack is built for the everyday user — not accountants, not finance nerds — just regular people who want honest, simple answers about their spending.

---

*Built with ❤️ for the Indian digital payment ecosystem.*
