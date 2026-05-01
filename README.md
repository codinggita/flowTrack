
# 💸 FlowTrack — Premium Finance Management

> **One dashboard for all your money** — Unified tracking for bank accounts, UPI activity, cards, and subscriptions in a high-fidelity, professional interface.

**🌐 Live Platform:** [https://flow-track-full-stack.vercel.app](https://flow-track-full-stack.vercel.app)

**🌐 Docs link**: https://documenter.getpostman.com/view/50840877/2sBXqKnewR

---

## 🔍 Overview

FlowTrack is a **full-stack personal finance dashboard** designed for modern digital payment ecosystems. It centralizes all your financial activity with a focus on **visual excellence**, **smooth interactions**, and **actionable data clarity**.

The application adheres to a strict **"Triple-Black" tonal design aesthetic**, prioritizing depth through layering, vibrant green accents, and high-performance custom SVG visualizations for a truly premium feel.

---

## ✨ Features Implemented

### 🎨 Visual Excellence
- **Triple-Black Design**: A custom tonal theme built with glassmorphism and modern typography (Manrope & Inter).
- **Custom Charts**: High-performance SVG paths with cubic-bezier transitions for spending trends and category breakdowns.
- **Micro-animations**: Staggered entrance animations and optimized React 19 rendering for a smooth UX.

### 🏦 Core Finance Modules
- **Dashboard**: Real-time snapshots of Net Worth, Monthly Budget, and Savings with interactive spending trends.
- **Transactions**: Advanced filtering, categorization, and paginated logs for all financial activity.
- **Accounts**: Unified management of UPI apps (GPay, PhonePe), Bank accounts, and Credit cards.
- **Reports**: Deep-dive analysis of Income vs. Expenses and merchant-specific trends.
- **Subscriptions**: Recurring payment tracker with renewal countdowns and real brand logos.

### 🔐 Security & Backend
- **Advanced Auth**: JWT-based authentication with Login, Register, and Password Reset flows.
- **Session Management**: Monitor and manage active sessions for enhanced security.
- **Audit Logs**: Backend activity logging to track critical account changes.
- **Automated Jobs**: Cron jobs for recurring payment processing and notification alerts.

### 🎫 Support & Compliance
- **Support Center**: Integrated ticketing system with admin notifications via Formspree.
- **Legal Compliance**: Built-in Privacy Policy, Terms of Service, and a GDPR/DPDP Act compliant Consent Management system.
- **Notifications**: Real-time spending alerts and subscription reminders.

### ⚡ Performance & SEO (New)
- **Lazy Loading**: Route-based code splitting using `React.lazy` and `Suspense` for minimal initial bundle size.
- **Virtualization**: Implemented `react-window` for the transactions table to maintain 60fps scrolling with large datasets.
- **Advanced SEO**: Dynamic route-specific meta tags and Open Graph data using `react-helmet-async`.
- **Structured Data**: Injected JSON-LD Schema.org data for WebApplication, Organization, and FAQ rich snippets.
- **PWA & Discovery**: Auto-generated `sitemap.xml`, optimized `robots.txt`, and full PWA `manifest.json`.

### 🌍 Localization & Theming (New)
- **Bilingual Support**: Fully functional English and Hindi (हिंदी) translations across the entire application using Context API.
- **Dynamic Theme System**: Real-time Light, Dark, and System (OS-level) theme toggling persisted via localStorage and backend syncing.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + Vite |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Styling** | Tailwind CSS v4 + Vanilla CSS |
| **Auth** | JSON Web Tokens (JWT) + Bcrypt |
| **Communications** | Nodemailer (Email) + Formspree |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### 2. Environment Setup
Create a `.env` file in both `Backend` and `Frontend` directories based on the provided `.env.example` files.

### 3. Installation
```bash
# Clone the repository
git clone https://github.com/SwarajPrajapati2006/flowTrack.git
cd flowTrack

# Install Backend dependencies
cd Backend
npm install

# Install Frontend dependencies
cd ../Frontend
npm install
```

### 4. Running Locally
```bash
# Terminal 1: Backend
cd Backend
npm run dev

# Terminal 2: Frontend
cd Frontend
npm run dev
```

Visit `http://localhost:5173` to experience FlowTrack.

---

## 📦 Project Structure

```text
flowTrack/
├── Backend/
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Database schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth & Error handling
│   │   └── utils/         # Helpers (Tokens, Emails)
│   └── server.js          # Entry point
├── Frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI & Layout
│   │   ├── pages/         # Screen views
│   │   ├── hooks/         # Custom React hooks
│   │   └── services/      # API client
│   └── index.html
└── README.md
```

---

## 🚀 Deployment

### Backend (Render / Railway)
1. Set the following Env Vars: `MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `CLIENT_URL`.
2. Ensure the database whitelist allows connections from your deployment provider.

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed backend URL.
2. Configure your build command as `npm run build` and output directory as `dist`.

---

*Built with ❤️ for the Indian digital payment ecosystem.*
