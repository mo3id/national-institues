<div align="center">

<br/>

<img src="https://img.shields.io/badge/National%20Institutes-Schools%20Portal-1e3a8a?style=for-the-badge&logo=graduation-cap&logoColor=white" alt="NIS Badge" height="40"/>

<br/><br/>

# 🏛️ National Institutes Schools Portal
### *الجمعية العامة للمعاهد القومية*

**The official digital portal for Egypt's largest educational network — 40+ schools, 5 governorates, 68+ years of excellence.**

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-CDN-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Dynamic-FF69B4?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

<br/>

</div>

---

## ✨ Overview

The **National Institutes Schools Portal (NIS)** is a premium, high-performance web application designed for Egypt's prestigious educational network. It blends **modern design aesthetics** with **powerful administrative tools**, serving students, parents, and educators with a seamless bilingual experience.

> *"A legacy built on excellence since 1956 — nurturing the leaders of tomorrow with innovation and pride."*

---

## 🚀 Key Features

### 🎨 Premium User Experience
*   **Bilingual & RTL-Ready**: Seamlessly toggle between Arabic 🇪🇬 and English 🇬🇧 with synchronized RTL/LTR layouts.
*   **Glassmorphism & Micro-animations**: Stunning UI powered by Framer Motion for a "premium" feel.
*   **Custom Scrollbars**: Branded scrollbars that match the school's identity (Blue & Red).
*   **Responsive Masterpiece**: Perfectly fluid across mobile (`sm`), tablet (`md`), and desktop (`lg/xl`).

### 🛠️ Advanced Admin Dashboard
*   **Full Content Management**: Manage News, School profiles, and Hero sliders in real-time.
*   **Smart Analytics**: Overview of total articles, schools, and student metrics.
*   **Mobile-First Admin**: A completely responsive sidebar and table-to-card reflow for managing the portal on the go.
*   **Role-Based UI**: Dedicated views for content managers and administrators.

### 🌐 Informational Hub
*   **Interactive Egypt Map**: Geographically accurate map of governorates to explore regional school networks.
*   **News & Story Center**: Dynamic news carousel and "Full Story" detail pages with creative layouts.
*   **Careers & Recruitment**: Integrated job board with CV upload and application tracking.
*   **Dynamic Schools Directory**: Advanced filtering by governorate, type, and search queries.

### 🤖 AI-Powered (AI Studio)
*   **Gemini Integration**: Utilizing Google's Gemini AI for generating school insights and automated content analysis.

---

## 🏗️ Technical Architecture

### 🧰 Tech Stack
```text
├── ⚛️  React 19 (Latest)   — Component-based UI architecture
├── 🔷  TypeScript 5.8       — Complete type safety & robust logic
├── ⚡  Vite 6.2             — Instant HMR & optimized production bundling
├── 🎨  Tailwind CSS (CDN)   — Rapid, utility-first styling
├── 🎭  Framer Motion        — Orchestrating complex UI transitions
├── 🤖  Google Gemini API    — State-of-the-art AI features
├── 🧭  React Router 7       — Intelligent client-side navigation
└── 🔣  Lucide React         — Premium vector-based iconography
```

### 📁 Smart Directory Structure
```text
national-institues/
├── 📂 components/      — Reusable UI logic (Navbar, Hero, ScrollReveal, NISLogo)
├── 📂 pages/           — Feature-rich page layouts (Dashboard, NewsDetail, AIStudio, About)
├── 📂 LanguageContext/  — Global i18n orchestration & persistence
├── 📄 translations.ts  — Master bilingual dictionary (JSON-based)
├── 📄 constants.ts     — Core data store (Schools, News, Jobs)
└── 📄 App.tsx          — The central nervous system (Routing & Suspense)
```

---

## 🚦 Getting Started

### 1. 📂 Clone & Install
```bash
git clone https://github.com/mo3id/national-institues.git
cd national-institues
npm install
```

### 2. 🔑 Configure Keys
Create a `.env.local` to power the AI Studio:
```env
VITE_GEMINI_API_KEY=your_key_here
```

### 3. ⚡ Launch Development
```bash
npm run dev
```

---

## 🏛️ Coverage
Strategically empowering the future across **5 Key Governorates**:
| 🏙️ Cairo | 🌊 Alexandria | 🏛️ Giza | 🌾 Dakahlia | 🏘️ Gharbia |
|:---:|:---:|:---:|:---:|:---:|
| 12 Schools | 4 Schools | 6 Schools | 3 Schools | 2 Schools |

---

## 🔒 Security & Performance
*   **Lazy Loading**: Pages are asynchronously loaded to prioritize the landing experience.
*   **Protected Routes**: Administrative features (Dashboard) secured with authentication guards.
*   **Optimized Assets**: CSS/JS minification and SVG-first graphics for lighting fast performance.

---

<div align="center">

### **National Institutes of Schools**
*Educating the Nation. Empowering the Future.*

[Explore the Portal](http://localhost:3000)

**© 2024 General Assembly of National Institutes. All rights reserved.**

</div>
