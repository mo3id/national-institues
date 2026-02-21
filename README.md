<div align="center">

<br/>

<img src="https://img.shields.io/badge/National%20Institutes-Schools%20Portal-1e3a8a?style=for-the-badge&logo=graduation-cap&logoColor=white" alt="NIS Badge" height="40"/>

<br/><br/>

# 🏛️ National Institutes Schools Portal

### *الجمعية العامة للمعاهد القومية*

**The official digital portal for Egypt's largest educational network — 40+ schools, 5 governorates, 68 years of excellence.**

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-CDN-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI%20Powered-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Lucide](https://img.shields.io/badge/Lucide-Icons-F56565?style=flat-square)](https://lucide.dev/)

<br/>

</div>

---

## ✨ Overview

The **National Institutes Schools Portal (NIS)** is a premium, bilingual (Arabic 🇪🇬 / English 🇬🇧) web application serving as the central hub for Egypt's prestigious National Institutes educational network. Built with a modern React + TypeScript stack, it delivers a seamless experience for students, parents, educators, and administrators.

> *"Leading Egyptian education since 1956 — a legacy of excellence, innovation, and national pride."*

---

## 🖼️ Features

| Feature | Description |
|---|---|
| 🌍 **Bilingual (RTL/LTR)** | Full Arabic & English support with proper right-to-left layout switching |
| 💾 **Language Persistence** | Language preference saved via `localStorage` — survives page reloads |
| 🗺️ **Interactive Map** | Clickable Egypt governorate map to browse schools by region |
| 🤖 **AI Studio** | Powered by Google Gemini API for intelligent school analysis & content generation |
| 📰 **News Carousel** | Responsive news carousel — 1 card (mobile) / 2 (tablet) / 3 (desktop) |
| 💼 **Careers Portal** | Job listings with an integrated application form and CV upload |
| 🏫 **Schools Directory** | Searchable & filterable directory of 40+ schools across 5 governorates |
| 🖼️ **Photo Gallery** | Masonry-style gallery showcasing campus life |
| 📱 **Fully Responsive** | Optimized for mobile (320px+), tablet, and desktop |
| ⚡ **Performance** | Lazy-loaded pages with `React.Suspense` for fast initial load |

---

## 🏗️ Tech Stack

```
├── ⚛️  React 19           — UI framework
├── 🔷  TypeScript 5.8     — Type-safe development
├── ⚡  Vite 6.2           — Lightning-fast dev server & bundler
├── 🎨  Tailwind CSS       — Utility-first styling (CDN)
├── 🤖  Google Gemini API  — AI-powered features
├── 🧭  React Router 7     — Client-side routing (HashRouter)
├── 🔣  Lucide React       — Beautiful icon library
└── 🌐  Google Fonts       — Inter (EN) + Cairo (AR) fonts
```

---

## 📁 Project Structure

```
national-institutes/
│
├── 📄 index.html              # Entry HTML with TailwindCSS CDN & custom styles
├── 📄 index.tsx               # React root mount
├── 📄 App.tsx                 # App shell with Router, Suspense & LanguageProvider
│
├── 🌐 LanguageContext.tsx     # Global lang state with localStorage persistence
├── 📝 translations.ts         # Full EN + AR translations for all UI text
├── 📊 constants.ts            # Static data: Schools, News, Jobs, Governorates
├── 🔧 types.ts                # TypeScript type definitions
│
├── 📂 pages/
│   ├── 🏠 Home.tsx            # Landing page: Hero, Chairman, Map, News, Gallery, CTA
│   ├── 🏫 Schools.tsx         # Searchable schools directory
│   ├── 💼 Careers.tsx         # Job listings & application form
│   └── 🤖 AIStudio.tsx        # Gemini-powered AI tools
│
├── 📂 components/
│   ├── 🧭 Navbar.tsx          # Responsive sticky navbar with language toggle
│   ├── 🦶 Footer.tsx          # Footer with links, regions & contact info
│   └── 🎨 NISLogo.tsx         # SVG logo component
│
└── 📂 services/               # API service layer
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A **Google Gemini API key** (for AI Studio features)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/national-institutes.git
cd national-institutes

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Edit the .env.local file and add your key:
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# 4. Start the development server
npm run dev
```

The app will be running at **http://localhost:3000** 🎉

### Build for Production

```bash
npm run build       # Compile TypeScript & bundle with Vite
npm run preview     # Preview the production build locally
```

---

## 🌐 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Hero, Chairman message, Stats map, Gallery, News, CTA |
| `/schools` | **Schools** | Filterable directory of all NIS schools |
| `/careers` | **Careers** | Job openings & application submission |
| `/ai-studio` | **AI Studio** | Google Gemini-powered tools for school insights |

> The app uses `HashRouter` for compatibility with static hosts.

---

## 🌍 Internationalization (i18n)

The portal supports **full bilingual operation**:

- 🇬🇧 **English** — LTR layout, *Inter* font
- 🇪🇬 **Arabic** — RTL layout, *Cairo* font

Switch via the **🌐 globe icon** in the navbar. Language preference is **automatically saved** to `localStorage` and restored on every visit.

---

## 🤖 AI Studio

The **AI Studio** page harnesses the power of **Google Gemini** to provide:
- 📊 School performance analysis
- 📝 Auto-generated content & reports
- 🔍 Intelligent search & recommendations

> Requires a valid `GEMINI_API_KEY` in `.env.local`.

---

## 🗺️ Schools Network

Currently covering **5 governorates** across Egypt:

| Governorate | Schools |
|---|:---:|
| 🏙️ Cairo | 12 |
| 🌊 Alexandria | 4 |
| 🏛️ Giza | 6 |
| 🌾 Dakahlia | 3 |
| 🏘️ Gharbia | 2 |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software of the **General Assembly of National Institutes (الجمعية العامة للمعاهد القومية)**. All rights reserved.

---

<div align="center">

Made with ❤️ for Egyptian Education

**النهوض بالتعليم المصري منذ ١٩٥٦**

</div>
