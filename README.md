
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
| 🔐 **Auth** | `/login`, `/signup` | Professional authentication entry points. |

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open the App**:
   Visit `http://localhost:5173` to see the dashboard.

---

## 🎨 Design Reference

* 🔗 [Figma Design](https://www.figma.com/design/drhC7vDVlQUDH97dLY1XoT/Untitled?node-id=0-1&t=5bhMn4Wi6TsHoY4d-1)
* 🚀 [Figma Prototype](https://www.figma.com/proto/drhC7vDVlQUDH97dLY1XoT/Untitled?node-id=2-286&viewport=-2915%2C157%2C0.36&t=JxkcVty4PfyYElJ2-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=2%3A348&page-id=0%3A1)

---

*Built with ❤️ for the Indian digital payment ecosystem.*
