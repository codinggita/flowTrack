
# 💸 FlowTrack

> **One dashboard for all your money** — UPI apps, cards, wallets, bank accounts & subscriptions in a premium, high-fidelity interface.

---

## 🔍 Overview

FlowTrack is a **personal finance dashboard** built specifically for the Indian payment ecosystem. It brings all your money activity into one place with a focus on **visual excellence**, **smooth interactions**, and **data clarity**.

The application follows a strict **"Triple-Black" tonal design aesthetic**—prioritizing depth through layering rather than shadows, using vibrant green accents, and featuring high-performance custom SVG visualizations.

---

## ✨ Features Implemented

- 🎨 **Premium UI/UX**: Custom "Triple-Black" tonal theme with glassmorphism and modern typography (Manrope & Inter).
- 📊 **Custom Data Visualizations**: 
    - **Animated Area Charts**: High-performance SVG paths with cubic-bezier transitions.
    - **Donut Charts**: Dynamic stroke-dasharray animations for category breakdowns.
    - **Interactive Progress Bars**: Tiered spending indicators for merchants.
- 🔐 **Advanced Authentication**: Fully functional Login and Registration pages with **Formik** + **Yup** validation, icon-prefixed inputs, and password toggles.
- 🏦 **Comprehensive Dashboard**:
    - **KPI Cards**: Real-time snapshots of Net Worth, Monthly Budget, and Savings.
    - **Monthly Trend**: Interactive spending trends over time.
    - **Recent Activity**: High-density transaction logs.
- 📂 **Feature Modules**:
    - **Transactions**: Advanced filtering, categorization, and paginated data tables.
    - **Accounts**: Unified view of UPI apps, Bank accounts, and Credit cards.
    - **Reports**: Depth-first analysis of income vs. expenses and merchant-specific trends.
    - **Recurring**: Subscription management with renewal countdowns and real brand logos (Netflix, Spotify, etc.).
    - **Settings**: Complete user profile controls, security toggles, and session monitoring.
- 🚀 **Performance**: Staggered entrance animations and optimized React 19 rendering.
- 🎫 **Support Center**: Integrated ticketing system with Formspree notifications, FAQs, and help articles.
- ⚖️ **Legal & Compliance**: Built-in Privacy Policy, Terms of Service, and a Consent Management system (DPDP Act compliant).
- 🔔 **Intelligent Notifications**: Real-time spending alerts, low balance warnings, and subscription reminders.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Core** | React 19 + Vite |
| **Styling** | Tailwind CSS v4 + Vanilla CSS |
| **UI Components** | Material UI (MUI) 9 |
| **Charts** | Custom Inline SVG + CSS Animations (No external chart libraries) |
| **Forms** | Formik + Yup |
| **Routing** | React Router 7 |

---

## 📸 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| 🏠 **Dashboard** | `/dashboard` | Monthly summary, trend charts, and quick-action KPIs. |
| 💸 **Transactions** | `/transactions` | Filterable list of all activity with category management. |
| 🏦 **Accounts** | `/accounts` | Manage GPay, PhonePe, Cards, and Bank accounts. |
| 📈 **Reports** | `/reports` | Deep-dive trends and merchant spending progress. |
| 🔁 **Recurring** | `/recurring` | Subscription tracker with real brand branding. |
| ⚙️ **Settings** | `/settings` | User profile, security settings, and notifications. |
| 🎫 **Support** | `/support` | Help center, FAQs, and ticket submission. |
| ⚖️ **Legal** | `/terms`, `/privacy` | Legal compliance and data protection policies. |
| 🔐 **Auth** | `/login`, `/register` | Professional authentication with Forgot Password flow. |

---

## 🚀 Getting Started

1. **Environment Setup**:
   - Create a `.env` file in the `Backend` folder (see `.env.example`).
   - Create a `.env` file in the `Frontend` folder (see `.env.example`).

2. **Install Dependencies**:
   ```bash
   # Root directory
   npm install

   # Backend directory
   cd Backend && npm install

   # Frontend directory
   cd ../Frontend && npm install
   ```

3. **Run Development Servers**:
   ```bash
   # Terminal 1 (Backend)
   cd Backend && npm run dev

   # Terminal 2 (Frontend)
   cd Frontend && npm run dev
   ```

4. **Open the App**:
   Visit `http://localhost:5173` to see the dashboard.

---

## 🚀 Deployment Instructions

### Backend (Render / Railway / Heroku)
1. Set the following environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string for tokens.
   - `EMAIL_USER` & `EMAIL_PASS`: Your Gmail/SMTP credentials.
   - `CLIENT_URL`: Your deployed frontend URL.
   - `FORMSPREE_URL`: Your Formspree endpoint for admin alerts.

### Frontend (Vercel / Netlify)
1. Set the following environment variables:
   - `VITE_API_URL`: Your deployed backend API URL (e.g., `https://api.yourdomain.com/api`).
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.


---

## 🎨 Design Reference

* 🔗 [Figma Design](https://www.figma.com/design/drhC7vDVlQUDH97dLY1XoT/Untitled?node-id=0-1&t=5bhMn4Wi6TsHoY4d-1)
* 🚀 [Figma Prototype](https://www.figma.com/proto/drhC7vDVlQUDH97dLY1XoT/Untitled?node-id=2-286&viewport=-2915%2C157%2C0.36&t=JxkcVty4PfyYElJ2-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=2%3A348&page-id=0%3A1)

---

*Built with ❤️ for the Indian digital payment ecosystem.*
