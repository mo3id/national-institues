# National Institutes System — Complete Documentation

## Overview

National Institutes (NIS) is a bilingual (Arabic/English) web platform for managing a network of schools. It includes a public-facing website and an admin dashboard for content management.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | TailwindCSS + CSS Variables (theming) |
| Animations | Framer Motion |
| Routing | React Router v6 (lazy loaded) |
| Icons | Lucide React + Material Symbols |
| Backend | PHP (api.php) — REST API |
| Database | MySQL (PDO) |
| Auth | JWT Bearer tokens |
| Hosting | cPanel (Apache + .htaccess) |
| i18n | Custom context (en/ar) |

---

## Public Website Pages

### 1. Home (`/`)
- **Hero Slider** — Auto-rotating slides with title, subtitle, description, image, and CTA button
- **About Preview** — Chairman's word snippet with image, name, role, quote
- **Schools Preview** — Featured schools grid with logos, types, ratings
- **News Preview** — Latest 3 published articles with images
- **Partners & Gallery** — Partner logos + photo gallery
- **Bottom CTA** — Call-to-action section
- **Map Section** — Embedded map image
- **Statistics** — Student/teacher/school counts

### 2. About (`/about`)
- **Our Story** — Title, description, image (bilingual)
- **Chairman's Word** — Image, name, role, quote, key points (bilingual)
- **Mission & Vision** — Title + description for each (bilingual)

### 3. Schools (`/schools`)
- **Filter Bar** — Governorate filter + Education type filter (CustomSelect dropdowns)
- **Schools Grid** — Cards showing logo, name, type badges, rating, student count, location
- **Search** — Real-time search filtering
- **Click** → navigates to `/schools/:id`

### 4. School Profile (`/schools/:id`)
- **Hero Section** — Main image + gallery carousel
- **About School** — Description (bilingual)
- **Details** — Principal, phone, email, website, founded year, address
- **Stats** — Student count, teacher count, rating
- **Application Link** — CTA to admissions

### 5. News (`/news`)
- **News Grid** — Article cards with image, title, date, summary
- **Search** — Real-time search
- **Click** → navigates to `/news/:id`

### 6. News Detail (`/news/:id`)
- **Full Article** — Image, title, date, content (bilingual)
- **Highlight Box** — Optional highlight title + content
- **Back Button** — Return to news list

### 7. Careers (`/careers`)
- **Job Listings** — Cards with title, department, location, type, description
- **Filter** — By department
- **Apply Form** — Full application form with:
  - Personal info (name, email, phone, experience)
  - CV upload (PDF)
  - Job reference selection
  - Form validation (Zod schema)

### 8. Complaints & Feedback (`/complaints`)
- **Complaint Form** — Submit new complaint:
  - Full name, phone, email, school (dropdown), message type (dropdown), message
  - School list auto-populated from database
  - Message types from translations config
- **Complaint Inquiry** (`/complaints/inquiry`) — Track complaint by ID

### 9. Admissions (`/admissions`)
- **Admission Form** — Multi-step application:
  - Student info (name, national ID, grade stage, grade class)
  - Parent info (name, phone, email)
  - School preferences (up to 3 ranked choices)
  - Document upload
  - Open/closed status controlled by admin
  - Form validation (Zod schema)
- **Admission Inquiry** (`/admissions/track`, `/admissions/inquiry`) — Track by application ID

### 10. Modifications (`/modifications/request`)
- **Request Form** — Submit data modification request:
  - Student/parent info, modification type, details
- **Track** (`/modifications/track`) — Track modification request by ID

### 11. Alumni (`/alumni`)
- **Alumni Grid** — Cards with photo, name, graduation year, school, company
- **Search & Filter**
- **Click** → navigates to `/alumni/:id`

### 12. Alumni Profile (`/alumni/:id`)
- **Profile Card** — Photo, name, school, graduation year, company, bio

### 13. Contact Us (`/contact`)
- **Contact Form** — Name, email, phone, message
- **Contact Info** — Address, phone, email, working hours
- **Social Links** — Facebook, Twitter/X, Instagram, LinkedIn
- **Map** — Embedded map

### 14. AI Studio (`/ai-studio`)
- **AI Chat Interface** — Powered by Google AI Studio

### 15. Login (`/login`)
- **Login Form** — Email + password
- **JWT Auth** — Token stored in localStorage
- **Protected Routes** — Redirects to `/dashboard` on success

### 16. 404 Page
- **Error Page** — Not found with navigation back

---

## Layout Components

| Component | Description |
|-----------|-------------|
| Navbar | Fixed top, transparent on hero → solid on scroll, mobile drawer, language toggle, login button |
| Footer | Links (Home, About, Schools, News, Careers, Complaints, Contact), social icons, footer description |
| FloatingLoginButton | Small floating button for quick admin access |
| ScrollToTop | Auto-scrolls to top on route change |
| PageTransition | Framer Motion wrapper for page transitions |
| ScrollReveal | Intersection Observer for scroll animations |

---

## Admin Dashboard (`/dashboard`)

**Protected route** — requires JWT authentication. Standalone layout (no Navbar/Footer).

### Dashboard Layout
- **Sidebar** — Collapsible navigation with 20 sections, NIS logo, admin info, logout
- **Topbar** — Section title, theme toggle (light/dark), language toggle, admin profile
- **Content Area** — Renders the active section
- **Auto-refresh** — 30s polling for complaints, contact messages, recruitment, news, admissions

### Dashboard Sections

#### 1. Overview (`overview`)
- **Stats Cards** — Total articles, published articles, schools count, total teachers, total students
- **Quick Actions** — Add article, edit hero, chairman, institute
- **Recent Articles** — Last 5 articles with title, date, published status

#### 2. News Articles (`news`)
- **Article List** — Searchable, paginated (12/page)
- **Add/Edit Modal** — Title (EN/AR), summary (EN/AR), content (EN/AR), date, image upload, featured toggle, publish toggle
- **Toggle Publish** — One-click publish/unpublish
- **Delete** — With confirmation dialog
- **Published Count** — Shows published vs total

#### 3. Schools (`schools`)
- **Schools Grid** — Searchable, paginated (100/page)
- **Cards** — Logo, name, type badges, governorate, rating
- **Add/Edit Modal** — Full school form:
  - Name (EN/AR), location, governorate (dropdown), principal
  - Type (multi-select: National, International, STEM, etc.)
  - Logo, main image, gallery (multi-upload)
  - About (EN/AR), phone, email, website
  - Rating, student count, teacher count, founded year
  - Address (EN/AR), application link
- **Delete** — With confirmation

#### 4. Governorates (`governorates`)
- **List** — All governorates with name (EN/AR)
- **Add** — Name (EN/AR)
- **Delete** — With confirmation

#### 5. Departments (`departments`)
- **List** — Job departments with name (EN/AR)
- **Add** — Inline form with name (EN/AR)
- **Delete** — With confirmation

#### 6. Jobs (`jobs`)
- **Job List** — Searchable, paginated
- **Add/Edit Modal** — Title (EN/AR), department, location (EN/AR), type, description (EN/AR), image
- **Delete** — With confirmation

#### 7. Recruitment Portal (`recruitment`)
- **Department Tabs** — Filter applications by department
- **Applications Table** — Applicant name, email, applied job, date, status
- **Applicant Detail Modal**:
  - Full name, email, phone, application date
  - CV download + preview (iframe)
  - Status update (Pending → Interview → Hired/Rejected/On Hold)
  - Notes field
  - Delete application
- **Search** — Filter by applicant name
- **Paginated** — 12/page

#### 8. Hero Slides (`hero`)
- **Slides Grid** — Cards with image, title, subtitle
- **Add/Edit Modal** — Title (EN/AR), subtitle (EN/AR), description (EN/AR), image upload
- **Delete** — With confirmation

#### 9. Chairman Word (`chairman`)
- **View Mode** — Image, name, role, quote, description, key points
- **Edit Mode** — Full form:
  - Image upload
  - Name (EN/AR), role (EN/AR), quote (EN/AR)
  - Description (EN/AR)
  - Key points (comma separated)

#### 10. About Institute (`institute`)
- **View Mode** — Story (title + desc + image), mission (title + desc), vision (title + desc)
- **Edit Mode** — Full form for all fields (bilingual):
  - Story: title, image, description
  - Mission: title, description
  - Vision: title, description

#### 11. Home Page (`home`)
- **Partners Section** — Trusted partners logos (EN/AR descriptions)
- **Gallery Section** — Photo gallery management
- **Statistics Section** — Student/teacher/school counts
- **Map Section** — Map image upload
- **Bottom CTA** — CTA text and button

#### 12. Forms Settings (`forms`)
- **Contact Form** — Title (EN/AR), description (EN/AR)
- **Job Form** — Title (EN/AR), description (EN/AR)
- **Admission Form** — Title (EN/AR), description (EN/AR)
- **Save** — Updates all form settings

#### 13. Contact Info (`contact`)
- **Basic Info** — Address (EN/AR), phone, email
- **Working Hours** — Day range (dropdowns), time range (inputs), auto-generated text (EN/AR)
- **Social Media** — Facebook, Twitter/X, Instagram, LinkedIn (with URL validation)
- **Footer Texts** — Description (EN/AR)
- **Save** — With validation (email format, URL format, auto-prepend https)

#### 14. Complaints (`complaints`)
- **Search + Filters** — Search bar, message type filter, governorate filter, school filter
- **Top 3 Schools** — Most complained schools (from ALL data, not just current page), clickable to filter
- **Complaints Table** — Request ID, sender name, phone, school, message type, message, status, delete
- **Complaint Detail Modal** — Full details, status update (Pending/In Progress/Responded), response text, save
- **Filters** — Backend-filtered (governorate resolves via school→governorate mapping, supports both EN/AR)
- **Paginated** — 12/page
- **Auto-refresh** — 30s polling

#### 15. Contact Messages (`contactMessages`)
- **Messages Table** — Name, email, phone, message, date
- **Detail Modal** — Full message view
- **Delete** — With confirmation
- **Paginated** — 12/page

#### 16. Admission Settings (`admissionSettings`)
- **Open/Closed Toggle** — Control whether admissions are accepting applications
- **Required Documents** — Dynamic list (add/remove items)
- **Grade Stages** — Dynamic list (add/remove stages)
- **Grade Classes by Stage** — Nested dynamic lists per stage
- **Save** — Persists all settings

#### 17. Admission Applications (`admissionApplications`)
- **Search + Filter** — Search bar, status filter (All/Pending/Under Review/Accepted/Waitlist/Rejected)
- **Applications Table** — ID, student name, parent phone, grade stage, school preferences, status
- **Detail Modal** — Full application details:
  - Student info, parent info, grade stage/class
  - School preferences (ranked list)
  - Documents (view/download)
  - Status update + accepted school selection + admin notes
- **Delete** — With confirmation
- **Paginated** — 12/page
- **Auto-refresh** — 30s polling

#### 18. Modifications (`modifications`)
- **Modification Requests List** — From external component
- **View/Process** — Review and handle modification requests

#### 19. Alumni (`alumni`)
- **Alumni Grid** — Searchable, paginated
- **Add/Edit Modal** — Name (EN/AR), school, graduation year, company, image, bio (EN/AR), featured toggle
- **Delete** — With confirmation

#### 20. Settings (`settings`)
- **Language** — Toggle dashboard language (EN/AR)
- **Dark Mode** — Toggle theme (light/dark)
- **Admin Profile** — Name, email (with save)

---

## Shared Dashboard Components

| Component | Path | Description |
|-----------|------|-------------|
| Pagination | `dashboard-components/Pagination.tsx` | Reusable pagination with first/prev/next/last, page numbers, RTL support |
| Modals | `dashboard-components/Modals.tsx` | EditNewsForm, EditHeroForm, EditSchoolForm, EditJobForm, EditAlumniForm, ModalWrap |
| OverviewSection | `sections/OverviewSection.tsx` | Stats + quick actions + recent articles |
| NewsSection | `sections/NewsSection.tsx` | News list with search, pagination, publish toggle |
| SchoolsSection | `sections/SchoolsSection.tsx` | Schools grid with search |
| AlumniSection | `sections/AlumniSection.tsx` | Alumni grid with search |
| JobsSection | `sections/JobsSection.tsx` | Jobs table with search |
| DepartmentsSection | `sections/DepartmentsSection.tsx` | Departments list |
| GovernoratesSection | `sections/GovernoratesSection.tsx` | Governorates list |
| HeroSection | `sections/HeroSection.tsx` | Hero slides grid |
| FormsSection | `sections/FormsSection.tsx` | Form settings editor |
| ContactMessagesSection | `sections/ContactMessagesSection.tsx` | Messages table with pagination |

---

## Backend API (`api.php`)

### Authentication
- `login` — POST: email + password → JWT token
- JWT verified via `Authorization: Bearer <token>` header
- Apache `.htaccess` preserves Authorization header

### Data Operations
| Action | Method | Description |
|--------|--------|-------------|
| `get_data` | GET | Fetch site data (about, home, hero, contact, formSettings, admissionSettings) |
| `update_data` | POST | Update site data section (auth required) |
| `get_entries` | GET | Fetch paginated entries with filters |
| `save_entry` | POST | Create/update entry (auth required) |
| `delete_entry` | POST | Delete entry by ID (auth required) |
| `get_job_application` | GET | Get single job application with CV data |
| `update_job_application` | POST | Update application status (auth required) |
| `update_complaint` | POST | Update complaint status/response (auth required) |
| `update_admission` | POST | Update admission status (auth required) |
| `upload_image` | POST | Upload image file (auth required) |
| `get_school` | GET | Get single school by ID |

### Paginated Entries (`get_entries`)
Supports types: `complaints`, `contactMessages`, `jobApplications`, `admissions`, `news`, `schools`, `alumni`, `jobs`

**Query Parameters:**
- `type` — Entry type
- `page` — Page number
- `limit` — Items per page
- `search` — Search term
- `filterType` — Type filter (complaints: messageType, jobs: department, admissions: status)
- `filterSchool` — School name filter (complaints)
- `filterGov` — Governorate filter (complaints, resolves via school→governorate mapping)

**Response includes:**
- `items` — Current page items
- `total` — Total filtered count
- `page`, `limit`, `totalPages`
- `topSchools` — (complaints only) Top 3 schools by complaint count from ALL data

### Database Tables
- `schools` — School records with bilingual fields
- `news` — News articles
- `alumni` — Alumni records
- `jobs` — Job vacancies
- `settings` — Key-value store for: complaints, contactMessages, jobApplications, admissions, hero, about, home, contactData, formSettings, admissionSettings, jobDepartments, governorates
- `admin_users` — Admin authentication

---

## Key Features

### Bilingual Support (Arabic/English)
- All content has EN + AR fields
- UI labels translated via i18n context
- RTL layout support (direction, alignment, chevron flipping)
- Language toggle in navbar and dashboard topbar

### Dark/Light Theme
- CSS variables for all colors
- Dashboard theme toggle
- Persists in component state

### Image Upload
- Drag & drop + click to upload
- Converts to WebP for optimization
- Supports gallery (multiple images)
- Stored in `uploads/` directory on server

### Form Validation
- Zod schemas for: news, schools, jobs, alumni, job applications, admissions
- Real-time validation with error messages
- Email/URL format validation

### Optimistic Updates
- School/job/alumni saves update UI immediately
- API call happens in background
- Toast notification on success/failure

### SEO
- `seo_router.php` — Server-side routing for dynamic meta tags
- Per-page Open Graph tags
- `robots.txt`
- Sitemap support

### Security
- JWT authentication for all admin operations
- Protected routes (frontend + backend)
- Input sanitization
- CORS headers
- Rate limiting on auth endpoints
- Confirmation dialogs for destructive actions

---

## File Structure

```
src/
├── App.tsx                          # Routes + providers
├── pages/
│   ├── Dashboard.tsx                # Admin dashboard (~3100 lines)
│   ├── Home.tsx                     # Public homepage
│   ├── About.tsx                    # About page
│   ├── Schools.tsx                  # Schools listing
│   ├── SchoolProfile.tsx            # Individual school
│   ├── News.tsx                     # News listing
│   ├── NewsDetail.tsx               # Individual article
│   ├── Jobs.tsx / Careers.tsx       # Careers page
│   ├── Complaints.tsx               # Complaints form
│   ├── ComplaintInquiry.tsx         # Track complaint
│   ├── Admissions.tsx               # Admission form
│   ├── AdmissionInquiry.tsx         # Track admission
│   ├── RequestModification.tsx      # Modification request
│   ├── ModificationInquiry.tsx      # Track modification
│   ├── Alumni.tsx                   # Alumni listing
│   ├── AlumniProfile.tsx            # Individual alumni
│   ├── ContactUs.tsx                # Contact page
│   ├── AIStudio.tsx                 # AI chat
│   ├── Login.tsx                    # Admin login
│   └── dashboard-components/
│       ├── types.ts                 # Section, Theme, Lang types + UI translations
│       ├── Pagination.tsx           # Shared pagination
│       ├── Modals.tsx               # All edit modals
│       └── sections/               # Extracted section components
│           ├── OverviewSection.tsx
│           ├── NewsSection.tsx
│           ├── SchoolsSection.tsx
│           ├── AlumniSection.tsx
│           ├── JobsSection.tsx
│           ├── DepartmentsSection.tsx
│           ├── GovernoratesSection.tsx
│           ├── HeroSection.tsx
│           ├── FormsSection.tsx
│           ├── ContactMessagesSection.tsx
├── components/
│   ├── layout/                      # Navbar, Footer
│   └── common/                      # FormControls, ScrollToTop, ErrorPage, etc.
├── context/
│   ├── LanguageContext.tsx           # i18n provider
│   ├── AuthContext.tsx               # JWT auth provider
│   └── DataContext.tsx               # Site data provider
├── services/
│   ├── api.ts                       # API client (Axios)
│   └── authApi.ts                   # Auth API calls
├── hooks/                           # Custom hooks
├── i18n/locales/                    # EN/AR translation files
├── utils/                           # Validations, helpers
└── types/                           # TypeScript type definitions

backend/
├── api.php                          # Main API (all endpoints)
├── db_config.php                    # Database connection
├── upload_handler.php               # Image upload handler
├── schema.sql                       # Database schema
└── uploads/                         # Uploaded images
```
