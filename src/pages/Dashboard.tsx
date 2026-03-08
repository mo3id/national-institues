import React, { useState, useEffect, useMemo } from 'react';
import {
  getPaginatedEntries, updateComplaint, updateJobApplication, getJobApplicationDetails, getDashboardStats, deleteEntry,
  saveNews as apiSaveNews, deleteNews as apiDeleteNews,
  saveSchool as apiSaveSchool, deleteSchool as apiDeleteSchool,
  saveJob as apiSaveJob, deleteJob as apiDeleteJob
} from '@/services/api';
import {
  LayoutDashboard, Newspaper, School, Image, Info, Settings,
  Plus, Pencil, Trash2, Eye, EyeOff, Save, X,
  Users, Home as HomeIcon, GraduationCap, MapPin, Bell, LogOut, Search,
  TrendingUp, CheckCircle, AlertCircle, Menu, Moon, Sun,
  Globe, ChevronRight, Briefcase, MessageSquare, Mail, Filter, ChevronDown, Phone,
  ChevronLeft, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { NEWS, SCHOOLS } from '@/constants';
import {
  Section, Theme, Lang, DashNewsItem, DashSchool, DashJob, DashJobApplication, HeroSlide, AboutData, AdminProfile,
  UI, HERO_IMAGES
} from './dashboard-components/types';
import { ModalWrap, EditNewsForm, EditHeroForm, EditSchoolForm, EditJobForm } from './dashboard-components/Modals';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import NISLogo from '@/components/common/NISLogo';
import { CustomSelect, CustomDatePicker, ImageUpload } from '@/components/common/FormControls';
import { useSiteData } from '@/context/DataContext';

// ─── Custom Hooks ─────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ─── Initial Data Helpers ─────────────────────────────────────────────────────────────
const prepareNews = (news: any[] = []) => (news || []).map((n, i) => ({ ...n, published: n.published ?? i < 8 }));


// ─── Initial Data ─────────────────────────────────────────────────────────────
const initNews: DashNewsItem[] = NEWS.map((n, i) => ({ ...n, published: i < 8 }));
const initSchools: DashSchool[] = SCHOOLS.map(s => ({ ...s }));
const initHero: HeroSlide[] = [
  { id: 1, title: 'Nurturing Global Leaders', subtitle: 'Legacy of Excellence', description: 'Empowering the next generation with world-class education and values.', image: HERO_IMAGES[0] },
  { id: 2, title: 'Innovation in Education', subtitle: 'Future Ready', description: 'Integrating cutting-edge technology and AI to create personalized learning.', image: HERO_IMAGES[1] },
  { id: 3, title: 'Community & Culture', subtitle: 'Building Character', description: 'Fostering a vibrant community where diversity is celebrated.', image: HERO_IMAGES[2] },
];
const initAbout: AboutData = {
  quote: 'Education is not the filling of a pail, but the lighting of a fire.',
  quoteAr: 'التعليم ليس ملء دلو، بل هو إيقاد شعلة.',
  name: 'Dr. Ahmed El-Said',
  nameAr: 'د. أحمد السعيد',
  role: 'Chairman of NIS',
  roleAr: 'رئيس المعاهد القومية',
  desc: 'Welcome to the National Institutes. We are a community dedicated to academic rigor and character building.',
  descAr: 'مرحباً بكم في المعاهد القومية. نحن مجتمع مكرس للصرامة الأكاديمية وبناء الشخصية.',
  points: ['National Curriculum', 'International Standards', 'Holistic Growth', 'Ethical Leadership'],
  pointsAr: ['مناهج قومية', 'معايير دولية', 'نمو شامل', 'قيادة أخلاقية'],
  // New about page fields
  storyTitle: 'Crafting the Future Since 1995',
  storyTitleAr: 'صياغة المستقبل منذ عام ١٩٩٥',
  storyDesc: 'Our journey began with a simple yet profound vision...',
  storyDescAr: 'بدأت رحلتنا برؤية بسيطة ولكن عميقة...',
  missionTitle: 'Our Mission',
  missionTitleAr: 'رسالتنا',
  missionDesc: 'To empower students with knowledge...',
  missionDescAr: 'تمكين الطلاب بالمعرفة...',
  visionTitle: 'Our Vision',
  visionTitleAr: 'رؤيتنا',
  visionDesc: 'To be the benchmark for educational excellence...',
  visionDescAr: 'أن نكون المعيار للتميز التعليمي...',
  values: []
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Cairo:wght@400;600;700;800&display=swap');
  .dash-root { 
    --bg: #f8fafc; 
    --surface: #ffffff; 
    --surface2: #f1f5f9; 
    --border: #e2e8f0; 
    --text: #0f172a; 
    --text2: #64748b; 
    --accent: #4f46e5; 
    --accent2: #6366f1; 
    /* sidebar in light mode should match surface colors */
    --sidebar: var(--surface); 
    --sidebar2: var(--surface2); 
    --danger: #ef4444; 
    --success: #10b981; 
    --warn: #f59e0b; 
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.04);
    --shadow-md: 0 8px 30px rgba(0,0,0,0.06);
    --shadow-lg: 0 20px 40px rgba(0,0,0,0.08);
  }
  .dash-root.dark { 
    --bg: #0b0f19; 
    --surface: #13192b; 
    --surface2: #1e253c; 
    --border: #283046; 
    --text: #f8fafc; 
    --text2: #94a3b8; 
    --accent: #6366f1; 
    --accent-hover: #818cf8;
    --sidebar: #070a10; 
    --sidebar2: #0b101a; 
    --shadow-sm: 0 4px 12px rgba(0,0,0,0.3);
    --shadow-md: 0 10px 40px rgba(0,0,0,0.4);
    --shadow-lg: 0 24px 60px rgba(0,0,0,0.5);
  }
  .dash-root { min-height: 100vh; background: var(--bg); font-family: 'Outfit', 'Inter', sans-serif; display: flex; color: var(--text); transition: background 0.4s ease, color 0.4s ease; }
  .dash-root.rtl { direction: rtl; font-family: 'Cairo', sans-serif; }
  
  /* Scrollbar Sync */
  .dash-root ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .dash-root ::-webkit-scrollbar-track {
    background: transparent;
  }
  .dash-root ::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 10px;
  }
  .dash-root ::-webkit-scrollbar-thumb:hover {
    background: var(--text2);
  }
  
  .dash-sidebar { width: 260px; background: linear-gradient(180deg, var(--sidebar) 0%, var(--sidebar2) 100%); display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; z-index: 100; overflow: hidden; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s, right 0.3s; border-right: 1px solid rgba(255,255,255,0.03); box-shadow: 4px 0 24px rgba(0,0,0,0.1); }
  .dash-root.rtl .dash-sidebar { left: auto; right: 0; border-right: none; border-left: 1px solid rgba(255,255,255,0.03); box-shadow: -4px 0 24px rgba(0,0,0,0.1); }
  .dash-sidebar.collapsed { width: 72px; }
  .dash-main { flex: 1; margin-left: 260px; display: flex; flex-direction: column; min-height: 100vh; transition: margin 0.3s cubic-bezier(0.4, 0, 0.2, 1); min-width: 0; }
  .dash-root.rtl .dash-main { margin-left: 0; margin-right: 260px; }
  .dash-main.collapsed { margin-left: 72px; }
  .dash-root.rtl .dash-main.collapsed { margin-left: 0; margin-right: 72px; }
  .dash-topbar { background: rgba(var(--surface-rgb, 255, 255, 255), 0.8); border-bottom: 1px solid var(--border); padding: 0 24px; height: 68px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); background-color: var(--surface); transition: background 0.3s; }
  .dash-root.dark .dash-topbar { background-color: rgba(19, 25, 43, 0.75); }
  .dash-content { padding: 32px 28px; flex: 1; max-width: 1600px; margin: 0 auto; width: 100%; min-width: 0; }
  
  .dash-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--shadow-sm); transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease; }
  .dash-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: rgba(99, 102, 241, 0.2); }
  
  /* navigation item colors adapt to theme */
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 18px; border-radius: 12px; cursor: pointer; transition: all 0.25s ease; color: var(--text2); white-space: nowrap; overflow: hidden; margin: 4px 12px; position: relative; }
  .dash-root.dark .nav-item { color: rgba(255,255,255,0.5); }

  .nav-item:hover { background: rgba(0,0,0,0.05); color: var(--text); transform: translateX(4px); }
  .dash-root.dark .nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.9); }
  .dash-root.rtl .nav-item:hover { transform: translateX(-4px); }

  .nav-item.active { background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.05)); color: var(--text); font-weight: 700; transform: translateX(4px); }
  .dash-root.dark .nav-item.active { color: #fff; }
  .dash-root.rtl .nav-item.active { transform: translateX(-4px); }

  .nav-item.active::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 4px; background: linear-gradient(180deg, #818cf8, #c084fc); border-radius: 0 4px 4px 0; box-shadow: 2px 0 8px rgba(129, 140, 248, 0.5); }
  .dash-root.rtl .nav-item.active::before { left: auto; right: 0; border-radius: 4px 0 0 4px; box-shadow: -2px 0 8px rgba(129, 140, 248, 0.5); }
  
  .dash-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); border: none; white-space: nowrap; letter-spacing: 0.02em; }
  .dash-btn-primary { background: linear-gradient(135deg, var(--accent), #7c3aed); color: white; box-shadow: 0 4px 14px rgba(79,70,229,0.3); position: relative; overflow: hidden; }
  .dash-btn-primary::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent); transform: translateX(-100%); transition: 0.5s; }
  .dash-btn-primary:hover::after { transform: translateX(100%); }
  .dash-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79,70,229,0.4); }
  .dash-btn-primary:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(79,70,229,0.3); }
  
  .dash-btn-danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
  .dash-btn-danger:hover { background: rgba(239, 68, 68, 0.2); }
  .dash-btn-ghost { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
  .dash-btn-ghost:hover { background: var(--border); color: var(--text); transform: translateY(-1px); }
  
  .dash-input { width: 100%; border: 1.5px solid var(--border); border-radius: 12px; padding: 12px 16px; font-size: 14px; outline: none; transition: all 0.25s ease; background: var(--surface2); color: var(--text); font-family: inherit; }
  .dash-root.rtl .dash-input { direction: rtl; text-align: right; unicode-bidi: plaintext; }
  .dash-input:hover { border-color: rgba(99, 102, 241, 0.4); }
  .dash-input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(79,70,229,0.1); background: var(--surface); }
  
  .dash-ta { resize: vertical; min-height: 100px; line-height: 1.5; }
  .dash-root.rtl .dash-ta { direction: rtl; text-align: right; unicode-bidi: plaintext; }
  .dash-label { display: block; font-size: 11px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
  .dash-img-preview { width: 100%; height: 160px; object-fit: cover; border-radius: 14px; box-shadow: var(--shadow-sm); }
  .dash-cb { width: 18px; height: 18px; accent-color: var(--accent); cursor: pointer; border-radius: 4px; }
  .dash-cb-label { font-size: 14px; font-weight: 600; color: var(--text); cursor: pointer; user-select: none; }
  .dash-form-actions { display: flex; gap: 12px; padding-top: 12px; }
  
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .form-col { }
  .form-full { grid-column: 1/-1; }
  
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 24px; display: flex; align-items: flex-start; gap: 18px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; position: relative; box-shadow: var(--shadow-sm); }
  .stat-card::before { content: ''; position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; pointer-events: none; }
  .dash-root.dark .stat-card::before { background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); }
  .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--accent); }
  .stat-card:hover::before { opacity: 1; }
  .stat-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: inset 0 2px 4px rgba(255,255,255,0.3); }
  .dash-root.dark .stat-icon { box-shadow: inset 0 2px 4px rgba(255,255,255,0.05); }
  
  .row-header { display: grid; grid-template-columns: 56px 1fr 115px 110px 110px; align-items: center; gap: 16px; padding: 14px 24px; background: var(--surface2); border-bottom: 1px solid var(--border); font-size: 12px; border-radius: 20px 20px 0 0; }
  .news-row { display: grid; grid-template-columns: 56px 1fr 115px 110px 110px; align-items: center; gap: 16px; padding: 16px 24px; border-bottom: 1px solid var(--border); transition: all 0.2s ease; cursor: default; }
  .news-row:last-child { border-bottom: none; }
  .news-row:hover { background: var(--surface2); }
  
  .dash-badge { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; transition: all 0.2s; }
  .badge-green { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
  .dash-root.dark .badge-green { background: rgba(16, 185, 129, 0.1); color: #34d399; }
  .badge-blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
  .badge-red { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
  .badge-orange { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
  .badge-purple { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.2); }
  .badge-gray { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
  
  .dash-modal-overlay { position: fixed; inset: 0; background: rgba(11, 15, 25, 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .dash-modal { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .dash-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 24px 28px; border-bottom: 1px solid var(--border); background: var(--surface2); position: sticky; top: 0; z-index: 10; border-radius: 24px 24px 0 0; }
  .dash-modal-title { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }
  .dash-modal-body { padding: 28px; }
  
  .dash-icon-btn { padding: 10px; border-radius: 12px; border: none; background: transparent; color: var(--text2); cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
  .dash-icon-btn:hover { background: var(--surface2); color: var(--text); transform: scale(1.05); }
  .dash-icon-btn:active { transform: scale(0.95); }
  
  .school-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  .school-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: default; box-shadow: var(--shadow-sm); position: relative; overflow: hidden; }
  .school-card:hover { border-color: var(--accent); box-shadow: var(--shadow-md); transform: translateY(-3px); }
  
  .hero-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; transition: all 0.3s ease; box-shadow: var(--shadow-sm); }
  .hero-card:hover { border-color: var(--accent2); box-shadow: var(--shadow-md); transform: translateY(-2px); }
  
  .toast { position: fixed; bottom: 32px; right: 32px; z-index: 300; padding: 16px 24px; border-radius: 16px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); animation: slideUpToast 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .dash-root.rtl .toast { right: auto; left: 32px; }
  .toast-success { background: linear-gradient(135deg, #10b981, #059669); color: white; border: 1px solid rgba(255,255,255,0.1); }
  .toast-error { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: 1px solid rgba(255,255,255,0.1); }
  
  .toggle-pill { display: flex; align-items: center; gap: 2px; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 4px; }
  .toggle-pill button { padding: 8px 16px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; background: transparent; color: var(--text2); transition: all 0.2s; border-radius: 8px; }
  .toggle-pill button:hover:not(.active) { color: var(--text); background: rgba(0,0,0,0.03); }
  .dash-root.dark .toggle-pill button:hover:not(.active) { background: rgba(255,255,255,0.05); }
  .toggle-pill button.active { background: var(--surface); color: var(--accent); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .dash-root.dark .toggle-pill button.active { background: var(--surface); color: var(--text); }
  
  .switch { position: relative; display: inline-block; width: 48px; height: 28px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: var(--surface2); border: 1px solid var(--border); border-radius: 999px; transition: .3s; }
  .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background: var(--text2); border-radius: 50%; transition: .3s cubic-bezier(0.4, 0, 0.2, 1); }
  input:checked + .slider { background: linear-gradient(135deg, var(--accent), #7c3aed); border-color: transparent; }
  input:checked + .slider:before { transform: translateX(20px); background: white; }
  
  .section-enter { animation: fadeSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  @keyframes fadeIn { from{opacity: 0} to{opacity: 1} }
  @keyframes scaleUp { from{transform: scale(0.95); opacity: 0} to{transform: scale(1); opacity: 1} }
  @keyframes slideUpToast { from{transform: translateY(20px) scale(0.9); opacity: 0} to{transform: translateY(0) scale(1); opacity: 1} }
  @keyframes fadeSlide { from{opacity: 0; transform: translateY(15px)} to{opacity: 1; transform: translateY(0)} }
  
  .glow-dot { width: 10px; height: 10px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; animation: pulse2 2s infinite; }
  @keyframes pulse2 { 0%,100%{opacity: 1; transform: scale(1)} 50%{opacity: 0.5; transform: scale(1.4)} }

  .pagination-container { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 32px; padding: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--shadow-sm); width: fit-content; margin-inline: auto; }
  .pagination-btn { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); color: var(--text2); cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); font-weight: 700; font-size: 13px; }
  .pagination-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); background: rgba(79,70,229,0.05); transform: translateY(-2px); }
  .pagination-btn:disabled { opacity: 0.3; cursor: not-allowed; background: var(--surface2); }
  .pagination-btn.active { background: var(--accent); color: white; border-color: var(--accent); box-shadow: 0 4px 12px rgba(79,70,229,0.3); }
  .pagination-info { font-size: 12px; font-weight: 700; color: var(--text2); margin: 0 16px; display: flex; flex-direction: column; align-items: center; line-height: 1.2; }
  .pagination-info span { color: var(--text); font-size: 14px; }

  @media (max-width: 1024px) {
    .dash-sidebar { transform: translateX(0); z-index: 100; box-shadow: 4px 0 24px rgba(0,0,0,0.5); }
    .dash-root.rtl .dash-sidebar { transform: translateX(0); box-shadow: -4px 0 24px rgba(0,0,0,0.5); }
    .dash-sidebar.collapsed { transform: translateX(-100%); width: 260px; box-shadow: none; }
    .dash-root.rtl .dash-sidebar.collapsed { transform: translateX(100%); width: 260px; box-shadow: none; }
    .dash-main { margin-left: 0 !important; margin-right: 0 !important; }
    .dash-main.collapsed { margin-left: 0 !important; margin-right: 0 !important; }
    .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 90; backdrop-filter: blur(4px); opacity: 0; pointer-events: none; transition: opacity 0.3s; }
    .sidebar-overlay.active { opacity: 1; pointer-events: auto; }
  }
  @media (max-width: 768px) {
    .dash-topbar { padding: 0 16px; height: 68px; }
    .dash-content { padding: 20px 16px; }
    .stat-card { padding: 16px; gap: 12px; }
    .form-grid { grid-template-columns: 1fr; }
    .row-header { display: none; }
    .news-row { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: 16px; border: 1px solid var(--border); border-radius: 16px; margin-bottom: 12px; }
    .news-row img { width: 100% !important; height: 180px !important; }
    .news-row > div:nth-child(2) p { white-space: normal; }
    .dash-modal-header, .dash-modal-body { padding: 20px; }
    .hero-card > div:last-child { flex-direction: column; align-items: flex-start; }
    .hero-card p { max-width: 100% !important; }
    .dash-btn { padding: 12px 16px; flex: 1; justify-content: center; }
    .dash-form-actions { flex-direction: column; }
    .dash-form-actions .dash-btn { width: 100%; }
    .mobile-hide { display: none !important; }
    .sm-show { display: none !important; }
    .toggle-pill button { padding: 6px 10px; font-size: 11px; }
    .dash-input { padding: 10px 12px; font-size: 13px; }
    
    /* Specific overrides for mobile grid forms */
    .grid-cols-2 { grid-template-columns: 1fr; }
    .flex.items-center.gap-2 { flex-wrap: wrap; }
    .flex.items-center.gap-2 > select,
    .flex.items-center.gap-2 > input { flex: 1; min-width: 40%; text-align: center; }
  }

  /* Standard Select Option fix for Dark Mode */
  .dash-root.dark select option {
    background-color: var(--surface2);
    color: var(--text);
  }

  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .animate-spin { animation: spin 1s linear infinite; }
  .table-loader {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(2px);
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dash-root.dark .table-loader {
    background: rgba(0, 0, 0, 0.5);
  }
`;

const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const getArNumber = (n: number | string) => n.toString().replace(/\d/g, (d: any) => '٠١٢٣٤٥٦٧٨٩'[d]);

const formatTimeString = (time24: string, isAr: boolean) => {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampmEn = h >= 12 ? 'PM' : 'AM';
  const ampmAr = h >= 12 ? 'مساءً' : 'صباحاً';
  h = h % 12 || 12;
  const hDisplay = isAr ? getArNumber(h) : h.toString();
  const mDisplay = isAr ? getArNumber(m.toString().padStart(2, '0')) : m.toString().padStart(2, '0');

  if (isAr) return `${hDisplay}:${mDisplay} ${ampmAr}`;
  return `${hDisplay}:${mDisplay} ${ampmEn}`;
};

const parseWorkingHoursStr = (str: string) => {
  if (!str) return { startDay: 0, endDay: 4, startTime: '08:00', endTime: '15:00' };
  const match = str.match(/(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\s*-\s*(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday):\s*(\d{1,2}:\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)/i);
  if (match) {
    const [, startDayStr, endDayStr, startTimeStr, startAmpm, endTimeStr, endAmpm] = match;
    const startDay = DAYS_EN.findIndex(d => d.toLowerCase() === startDayStr.toLowerCase());
    const endDay = DAYS_EN.findIndex(d => d.toLowerCase() === endDayStr.toLowerCase());

    const to24 = (time: string, ampm: string) => {
      let [h, m] = time.split(':');
      let hn = parseInt(h, 10);
      if (ampm.toUpperCase() === 'PM' && hn !== 12) hn += 12;
      if (ampm.toUpperCase() === 'AM' && hn === 12) hn = 0;
      return `${hn.toString().padStart(2, '0')}:${m}`;
    };

    return {
      startDay: startDay > -1 ? startDay : 0,
      endDay: endDay > -1 ? endDay : 4,
      startTime: to24(startTimeStr, startAmpm),
      endTime: to24(endTimeStr, endAmpm)
    };
  }
  return { startDay: 0, endDay: 4, startTime: '08:00', endTime: '15:00' };
};

const buildWorkingHours = (form: any) => {
  if (!form || form.startDay === undefined) return { en: '', ar: '' };
  const en = `${DAYS_EN[form.startDay]} - ${DAYS_EN[form.endDay]}: ${formatTimeString(form.startTime, false)} - ${formatTimeString(form.endTime, false)}`;
  const ar = `${DAYS_AR[form.startDay]} - ${DAYS_AR[form.endDay]}: ${formatTimeString(form.startTime, true)} - ${formatTimeString(form.endTime, true)}`;
  return { en, ar };
};

// ─── Shared Components ─────────────────────────────────────────────────────────────
const Pagination: React.FC<{
  current: number;
  total: number;
  onChange: (page: number) => void;
  lang: string;
}> = ({ current, total, onChange, lang }) => {
  const isRTL = lang === 'ar';
  if (total <= 1) return null;

  const pages = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        onClick={() => onChange(1)}
        disabled={current === 1}
        title={lang === 'ar' ? 'البداية' : 'First Page'}
      >
        <ChevronsLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>
      <button
        className="pagination-btn"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>

      <div className="pagination-info mobile-hide">
        {lang === 'ar' ? 'صفحة' : 'Page'}
        <span>{isRTL ? getArNumber(current) : current} / {isRTL ? getArNumber(total) : total}</span>
      </div>

      <div className="flex items-center gap-1.5">
        {start > 1 && <span className="text-[var(--text2)] px-1">...</span>}
        {pages.map(p => (
          <button
            key={p}
            className={`pagination-btn ${current === p ? 'active' : ''}`}
            onClick={() => onChange(p)}
          >
            {isRTL ? getArNumber(p) : p}
          </button>
        ))}
        {end < total && <span className="text-[var(--text2)] px-1">...</span>}
      </div>

      <button
        className="pagination-btn"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
      >
        <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>
      <button
        className="pagination-btn"
        onClick={() => onChange(total)}
        disabled={current === total}
        title={lang === 'ar' ? 'النهاية' : 'Last Page'}
      >
        <ChevronsRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const { data: siteData, updateData } = useSiteData();
  const [section, setSection] = useState<Section>('overview');
  const [collapsed, setCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('dash-theme') as Theme) || 'light');
  const { lang, setLang, t: translationsRoot } = useLanguage();

  const [newsList, setNewsList] = useState<DashNewsItem[]>([]);
  const [schools, setSchools] = useState<DashSchool[]>([]);
  const [jobs, setJobs] = useState<DashJob[]>([]);
  const [departments, setDepartments] = useState<{ id: string, nameEn: string, nameAr: string }[]>([]);
  const [applications, setApplications] = useState<DashJobApplication[]>([]);
  const [hero, setHero] = useState<HeroSlide[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [about, setAbout] = useState<AboutData>({
    ...(siteData.aboutData || {}),
    points: siteData.aboutData?.points || [],
    pointsAr: siteData.aboutData?.pointsAr || []
  } as AboutData);
  const [homeData, setHomeData] = useState(siteData.homeData || {} as any);
  const [partners, setPartners] = useState(siteData.partners || []);
  const [formSettings, setFormSettings] = useState(siteData.formSettings || {} as any);
  const [contactData, setContactData] = useState(siteData.contactData || {} as any);
  const [whForm, setWhForm] = useState(() => parseWorkingHoursStr(siteData.contactData?.workingHours || ''));

  useEffect(() => {
    if (siteData) {
      setHero(siteData.heroSlides || []);
      setAbout({
        ...(siteData.aboutData || {}),
        points: siteData.aboutData?.points || [],
        pointsAr: siteData.aboutData?.pointsAr || []
      } as AboutData);
      setHomeData(siteData.homeData || {});
      setPartners(siteData.partners || []);
      setFormSettings(siteData.formSettings || {});
      setContactData(siteData.contactData || {});
      setWhForm(parseWorkingHoursStr(siteData.contactData?.workingHours || ''));
    }
  }, [siteData]);

  const [profile, setProfile] = useState<AdminProfile>({ name: 'Admin', email: 'admin@nis.edu.eg' });
  const [editNewsId, setEditNewsId] = useState<string | null>(null);
  const [addNewsOpen, setAddNewsOpen] = useState(false);
  const [editHeroId, setEditHeroId] = useState<number | null>(null);
  const [editSchoolId, setEditSchoolId] = useState<string | null>(null);
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ nameEn: '', nameAr: '' });
  const [selectedRecruitmentJobId, setSelectedRecruitmentJobId] = useState<string | null>('All');
  const [selectedApplicant, setSelectedApplicant] = useState<DashJobApplication | null>(null);
  const [applicantModalOpen, setApplicantModalOpen] = useState(false);

  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editAbout, setEditAbout] = useState(false);
  const [editHome, setEditHome] = useState(false);
  const [newsSearch, setNewsSearch] = useState('');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');
  const [complaintsSearch, setComplaintsSearch] = useState('');
  const [complaintsFilterType, setComplaintsFilterType] = useState('All');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [newArt, setNewArt] = useState<Partial<DashNewsItem>>({ title: '', titleAr: '', summary: '', summaryAr: '', date: '', image: '', published: true });
  const [newJob, setNewJob] = useState<Partial<DashJob>>({ title: '', titleAr: '', department: '', departmentAr: '', location: '', locationAr: '', type: '', typeAr: '', description: '', descriptionAr: '', image: '' });
  const [profileDraft, setProfileDraft] = useState({ ...profile });
  const [addSchoolOpen, setAddSchoolOpen] = useState(false);
  const [newSchool, setNewSchool] = useState<Partial<DashSchool>>({ name: '', location: '', governorate: '', principal: '', logo: '', type: 'Language', mainImage: '', gallery: [], about: '', aboutAr: '', phone: '', email: '', website: '', rating: '', studentCount: '', foundedYear: '', address: '', addressAr: '', applicationLink: '' });
  const [confirmAction, setConfirmAction] = useState<{ message: string, onConfirm: () => void } | null>(null);

  const [complaintPage, setComplaintPage] = useState(1);
  const [complaintTotalPages, setComplaintTotalPages] = useState(1);
  const [messagePage, setMessagePage] = useState(1);
  const [messageTotalPages, setMessageTotalPages] = useState(1);
  const [applicantPage, setApplicantPage] = useState(1);
  const [applicantTotalPages, setApplicantTotalPages] = useState(1);
  const [newsPage, setNewsPage] = useState(1);
  const [newsTotalPages, setNewsTotalPages] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [dashStats, setDashStats] = useState({ totalNews: 0, publishedNews: 0, schoolsCount: 0, totalStudents: 0 });

  const debouncedComplaintSearch = useDebounce(complaintsSearch, 500);
  const debouncedSchoolSearch = useDebounce(schoolSearch, 500);
  const debouncedNewsSearch = useDebounce(newsSearch, 500);
  const debouncedJobSearch = useDebounce(jobSearch, 500);

  const u = UI[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    localStorage.setItem('dash-theme', theme);
  }, [theme]);

  // Sync Working Hours form to contactData strings
  useEffect(() => {
    const hours = buildWorkingHours(whForm);
    setContactData((p: any) => ({ ...p, workingHours: hours.en, workingHoursAr: hours.ar }));
  }, [whForm]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetching Paginated Data ──────────────────────────────────────────────
  // ── Polling for new arrivals (Auto-refresh every 30s for active section) ───
  useEffect(() => {
    let interval: any;
    if (['complaints', 'contactMessages', 'recruitment', 'news'].includes(section)) {
      interval = setInterval(() => {
        if (section === 'complaints') fetchComplaints();
        if (section === 'contactMessages') fetchMessages();
        if (section === 'recruitment') fetchApplicants();
        if (section === 'news') fetchNews();
      }, 30000); // 30 seconds polling
    }
    return () => { if (interval) clearInterval(interval); };
  }, [section, complaintPage, messagePage, applicantPage, newsPage, debouncedComplaintSearch, debouncedNewsSearch, complaintsFilterType, selectedRecruitmentJobId]);

  useEffect(() => {
    if (section === 'complaints') fetchComplaints();
  }, [section, complaintPage, debouncedComplaintSearch, complaintsFilterType]);

  useEffect(() => {
    if (section === 'contactMessages') fetchMessages();
  }, [section, messagePage]);

  useEffect(() => {
    if (section === 'recruitment') fetchApplicants();
  }, [section, applicantPage, selectedRecruitmentJobId, debouncedJobSearch]);

  useEffect(() => {
    if (section === 'news') fetchNews();
  }, [section, newsPage, debouncedNewsSearch]);

  useEffect(() => {
    if (section === 'schools') fetchSchools();
  }, [section, debouncedSchoolSearch]);

  useEffect(() => {
    if (section === 'jobs') fetchJobs();
  }, [section, debouncedJobSearch]);

  useEffect(() => {
    if (section === 'departments' || section === 'recruitment' || section === 'jobs') fetchDepartments();
  }, [section]);

  // Initial fetch for overview stats
  useEffect(() => {
    fetchDashboardStats();
    // Pre-fetch news list just for the "Recent Articles" list in overview
    fetchNews();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await getDashboardStats();
      if (res.status === 'success') setDashStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchComplaints = async () => {
    setIsTableLoading(true);
    try {
      const res = await getPaginatedEntries({ type: 'complaints', page: complaintPage, limit: 12, search: debouncedComplaintSearch, filterType: complaintsFilterType });
      if (res.status === 'success') {
        setComplaints(res.data.items);
        setComplaintTotalPages(res.data.totalPages);
      }
    } catch (err) { console.error(err); }
    finally { setIsTableLoading(false); }
  };

  const fetchMessages = async () => {
    setIsTableLoading(true);
    try {
      const res = await getPaginatedEntries({ type: 'contactMessages', page: messagePage, limit: 12 });
      if (res.status === 'success') {
        setContactMessages(res.data.items);
        setMessageTotalPages(res.data.totalPages);
      }
    } catch (err) { console.error(err); }
    finally { setIsTableLoading(false); }
  };

  const fetchApplicants = async () => {
    setIsTableLoading(true);
    try {
      const res = await getPaginatedEntries({
        type: 'jobApplications',
        page: applicantPage,
        limit: 12,
        filterType: selectedRecruitmentJobId || 'All',
        search: debouncedJobSearch
      });
      if (res.status === 'success') {
        setApplications(res.data.items);
        setApplicantTotalPages(res.data.totalPages);
      }
    } catch (err) { console.error(err); }
    finally { setIsTableLoading(false); }
  };

  const fetchNews = async () => {
    setIsTableLoading(true);
    try {
      const res = await getPaginatedEntries({ type: 'news', page: newsPage, limit: 10, search: debouncedNewsSearch });
      if (res.status === 'success') {
        setNewsList(res.data.items);
        setNewsTotalPages(res.data.totalPages);
      }
    } catch (err) { console.error(err); }
    finally { setIsTableLoading(false); }
  };

  const fetchSchools = async () => {
    setIsTableLoading(true);
    try {
      const res = await getPaginatedEntries({ type: 'schools', page: 1, limit: 100, search: debouncedSchoolSearch });
      if (res.status === 'success') {
        setSchools(res.data.items);
      }
    } catch (err) { console.error(err); }
    finally { setIsTableLoading(false); }
  };

  const fetchJobs = async () => {
    setIsTableLoading(true);
    try {
      const res = await getPaginatedEntries({ type: 'jobs', page: 1, limit: 100, search: debouncedJobSearch });
      if (res.status === 'success') {
        setJobs(res.data.items);
      }
    } catch (err) { console.error(err); }
    finally { setIsTableLoading(false); }
  };

  const fetchDepartments = async () => {
    setIsTableLoading(true);
    try {
      const res = await getPaginatedEntries({ type: 'jobDepartments', page: 1, limit: 100 });
      if (res.status === 'success') {
        setDepartments(res.data.items);
      }
    } catch (err) { console.error(err); }
    finally { setIsTableLoading(false); }
  };

  // Listen for data context errors
  useEffect(() => {
    const handleApiError = (e: any) => {
      const { message, type } = e.detail;
      if (type === 'SAVE_FAILED') {
        showToast(lang === 'ar' ? `فشل الحفظ: ${message}` : `Save failed: ${message}`, 'error');
      }
    };
    window.addEventListener('nis_api_error', handleApiError);
    return () => window.removeEventListener('nis_api_error', handleApiError);
  }, [lang]);

  // Handlers
  const togglePublish = async (id: string) => {
    const item = newsList.find(n => n.id === id);
    if (!item) return;
    const updatedItem = { ...item, published: !item.published };

    // Optimistic Update
    setNewsList(prev => prev.map(n => n.id === id ? updatedItem : n));

    await apiSaveNews(updatedItem);
    showToast(u.articleSaved);
    fetchNews(); // Silent sync
  };
  const deleteNews = (id: string) => {
    setConfirmAction({
      message: lang === 'ar' ? 'هل أنت متأكد من حذف هذا الخبر؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this news article? This cannot be undone.',
      onConfirm: async () => {
        // Optimistic Update
        setNewsList(prev => prev.filter(n => n.id !== id));

        await apiDeleteNews(id);
        showToast(u.articleDeleted, 'error');
        fetchNews();
      }
    });
  };
  const saveNews = async (a: DashNewsItem) => {
    // Optimistic Update
    setNewsList(prev => prev.map(n => n.id === a.id ? a : n));
    setEditNewsId(null);

    await apiSaveNews(a);
    showToast(u.articleSaved);
    fetchNews();
  };
  const addNews = async (n: DashNewsItem) => {
    const newEntry = {
      ...n,
      title: n.title?.trim() ? n.title : n.titleAr,
      summary: n.summary?.trim() ? n.summary : n.summaryAr,
      content: n.content?.trim() ? n.content : n.contentAr,
      highlightTitle: n.highlightTitle?.trim() ? n.highlightTitle : n.highlightTitleAr,
      highlightContent: n.highlightContent?.trim() ? n.highlightContent : n.highlightContentAr,
      id: String(Date.now()),
      image: n.image || `https://picsum.photos/seed/${Date.now()}/800/600`,
      published: n.published ?? true
    };

    // Optimistic Update
    setNewsList(prev => [newEntry, ...prev]);

    setNewArt({
      title: '', titleAr: '', summary: '', summaryAr: '',
      image: '', content: '', contentAr: '',
      highlightTitle: '', highlightTitleAr: '',
      highlightContent: '', highlightContentAr: ''
    });
    setAddNewsOpen(false);
    showToast(u.articleAdded);

    await apiSaveNews(newEntry);
    fetchNews();
  };
  const saveHero = (s: HeroSlide) => {
    const updated = hero.map(h => h.id === s.id ? s : h);
    setHero(updated);
    updateData('heroSlides', updated);
    setEditHeroId(null);
    showToast(u.slideSaved);
  };
  const saveSchool = async (s: DashSchool) => {
    // Optimistic Update
    setSchools(prev => prev.map(sc => sc.id === s.id ? s : sc));
    setEditSchoolId(null);

    await apiSaveSchool(s);
    showToast(u.schoolSaved);
    fetchSchools();
  };
  const addSchool = async (s: DashSchool) => {
    const newEntry = { ...s, id: String(Date.now()) };

    // Optimistic Update
    setSchools(prev => [newEntry, ...prev]);
    setAddSchoolOpen(false);
    setNewSchool({ name: '', location: '', governorate: '', principal: '', logo: '', type: 'Language', mainImage: '', gallery: [], about: '', aboutAr: '', phone: '', email: '', website: '', rating: '', studentCount: '', foundedYear: '', address: '', addressAr: '', applicationLink: '' });
    showToast(u.schoolSaved);

    await apiSaveSchool(newEntry);
    fetchSchools();
  };
  const deleteSchool = (id: string) => {
    setConfirmAction({
      message: lang === 'ar' ? 'هل أنت متأكد من حذف هذه المدرسة؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this school? This cannot be undone.',
      onConfirm: async () => {
        // Optimistic Update
        setSchools(prev => prev.filter(sc => sc.id !== id));

        await apiDeleteSchool(id);
        showToast('School deleted', 'error');
        fetchSchools();
      }
    });
  };

  const saveJob = async (j: DashJob) => {
    // Optimistic Update
    setJobs(prev => prev.map(jb => jb.id === j.id ? j : jb));
    setEditJobId(null);

    await apiSaveJob(j);
    showToast(u.jobSaved);
    fetchJobs();
  };

  const deleteJob = (id: string) => {
    setConfirmAction({
      message: lang === 'ar' ? 'هل أنت متأكد من حذف هذه الوظيفة؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this job? This cannot be undone.',
      onConfirm: async () => {
        // Optimistic Update
        setJobs(prev => prev.filter(jb => jb.id !== id));

        await apiDeleteJob(id);
        showToast(u.jobDeleted, 'error');
        fetchJobs();
      }
    });
  };

  const addJob = async (j: DashJob) => {
    const newEntry: DashJob = {
      ...j,
      id: String(Date.now()),
    };

    // Optimistic Update
    setJobs(prev => [newEntry, ...prev]);

    setNewJob({
      title: '', titleAr: '', department: '', departmentAr: '',
      location: '', locationAr: '', type: '', typeAr: '',
      description: '', descriptionAr: '', image: ''
    });
    setAddJobOpen(false);
    showToast(u.jobAdded);

    await apiSaveJob(newEntry);
    fetchJobs();
  };

  const addDepartment = async () => {
    if (!newDepartment.nameEn || !newDepartment.nameAr) return showToast(lang === 'ar' ? 'الرجاء إدخال اسم القسم باللغتين' : 'Please enter department name in both languages', 'error');
    const newEntry = { id: String(Date.now()), nameEn: newDepartment.nameEn, nameAr: newDepartment.nameAr };
    const updated = [newEntry, ...departments];
    setDepartments(updated);
    await updateData('jobDepartments', updated);
    setAddDepartmentOpen(false);
    setNewDepartment({ nameEn: '', nameAr: '' });
    showToast(lang === 'ar' ? 'تم إضافة القسم' : 'Department added');
    fetchDepartments();
  };

  const deleteDepartment = (id: string) => {
    const dep = departments.find(d => d.id === id);
    if (!dep) return;
    const isUsed = jobs.some(j => j.department === dep.nameEn || j.departmentAr === dep.nameAr);
    if (isUsed) {
      showToast(lang === 'ar' ? 'لا يمكن حذف القسم لأنه يحتوي على وظائف مسجلة.' : 'Cannot delete department as it contains active jobs.', 'error');
      return;
    }
    setConfirmAction({
      message: lang === 'ar' ? 'هل أنت متأكد من حذف هذا القسم؟' : 'Are you sure you want to delete this department?',
      onConfirm: async () => {
        const updated = departments.filter(d => d.id !== id);
        setDepartments(updated);
        await updateData('jobDepartments', updated);
        showToast(lang === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully', 'error');
        fetchDepartments();
      }
    });
  };

  const deleteComplaint = (id: string) => {
    setConfirmAction({
      message: lang === 'ar' ? 'هل أنت متأكد من حذف هذه الشكوى؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this complaint? This cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteEntry('complaints', id);
          showToast(lang === 'ar' ? 'تم حذف الشكوى' : 'Complaint deleted', 'error');
          fetchComplaints();
        } catch (err) {
          showToast(lang === 'ar' ? 'فشل الحذف' : 'Delete failed', 'error');
        }
      }
    });
  };

  const deleteContactMessage = (id: string) => {
    setConfirmAction({
      message: lang === 'ar' ? 'هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this message? This cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteEntry('contactMessages', id);
          showToast(lang === 'ar' ? 'تم حذف الرسالة' : 'Message deleted', 'error');
          fetchMessages();
        } catch {
          showToast(lang === 'ar' ? 'فشل الحذف' : 'Delete failed', 'error');
        }
      }
    });
  };

  const saveAbout = () => {
    updateData('aboutData', about);
    setEditAbout(false);
    showToast(u.aboutSaved);
  };

  const saveHome = () => {
    updateData('homeData', homeData);
    updateData('partners', partners);
    setEditHome(false);
    showToast(u.homeUpdated);
  };

  const filteredNews = newsList;
  const filteredSchools = schools;
  const filteredJobs = jobs;

  // These are now filtered on the backend
  const filteredApplications = applications;
  const filteredComplaints = complaints;

  const publishedCount = newsList.filter(n => n.published).length;

  const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: u.overview, icon: LayoutDashboard },
    { id: 'home', label: u.home, icon: HomeIcon },
    { id: 'hero', label: u.hero, icon: Image },
    { id: 'chairman', label: u.chairman, icon: Users },
    { id: 'institute', label: u.institute, icon: Info },
    { id: 'schools', label: u.schools, icon: School },
    { id: 'news', label: u.news, icon: Newspaper },
    { id: 'recruitment', label: u.recruitmentPortal, icon: Briefcase },
    { id: 'departments', label: lang === 'ar' ? 'أقسام الوظائف' : 'Job Departments', icon: LayoutDashboard },
    { id: 'jobs', label: u.jobs, icon: Briefcase },
    { id: 'complaints', label: u.complaints, icon: MessageSquare },
    { id: 'contact', label: u.contactSettings || 'Contact Info', icon: Phone },
    { id: 'contactMessages', label: u.contactMessages, icon: Mail },
    { id: 'forms', label: u.forms, icon: Bell },
    { id: 'settings', label: u.settings, icon: Settings },
  ];

  const saveFormSettings = () => {
    updateData('formSettings', formSettings);
    showToast(u.settingsSaved || 'Settings saved!');
  };

  const saveContactData = () => {
    // Basic validations
    if (contactData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
      showToast(isRTL ? 'تنسيق البريد الإلكتروني غير صالح' : 'Invalid email format', 'error');
      return;
    }

    // Check URLs
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (contactData.facebook && !urlPattern.test(contactData.facebook)) {
      showToast(isRTL ? 'رابط فيسبوك غير صالح' : 'Invalid Facebook URL', 'error'); return;
    }
    if (contactData.twitter && !urlPattern.test(contactData.twitter)) {
      showToast(isRTL ? 'رابط تويتر غير صالح' : 'Invalid Twitter URL', 'error'); return;
    }
    if (contactData.instagram && !urlPattern.test(contactData.instagram)) {
      showToast(isRTL ? 'رابط انستجرام غير صالح' : 'Invalid Instagram URL', 'error'); return;
    }
    if (contactData.linkedin && !urlPattern.test(contactData.linkedin)) {
      showToast(isRTL ? 'رابط لينكد إن غير صالح' : 'Invalid LinkedIn URL', 'error'); return;
    }

    // Auto prepend https if missing and valid
    const fixUrl = (u: string) => (u && !/^https?:\/\//i.test(u)) ? `https://${u}` : u;
    const cleanData = {
      ...contactData,
      facebook: fixUrl(contactData.facebook),
      twitter: fixUrl(contactData.twitter),
      instagram: fixUrl(contactData.instagram),
      linkedin: fixUrl(contactData.linkedin),
    };

    updateData('contactData', cleanData);
    setContactData(cleanData); // Sync local state with cleaned URLs
    showToast(u.settingsSaved || 'Settings saved!');
  };

  return (
    <div className={`dash-root ${theme === 'dark' ? 'dark' : ''} ${isRTL ? 'rtl' : ''}`}>
      <style>{CSS}</style>
      <div className={`sidebar-overlay ${!collapsed ? 'active' : ''}`} onClick={() => setCollapsed(true)} />

      {/* Sidebar */}
      <aside className={`dash-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--surface)', borderRadius: 12, padding: 4 }}>
            <NISLogo className="h-full w-full" showText={false} />
          </div>
          {!collapsed && <div><p style={{ color: 'var(--text)', fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>NIS Admin</p><p style={{ color: 'var(--text2)', fontSize: 11 }}>Content Manager</p></div>}
        </div>
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {!collapsed && <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 20px', marginBottom: 6 }}>{u.overview}</p>}
          {navItems.filter(n => n.id !== 'settings').map(item => (
            <div key={item.id} className={`nav-item ${section === item.id ? 'active' : ''}`} onClick={() => { setSection(item.id); if (window.innerWidth < 1024) setCollapsed(true); }}>
              <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: 13 }}>{item.label}</span>}
              {!collapsed && section === item.id && <ChevronRight style={{ width: 14, height: 14, marginInlineStart: 'auto', opacity: 0.5, transform: isRTL ? 'scaleX(-1)' : 'none' }} />}
            </div>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: 8 }}>
          <div className={`nav-item ${section === 'settings' ? 'active' : ''}`} onClick={() => { setSection('settings'); if (window.innerWidth < 1024) setCollapsed(true); }}>
            <Settings style={{ width: 18, height: 18, flexShrink: 0 }} />{!collapsed && <span style={{ fontSize: 13 }}>{u.settings}</span>}
          </div>
          <div className="nav-item" onClick={logout}><LogOut style={{ width: 18, height: 18, flexShrink: 0 }} />{!collapsed && <span style={{ fontSize: 13 }}>{u.logout}</span>}</div>
        </div>
      </aside>

      {/* Main */}
      <div className={`dash-main ${collapsed ? 'collapsed' : ''}`}>
        {/* Topbar */}
        <header className="dash-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="dash-icon-btn" onClick={() => setCollapsed(!collapsed)}><Menu style={{ width: 20, height: 20 }} /></button>
            <div className="mobile-hide">
              <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', lineHeight: 1.2 }}>{section === 'departments' ? (lang === 'ar' ? 'أقسام الوظائف' : 'Job Departments') : (u[section as keyof typeof u] as string)}</p>
              <p style={{ fontSize: 11, color: 'var(--text2)' }}>National Institutes Schools Portal</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Lang toggle */}
            <div className="toggle-pill">
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
              <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>AR</button>
            </div>
            {/* Theme toggle */}
            <button className="dash-icon-btn" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon style={{ width: 18, height: 18 }} /> : <Sun style={{ width: 18, height: 18 }} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 10, borderLeft: '1px solid var(--border)' }}>
              <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>AD</span>
              </div>
              <div className="sm-show" style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{profile.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text2)' }}>{lang === 'ar' ? 'مسؤول النظام' : 'Super Admin'}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="dash-content">

          {/* ── Overview ── */}
          {section === 'overview' && (
            <div className="section-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
                {[
                  { icon: Newspaper, label: u.totalArticles, val: isRTL ? getArNumber(dashStats.totalNews) : String(dashStats.totalNews), color: '#4f46e5', bg: 'rgba(79,70,229,0.1)' },
                  { icon: CheckCircle, label: u.publishedCount, val: isRTL ? getArNumber(dashStats.publishedNews) : String(dashStats.publishedNews), color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                  { icon: School, label: u.schoolsCount, val: isRTL ? getArNumber(dashStats.schoolsCount) : String(dashStats.schoolsCount), color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
                  { icon: Users, label: u.studentsCount, val: isRTL ? getArNumber(dashStats.totalStudents.toLocaleString()) : dashStats.totalStudents.toLocaleString(), color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                ].map(({ icon: Icon, label, val, color, bg }) => (
                  <div key={label} className="stat-card">
                    <div className="stat-icon" style={{ background: bg }}><Icon style={{ width: 22, height: 22, color }} /></div>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>{label}</p>
                      <p style={{ fontSize: 26, fontWeight: 900, color: 'var(--text)', lineHeight: 1.1 }}>{val}</p>
                      <p style={{ fontSize: 11, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}><TrendingUp style={{ width: 12, height: 12 }} />{lang === 'ar' ? 'هذا العام' : 'This year'}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Quick Actions */}
              <div className="dash-card" style={{ padding: 20 }}>
                <p className="dash-label" style={{ marginBottom: 12 }}>{u.quickActions}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button className="dash-btn dash-btn-primary" onClick={() => { setSection('news'); setAddNewsOpen(true); }}><Plus style={{ width: 15, height: 15 }} />{u.addNewArticle}</button>
                  <button className="dash-btn dash-btn-ghost" onClick={() => setSection('hero')}><Image style={{ width: 15, height: 15 }} />{u.editHero}</button>
                  <button className="dash-btn dash-btn-ghost" onClick={() => setSection('chairman')}><Users style={{ width: 15, height: 15 }} />{u.chairman}</button>
                  <button className="dash-btn dash-btn-ghost" onClick={() => setSection('institute')}><Info style={{ width: 15, height: 15 }} />{u.institute}</button>
                </div>
              </div>
              {/* Recent */}
              <div className="dash-card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{u.recentArticles}</p>
                  <button style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSection('news')}>{u.viewAll}</button>
                </div>
                {newsList.slice(0, 5).map(n => (
                  <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
                    <img src={n.image || undefined} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} alt="" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{n.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{n.date}</p>
                    </div>
                    <span className={`dash-badge ${n.published ? 'badge-green' : 'badge-gray'}`}>{n.published ? u.published : u.draft}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── News ── */}
          {section === 'news' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.news}</h2>
                  <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{newsList.length} {u.newsManage} · {publishedCount} {u.publishedCount}</p>
                </div>
                <button className="dash-btn dash-btn-primary" onClick={() => setAddNewsOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.addArticle}</button>
              </div>
              <div style={{ position: 'relative', marginBottom: 16, maxWidth: 320 }}>
                <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 14, right: isRTL ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text2)' }} />
                <input className="dash-input" style={{ paddingLeft: isRTL ? 14 : 40, paddingRight: isRTL ? 40 : 14 }} placeholder={u.search} value={newsSearch} onChange={e => setNewsSearch(e.target.value)} />
              </div>
              <div className="dash-card" style={{ overflow: 'hidden', position: 'relative' }}>
                {isTableLoading && (
                  <div className="table-loader">
                    <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
                  </div>
                )}
                <div className="row-header">
                  <div /><p className="dash-label" style={{ margin: 0 }}>{u.title}</p><p className="dash-label" style={{ margin: 0 }}>{u.date}</p><p className="dash-label" style={{ margin: 0 }}>{u.status}</p><p className="dash-label" style={{ margin: 0 }}>{u.actions}</p>
                </div>
                {newsList.map(n => (
                  <div key={n.id} className="news-row">
                    <img src={n.image || undefined} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover' }} alt="" />
                    <div style={{ minWidth: 0, position: 'relative' }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {n.title}
                        {n.featured && <span style={{ fontSize: '10px', background: '#eab308', color: 'white', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', fontWeight: 'bold' }}>⭐ المميز</span>}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{n.titleAr}</p>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text2)' }}>{n.date}</p>
                    <button className={`dash-badge ${n.published ? 'badge-green' : 'badge-gray'}`} style={{ cursor: 'pointer', border: 'none' }} onClick={() => togglePublish(n.id)}>{n.published ? u.published : u.draft}</button>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="dash-icon-btn" title={u.edit} onClick={() => setEditNewsId(n.id)}><Pencil style={{ width: 15, height: 15, color: 'var(--accent)' }} /></button>
                      <button className="dash-icon-btn" title={n.published ? 'Unpublish' : 'Publish'} onClick={() => togglePublish(n.id)}>{n.published ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}</button>
                      <button className="dash-icon-btn" title={u.delete} onClick={() => deleteNews(n.id)}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
                    </div>
                  </div>
                ))}
                {newsList.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}><Newspaper style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>{u.noResults}</p></div>}
              </div>
              <Pagination current={newsPage} total={newsTotalPages} onChange={setNewsPage} lang={lang} />
            </div>
          )}

          {/* ── Schools ── */}
          {section === 'schools' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.schools}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.schoolsManage}</p></div>
                <button className="dash-btn dash-btn-primary" onClick={() => setAddSchoolOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.addSchool}</button>
              </div>
              <div style={{ position: 'relative', marginBottom: 18, maxWidth: 320 }}>
                <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 14, right: isRTL ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text2)' }} />
                <input className="dash-input" style={{ paddingLeft: isRTL ? 14 : 40, paddingRight: isRTL ? 40 : 14 }} placeholder={u.search} value={schoolSearch} onChange={e => setSchoolSearch(e.target.value)} />
              </div>
              <div style={{ position: 'relative' }}>
                {isTableLoading && (
                  <div className="table-loader" style={{ borderRadius: 24 }}>
                    <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
                  </div>
                )}
                <div className="school-grid">
                  {filteredSchools.map(s => (
                    <div key={s.id} className="school-card">
                      <img src={s.logo || undefined} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', background: 'var(--surface2)', flexShrink: 0 }} alt={s.name} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}><MapPin style={{ width: 11, height: 11 }} />{s.location}, {s.governorate}</p>
                        <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {(Array.isArray(s.type) ? s.type : []).map((t: string) => (
                            <span key={t} style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(79,70,229,0.1)', color: 'var(--accent)' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="dash-icon-btn" onClick={() => setEditSchoolId(s.id)} title={u.edit}><Pencil style={{ width: 15, height: 15, color: 'var(--accent)' }} /></button>
                        <button className="dash-icon-btn" onClick={() => deleteSchool(s.id)} title={u.delete}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Departments ── */}
          {section === 'departments' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{lang === 'ar' ? 'أقسام الوظائف' : 'Job Departments'}</h2></div>
                <button className="dash-btn dash-btn-primary" onClick={() => setAddDepartmentOpen(true)}><Plus style={{ width: 15, height: 15 }} />{lang === 'ar' ? 'بناء قسم جديد' : 'New Department'}</button>
              </div>
              <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
                <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.title} (EN)</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.titleAr || 'الاسم (AR)'}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dep, i) => (
                      <tr key={dep.id} style={{ borderBottom: i === departments.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s ease' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px 24px', color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{dep.nameEn}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text)', fontSize: 13 }}>{dep.nameAr}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <button className="dash-icon-btn" onClick={() => deleteDepartment(dep.id)} title={u.delete}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
                        </td>
                      </tr>
                    ))}
                    {departments.length === 0 && <tr><td colSpan={3} style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}><LayoutDashboard style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>{u.noResults}</p></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Jobs ── */}
          {section === 'jobs' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.jobs}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.jobsManage}</p></div>
                <button className="dash-btn dash-btn-primary" onClick={() => setAddJobOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.addJob}</button>
              </div>
              <div style={{ position: 'relative', marginBottom: 18, maxWidth: 320 }}>
                <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 14, right: isRTL ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text2)' }} />
                <input className="dash-input" style={{ paddingLeft: isRTL ? 14 : 40, paddingRight: isRTL ? 40 : 14 }} placeholder={u.search} value={jobSearch} onChange={e => setJobSearch(e.target.value)} />
              </div>
              <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
                {isTableLoading && (
                  <div className="table-loader">
                    <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
                  </div>
                )}
                <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.title}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.department}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.location}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job, i) => (
                      <tr key={job.id} style={{ borderBottom: i === filteredJobs.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s ease' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px 24px', color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{lang === 'ar' ? job.titleAr : job.title}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13 }}>{lang === 'ar' ? job.departmentAr : job.department}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13 }}>{lang === 'ar' ? job.locationAr : job.location}</td>
                        <td style={{ padding: '16px 24px', display: 'flex', gap: 4 }}>
                          <button className="dash-icon-btn" onClick={() => setEditJobId(job.id)} title={u.edit}><Pencil style={{ width: 15, height: 15, color: 'var(--accent)' }} /></button>
                          <button className="dash-icon-btn" onClick={() => deleteJob(job.id)} title={u.delete}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
                        </td>
                      </tr>
                    ))}
                    {filteredJobs.length === 0 && <tr><td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}><Briefcase style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>{u.noResults}</p></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Recruitment Portal ── */}
          {section === 'recruitment' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.recruitmentPortal}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.applicantsManage}</p></div>
              </div>

              {/* Tabs */}
              <div className="dash-card" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '16px 20px', marginBottom: 24, whiteSpace: 'nowrap', alignItems: 'center' }}>
                <button
                  onClick={() => setSelectedRecruitmentJobId('All')}
                  style={{
                    padding: '8px 28px',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: (!selectedRecruitmentJobId || selectedRecruitmentJobId === 'All') ? 'none' : '1px solid var(--border)',
                    backgroundColor: (!selectedRecruitmentJobId || selectedRecruitmentJobId === 'All') ? '#111827' : 'var(--bg)',
                    color: (!selectedRecruitmentJobId || selectedRecruitmentJobId === 'All') ? 'white' : 'var(--text2)',
                    flexShrink: 0,
                    boxShadow: (!selectedRecruitmentJobId || selectedRecruitmentJobId === 'All') ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {lang === 'ar' ? 'الكل' : 'All'}
                </button>
                {departments.map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedRecruitmentJobId(lang === 'ar' ? dept.nameAr : dept.nameEn)}
                    style={{
                      padding: '8px 24px',
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: selectedRecruitmentJobId === (lang === 'ar' ? dept.nameAr : dept.nameEn) ? 'none' : '1px solid var(--border)',
                      backgroundColor: selectedRecruitmentJobId === (lang === 'ar' ? dept.nameAr : dept.nameEn) ? '#111827' : 'var(--bg)',
                      color: selectedRecruitmentJobId === (lang === 'ar' ? dept.nameAr : dept.nameEn) ? 'white' : 'var(--text2)',
                      flexShrink: 0,
                      boxShadow: selectedRecruitmentJobId === (lang === 'ar' ? dept.nameAr : dept.nameEn) ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    {lang === 'ar' ? dept.nameAr : dept.nameEn}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: 'relative', marginBottom: 18, maxWidth: 320 }}>
                <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 14, right: isRTL ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text2)' }} />
                <input className="dash-input" style={{ paddingLeft: isRTL ? 14 : 40, paddingRight: isRTL ? 40 : 14 }} placeholder={u.search} value={jobSearch} onChange={e => setJobSearch(e.target.value)} />
              </div>

              {/* Applications Table */}
              <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
                {isTableLoading && (
                  <div className="table-loader">
                    <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
                  </div>
                )}
                <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.applicants}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{lang === 'ar' ? 'الوظيفة المتقدم لها' : 'Applied Job'}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.applicationDate}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.status}</th>
                      <th style={{ padding: '14px 12px', width: 48 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.length > 0 ? filteredApplications.map((app, idx) => (
                      <tr key={idx} style={{ cursor: 'pointer', borderBottom: idx === filteredApplications.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s ease' }}
                        onClick={async () => {
                          setIsTableLoading(true);
                          try {
                            const res = await getJobApplicationDetails(app.id);
                            if (res.status === 'success') {
                              setSelectedApplicant(res.data);
                              setApplicantModalOpen(true);
                            }
                          } catch (err) {
                            showToast(lang === 'ar' ? 'فشل تحميل الطلب' : 'Failed to load application', 'error');
                          } finally {
                            setIsTableLoading(false);
                          }
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'var(--surface2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                              {app.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{app.fullName}</p>
                              <p style={{ fontSize: 11, color: 'var(--text2)' }}>{app.email}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13, fontWeight: 600 }}>{app.jobTitle}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 11 }}>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') : ''}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                            background: app.status === 'Hired' ? 'rgba(16,185,129,0.12)' : app.status === 'Rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                            color: app.status === 'Hired' ? '#10b981' : app.status === 'Rejected' ? '#ef4444' : 'var(--accent)',
                          }}>{app.status}</span>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <ChevronRight style={{ width: 16, height: 16, color: 'var(--border)', transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}>
                          <Users style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} />
                          <p style={{ fontWeight: 600 }}>{u.noResults}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination current={applicantPage} total={applicantTotalPages} onChange={setApplicantPage} lang={lang} />

              {/* applicant detail modal */}
              {applicantModalOpen && selectedApplicant && (
                <ModalWrap title={u.applicants} onClose={() => setApplicantModalOpen(false)}>
                  <div className="space-y-4">
                    <p><strong>{u.applicants}:</strong> {selectedApplicant.fullName}</p>
                    <p><strong>{u.email}:</strong> {selectedApplicant.email}</p>
                    <p><strong>{u.phone}:</strong> {selectedApplicant.phone}</p>
                    <p><strong>{u.applicationDate}:</strong> {new Date(selectedApplicant.appliedAt).toLocaleString()}</p>
                    <p><strong>{u.cv}:</strong> <a href={selectedApplicant.cvData} download={selectedApplicant.cvName}>{u.downloadCV}</a></p>
                    {selectedApplicant.cvData && (
                      <div className="mt-2">
                        <p className="dash-label">{u.previewCV}</p>
                        <iframe src={selectedApplicant.cvData} width="100%" height="400px" className="border" title="cv preview" />
                      </div>
                    )}
                    <div>
                      <label className="dash-label">{u.status}</label>
                      <CustomSelect
                        value={selectedApplicant.status}
                        onChange={val => setSelectedApplicant(a => a ? { ...a, status: val as any } : null)}
                        options={['Pending', 'Interview', 'Rejected', 'Hired', 'On Hold'].map(st => ({
                          value: st,
                          label: u[st.toLowerCase() as keyof typeof u] || st
                        }))}
                      />
                    </div>
                    <div>
                      <label className="dash-label">{u.notes}</label>
                      <textarea className="dash-input dash-ta" value={selectedApplicant.notes || ''} onChange={e => setSelectedApplicant(a => a ? { ...a, notes: e.target.value } : null)} />
                    </div>
                    <div className="dash-form-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button className="dash-btn dash-btn-primary" onClick={async () => {
                        if (!selectedApplicant) return;
                        try {
                          const res = await updateJobApplication(selectedApplicant.id, selectedApplicant.status);
                          if (res.status === 'success') {
                            showToast(lang === 'ar' ? 'تم تحديث الحالة بنجاح' : 'Status updated successfully');
                            fetchApplicants(); // Refetch paginated data
                            setApplicantModalOpen(false);
                          }
                        } catch (err) {
                          showToast(lang === 'ar' ? 'فشل التحديث' : 'Update failed', 'error');
                        }
                      }}>{u.save}</button>
                      <button className="dash-btn dash-btn-ghost" onClick={() => setApplicantModalOpen(false)}>{u.cancel}</button>
                      <button
                        className="dash-btn dash-btn-danger"
                        style={{ marginInlineStart: 'auto' }}
                        onClick={() => {
                          setConfirmAction({
                            message: lang === 'ar' ? 'هل أنت متأكد من حذف هذا المتقدم؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this applicant? This cannot be undone.',
                            onConfirm: async () => {
                              try {
                                await deleteEntry('jobApplications', selectedApplicant.id);
                                showToast(lang === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
                                fetchApplicants();
                                setApplicantModalOpen(false);
                              } catch (err) {
                                showToast(lang === 'ar' ? 'فشل الحذف' : 'Delete failed', 'error');
                              }
                            }
                          });
                        }}
                      >
                        <Trash2 style={{ width: 14, height: 14 }} /> {u.delete}
                      </button>
                    </div>
                  </div>
                </ModalWrap>
              )}
            </div>
          )}

          {section === 'hero' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.hero}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.heroManage}</p></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {hero.map((s, i) => (
                  <div key={s.id} className="hero-card">
                    {s.image && <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}><img src={s.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} /><span style={{ position: 'absolute', bottom: 12, left: 16, right: 16, color: 'white', fontWeight: 800, fontSize: 18 }}>{s.title}</span></div>}
                    <div style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{s.title}</p>
                          <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{s.subtitle}</p>
                          <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4, maxWidth: 400 }}>{s.description}</p>
                        </div>
                      </div>
                      <button className="dash-btn dash-btn-ghost" onClick={() => setEditHeroId(s.id)}><Pencil style={{ width: 14, height: 14 }} />{u.edit}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Chairman Word ── */}
          {section === 'chairman' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.chairman}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.chairmanManage}</p></div>
                {!editAbout && <button className="dash-btn dash-btn-primary" onClick={() => setEditAbout(true)}><Pencil style={{ width: 14, height: 14 }} />{u.editSection}</button>}
              </div>
              {!editAbout ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="dash-card" style={{ padding: 18 }}>
                    <p className="dash-label">{u.chairmanImageLabel}</p>
                    {about.chairmanImage && (
                      <img src={about.chairmanImage} alt="" className="w-32 h-32 rounded-2xl object-cover border border-var(--border) mt-2" />
                    )}
                  </div>
                  {[{ l: u.chairmanName, v: about.name }, { l: u.role, v: about.role }, { l: u.quote, v: `"${about.quote}"` }, { l: u.description, v: about.desc }].map(({ l, v }) => (
                    <div key={l} className="dash-card" style={{ padding: 18 }}><p className="dash-label">{l}</p><p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.6 }}>{v}</p></div>
                  ))}
                  <div className="dash-card" style={{ padding: 18 }}><p className="dash-label">{u.keyPoints}</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>{about.points.map((p, i) => <span key={i} style={{ padding: '4px 14px', borderRadius: 999, background: 'rgba(79,70,229,0.1)', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>{p}</span>)}</div></div>
                </div>
              ) : (
                <div className="dash-card" style={{ padding: 24 }}>
                  <div className="form-grid">
                    <h4 className="form-full font-bold border-b pb-2 mb-2 text-slate-400 uppercase text-xs tracking-widest">{u.chairman}</h4>
                    <div className="form-full">
                      <ImageUpload label={u.chairmanImageLabel} value={about.chairmanImage || ''} onChange={val => setAbout(a => ({ ...a, chairmanImage: val }))} />
                    </div>
                    <div className="form-col"><label className="dash-label">{u.chairmanName} (EN)</label><input className="dash-input" value={about.name} onChange={e => setAbout(a => ({ ...a, name: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.chairmanName} (AR)</label><input className="dash-input" dir="rtl" value={about.nameAr} onChange={e => setAbout(a => ({ ...a, nameAr: e.target.value }))} /></div>

                    <div className="form-col"><label className="dash-label">{u.role} (EN)</label><input className="dash-input" value={about.role} onChange={e => setAbout(a => ({ ...a, role: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.role} (AR)</label><input className="dash-input" dir="rtl" value={about.roleAr} onChange={e => setAbout(a => ({ ...a, roleAr: e.target.value }))} /></div>

                    <div className="form-full"><label className="dash-label">{u.quote} (EN)</label><input className="dash-input" value={about.quote} onChange={e => setAbout(a => ({ ...a, quote: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.quote} (AR)</label><input className="dash-input" dir="rtl" value={about.quoteAr} onChange={e => setAbout(a => ({ ...a, quoteAr: e.target.value }))} /></div>

                    <div className="form-full"><label className="dash-label">{u.description} (EN)</label><textarea className="dash-input dash-ta" value={about.desc} onChange={e => setAbout(a => ({ ...a, desc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.description} (AR)</label><textarea className="dash-input dash-ta" dir="rtl" value={about.descAr} onChange={e => setAbout(a => ({ ...a, descAr: e.target.value }))} /></div>

                    <div className="form-full dash-form-actions">
                      <button className="dash-btn dash-btn-primary" onClick={saveAbout}><Save style={{ width: 14, height: 14 }} />{u.save}</button>
                      <button className="dash-btn dash-btn-ghost" onClick={() => setEditAbout(false)}>{u.cancel}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Institute About ── */}
          {section === 'institute' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.institute}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.instituteManage}</p></div>
                {!editAbout && <button className="dash-btn dash-btn-primary" onClick={() => setEditAbout(true)}><Pencil style={{ width: 14, height: 14 }} />{u.editSection}</button>}
              </div>
              {!editAbout ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="dash-card" style={{ padding: 18 }}><p className="dash-label">{u.story}</p><p style={{ fontWeight: 700 }}>{lang === 'ar' ? about.storyTitleAr : about.storyTitle}</p><p style={{ fontSize: 13, color: 'var(--text2)' }}>{lang === 'ar' ? about.storyDescAr : about.storyDesc}</p></div>
                  <div className="dash-card" style={{ padding: 18 }}><p className="dash-label">{u.mission}</p><p style={{ fontWeight: 700 }}>{lang === 'ar' ? about.missionTitleAr : about.missionTitle}</p><p style={{ fontSize: 13, color: 'var(--text2)' }}>{lang === 'ar' ? about.missionDescAr : about.missionDesc}</p></div>
                  <div className="dash-card" style={{ padding: 18 }}><p className="dash-label">{u.vision}</p><p style={{ fontWeight: 700 }}>{lang === 'ar' ? about.visionTitleAr : about.visionTitle}</p><p style={{ fontSize: 13, color: 'var(--text2)' }}>{lang === 'ar' ? about.visionDescAr : about.visionDesc}</p></div>
                </div>
              ) : (
                <div className="dash-card" style={{ padding: 24 }}>
                  <div className="form-grid">
                    <h4 className="form-full font-bold border-b pb-2 mb-2 text-slate-400 uppercase text-xs tracking-widest">{u.story}</h4>
                    <div className="form-col"><label className="dash-label">Story Title (EN)</label><input className="dash-input" value={about.storyTitle} onChange={e => setAbout(a => ({ ...a, storyTitle: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">عنوان القصة (عربي)</label><input className="dash-input" dir="rtl" value={about.storyTitleAr} onChange={e => setAbout(a => ({ ...a, storyTitleAr: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">Story Description (EN)</label><textarea className="dash-input dash-ta" value={about.storyDesc} onChange={e => setAbout(a => ({ ...a, storyDesc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">وصف القصة (عربي)</label><textarea className="dash-input dash-ta" dir="rtl" value={about.storyDescAr} onChange={e => setAbout(a => ({ ...a, storyDescAr: e.target.value }))} /></div>

                    <h4 className="form-full font-bold border-b pb-2 mb-2 mt-4 text-slate-400 uppercase text-xs tracking-widest">{u.mission} & {u.vision}</h4>
                    <div className="form-col"><label className="dash-label">Mission Title (EN)</label><input className="dash-input" value={about.missionTitle} onChange={e => setAbout(a => ({ ...a, missionTitle: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">Mission Title (AR)</label><input className="dash-input" dir="rtl" value={about.missionTitleAr} onChange={e => setAbout(a => ({ ...a, missionTitleAr: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">Mission Description (EN)</label><textarea className="dash-input dash-ta" value={about.missionDesc} onChange={e => setAbout(a => ({ ...a, missionDesc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">Mission Description (AR)</label><textarea className="dash-input dash-ta" dir="rtl" value={about.missionDescAr} onChange={e => setAbout(a => ({ ...a, missionDescAr: e.target.value }))} /></div>

                    <div className="form-col"><label className="dash-label">Vision Title (EN)</label><input className="dash-input" value={about.visionTitle} onChange={e => setAbout(a => ({ ...a, visionTitle: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">Vision Title (AR)</label><input className="dash-input" dir="rtl" value={about.visionTitleAr} onChange={e => setAbout(a => ({ ...a, visionTitleAr: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">Vision Description (EN)</label><textarea className="dash-input dash-ta" value={about.visionDesc} onChange={e => setAbout(a => ({ ...a, visionDesc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">Vision Description (AR)</label><textarea className="dash-input dash-ta" dir="rtl" value={about.visionDescAr} onChange={e => setAbout(a => ({ ...a, visionDescAr: e.target.value }))} /></div>

                    <div className="form-full dash-form-actions">
                      <button className="dash-btn dash-btn-primary" onClick={saveAbout}><Save style={{ width: 14, height: 14 }} />{u.save}</button>
                      <button className="dash-btn dash-btn-ghost" onClick={() => setEditAbout(false)}>{u.cancel}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Home Page ── */}
          {section === 'home' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.home}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.homeManage}</p></div>
                {!editHome && <button className="dash-btn dash-btn-primary" onClick={() => setEditHome(true)}><Pencil style={{ width: 14, height: 14 }} />{u.editSection}</button>}
              </div>
              {!editHome ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="dash-card" style={{ padding: 18 }}>
                    <p className="dash-label">{u.introduction}</p>
                    <p style={{ fontWeight: 700 }}>{homeData.trustedTitle} {homeData.trustedHighlight}</p>
                    <p style={{ fontSize: 13, color: 'var(--text2)' }}>{homeData.trustedDesc}</p>
                  </div>
                  <div className="dash-card" style={{ padding: 18 }}>
                    <p className="dash-label">{u.map}</p>
                    <p style={{ fontWeight: 700 }}>{homeData.gatewayTitle} {homeData.gatewayHighlight}</p>
                    <p style={{ fontSize: 13, color: 'var(--text2)' }}>{homeData.gatewayDesc}</p>
                  </div>
                  <div className="dash-card" style={{ padding: 18 }}>
                    <p className="dash-label">{u.partnersGallery}</p>
                    <p style={{ fontWeight: 700 }}>{partners.length} Partners, {siteData.galleryImages?.length || 0} Gallery Images</p>
                  </div>
                  <div className="dash-card" style={{ padding: 18 }}>
                    <p className="dash-label">{lang === 'ar' ? 'الإحصائيات' : 'Statistics'}</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                      {siteData.stats?.items?.map((s, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-bold">{s.number}</span> <span className="text-slate-400">{s.label}</span>
                        </div>
                      )) || <p className="text-xs text-slate-400">{u.loading}</p>}
                    </div>
                  </div>
                  <div className="dash-card" style={{ padding: 18 }}>
                    <p className="dash-label">{u.bottomCTA}</p>
                    <p style={{ fontWeight: 700 }}>{homeData.ctaTitle}</p>
                    <p style={{ fontSize: 13, color: 'var(--text2)' }}>{homeData.ctaDesc}</p>
                  </div>
                </div>
              ) : (
                <div className="dash-card" style={{ padding: 24 }}>
                  <div className="form-grid">
                    <h4 className="form-full font-bold border-b pb-2 mb-2 text-slate-400 uppercase text-xs tracking-widest">{u.introduction}</h4>
                    <div className="form-col"><label className="dash-label">Title (EN)</label><input className="dash-input" value={homeData.trustedTitle} onChange={e => setHomeData(p => ({ ...p, trustedTitle: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">العنوان (عربي)</label><input className="dash-input" dir="rtl" value={homeData.trustedTitleAr} onChange={e => setHomeData(p => ({ ...p, trustedTitleAr: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">Highlight (EN)</label><input className="dash-input" value={homeData.trustedHighlight} onChange={e => setHomeData(p => ({ ...p, trustedHighlight: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">التظليل (عربي)</label><input className="dash-input" dir="rtl" value={homeData.trustedHighlightAr} onChange={e => setHomeData(p => ({ ...p, trustedHighlightAr: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">Description (EN)</label><textarea className="dash-input dash-ta" value={homeData.trustedDesc} onChange={e => setHomeData(p => ({ ...p, trustedDesc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">الوصف (عربي)</label><textarea className="dash-input dash-ta" dir="rtl" value={homeData.trustedDescAr} onChange={e => setHomeData(p => ({ ...p, trustedDescAr: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">Button Text (EN)</label><input className="dash-input" value={homeData.trustedCTA} onChange={e => setHomeData(p => ({ ...p, trustedCTA: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">نص الزر (عربي)</label><input className="dash-input" dir="rtl" value={homeData.trustedCTAAr} onChange={e => setHomeData(p => ({ ...p, trustedCTAAr: e.target.value }))} /></div>

                    <h4 className="form-full font-bold border-b pb-2 mb-2 mt-6 text-slate-400 uppercase text-xs tracking-widest">{u.map}</h4>
                    <div className="form-col"><label className="dash-label">Gateway Title (EN)</label><input className="dash-input" value={homeData.gatewayTitle} onChange={e => setHomeData(p => ({ ...p, gatewayTitle: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">عنوان البوابة (عربي)</label><input className="dash-input" dir="rtl" value={homeData.gatewayTitleAr} onChange={e => setHomeData(p => ({ ...p, gatewayTitleAr: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">Gateway Highlight (EN)</label><input className="dash-input" value={homeData.gatewayHighlight} onChange={e => setHomeData(p => ({ ...p, gatewayHighlight: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">تظليل البوابة (عربي)</label><input className="dash-input" dir="rtl" value={homeData.gatewayHighlightAr} onChange={e => setHomeData(p => ({ ...p, gatewayHighlightAr: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">Gateway Desc (EN)</label><textarea className="dash-input dash-ta" value={homeData.gatewayDesc} onChange={e => setHomeData(p => ({ ...p, gatewayDesc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">وصف البوابة (عربي)</label><textarea className="dash-input dash-ta" dir="rtl" value={homeData.gatewayDescAr} onChange={e => setHomeData(p => ({ ...p, gatewayDescAr: e.target.value }))} /></div>
                    <div className="form-full">
                      <ImageUpload label={u.mapImageLabel} value={homeData.mapImage} onChange={val => setHomeData(p => ({ ...p, mapImage: val }))} />
                    </div>

                    <h4 className="form-full font-bold border-b pb-2 mb-2 mt-6 text-slate-400 uppercase text-xs tracking-widest">{lang === 'ar' ? 'الإحصائيات' : 'Statistics'}</h4>
                    {homeData && siteData.stats?.items?.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <div className="form-col"><label className="dash-label">Stat {idx + 1} Number</label><input className="dash-input" value={siteData.stats.items[idx].number} onChange={e => {
                          const newItems = [...siteData.stats.items];
                          newItems[idx].number = e.target.value;
                          updateData('stats', { ...siteData.stats, items: newItems });
                        }} /></div>
                        <div className="form-col"><label className="dash-label">Stat {idx + 1} Label (EN)</label><input className="dash-input" value={siteData.stats.items[idx].label} onChange={e => {
                          const newItems = [...siteData.stats.items];
                          newItems[idx].label = e.target.value;
                          updateData('stats', { ...siteData.stats, items: newItems });
                        }} /></div>
                      </React.Fragment>
                    ))}

                    <h4 className="form-full font-bold border-b pb-2 mb-2 mt-6 text-slate-400 uppercase text-xs tracking-widest">{u.partnersGallery}</h4>
                    <div className="form-full">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {partners.map((p, i) => (
                          <div key={p.id} className="dash-card p-4">
                            <ImageUpload value={p.logo} onChange={val => {
                              const newP = [...partners];
                              newP[i].logo = val;
                              setPartners(newP);
                              updateData('partners', newP);
                            }} />
                            <p className="text-[10px] text-center mt-2 text-slate-400 font-bold">{p.name || `Partner ${i + 1}`}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <h4 className="form-full font-bold border-b pb-2 mb-2 mt-6 text-slate-400 uppercase text-xs tracking-widest">Gallery Mosaic Images</h4>
                    <div className="form-full">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {(siteData.galleryImages || []).map((img, i) => (
                          <div key={i} className="dash-card p-4">
                            <ImageUpload value={img} onChange={val => {
                              const newG = [...siteData.galleryImages];
                              newG[i] = val;
                              updateData('galleryImages', newG);
                            }} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <h4 className="form-full font-bold border-b pb-2 mb-2 mt-6 text-slate-400 uppercase text-xs tracking-widest">{u.bottomCTA}</h4>
                    <div className="form-col"><label className="dash-label">CTA Title (EN)</label><input className="dash-input" value={homeData.ctaTitle} onChange={e => setHomeData(p => ({ ...p, ctaTitle: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">عنوان الزر (عربي)</label><input className="dash-input" dir="rtl" value={homeData.ctaTitleAr} onChange={e => setHomeData(p => ({ ...p, ctaTitleAr: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">CTA Description (EN)</label><textarea className="dash-input dash-ta" value={homeData.ctaDesc} onChange={e => setHomeData(p => ({ ...p, ctaDesc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">وصف الزر (عربي)</label><textarea className="dash-input dash-ta" dir="rtl" value={homeData.ctaDescAr} onChange={e => setHomeData(p => ({ ...p, ctaDescAr: e.target.value }))} /></div>

                    <div className="form-full dash-form-actions">
                      <button className="dash-btn dash-btn-primary" onClick={saveHome}><Save style={{ width: 14, height: 14 }} />{u.save}</button>
                      <button className="dash-btn dash-btn-ghost" onClick={() => setEditHome(false)}>{u.cancel}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Forms Settings ── */}
          {section === 'forms' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.forms}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.formsManage}</p></div>
                <button className="dash-btn dash-btn-primary" onClick={saveFormSettings}><Save style={{ width: 14, height: 14 }} />{u.save}</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="dash-card" style={{ padding: 24 }}>
                  <h3 className="font-bold mb-4 text-[var(--text)]">{lang === 'ar' ? 'نموذج التواصل' : 'Contact Form'}</h3>
                  <div className="space-y-4">
                    <div><label className="dash-label">Title (EN)</label><input className="dash-input" value={formSettings?.contactFormTitle || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormTitle: e.target.value }))} /></div>
                    <div><label className="dash-label">العنوان (عربي)</label><input className="dash-input" dir="rtl" value={formSettings?.contactFormTitleAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormTitleAr: e.target.value }))} /></div>
                    <div><label className="dash-label">Desc (EN)</label><textarea className="dash-input" value={formSettings?.contactFormDesc || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormDesc: e.target.value }))} /></div>
                    <div><label className="dash-label">الوصف (عربي)</label><textarea className="dash-input" dir="rtl" value={formSettings?.contactFormDescAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormDescAr: e.target.value }))} /></div>
                  </div>
                </div>
                <div className="dash-card" style={{ padding: 24 }}>
                  <h3 className="font-bold mb-4 text-[var(--text)]">{lang === 'ar' ? 'نموذج الوظائف' : 'Careers Form'}</h3>
                  <div className="space-y-4">
                    <div><label className="dash-label">Title (EN)</label><input className="dash-input" value={formSettings?.jobFormTitle || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormTitle: e.target.value }))} /></div>
                    <div><label className="dash-label">العنوان (عربي)</label><input className="dash-input" dir="rtl" value={formSettings?.jobFormTitleAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormTitleAr: e.target.value }))} /></div>
                    <div><label className="dash-label">Desc (EN)</label><textarea className="dash-input" value={formSettings?.jobFormDesc || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormDesc: e.target.value }))} /></div>
                    <div><label className="dash-label">الوصف (عربي)</label><textarea className="dash-input" dir="rtl" value={formSettings?.jobFormDescAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormDescAr: e.target.value }))} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Contact Settings ── */}
          {section === 'contact' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.contactSettings || 'Contact Info'}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.contactSettingsManage || 'Manage global contact details'}</p></div>
                <button className="dash-btn dash-btn-primary" onClick={saveContactData}><Save style={{ width: 14, height: 14 }} />{u.save}</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="dash-card" style={{ padding: 24 }}>
                  <h3 className="font-bold mb-4 text-[var(--text)]">{lang === 'ar' ? 'معلومات أساسية' : 'Basic Info'}</h3>
                  <div className="space-y-4">
                    <div><label className="dash-label">{lang === 'ar' ? 'العنوان' : 'Address'}</label><input className="dash-input" value={contactData?.address || ''} onChange={e => setContactData((p: any) => ({ ...p, address: e.target.value }))} /></div>
                    <div><label className="dash-label">{lang === 'ar' ? 'العنوان (عربي)' : 'Address (AR)'}</label><input className="dash-input" dir="rtl" value={contactData?.addressAr || ''} onChange={e => setContactData((p: any) => ({ ...p, addressAr: e.target.value }))} /></div>
                    <div><label className="dash-label">{lang === 'ar' ? 'الهاتف' : 'Phone'}</label><input className="dash-input" value={contactData?.phone || ''} onChange={e => setContactData((p: any) => ({ ...p, phone: e.target.value }))} /></div>
                    <div><label className="dash-label">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label><input className="dash-input" value={contactData?.email || ''} onChange={e => setContactData((p: any) => ({ ...p, email: e.target.value }))} /></div>
                    <div className="pt-2 border-t border-[var(--border)]">
                      <label className="dash-label mb-3">{lang === 'ar' ? 'أيام وساعات العمل' : 'Working Days & Hours'}</label>
                      <div className="flex flex-col gap-4 bg-[var(--surface2)] border border-[var(--border)] p-4 rounded-xl">
                        <div>
                          <label className="text-[11px] font-bold text-[var(--text2)] uppercase tracking-widest mb-2 block">{lang === 'ar' ? 'من يوم - إلى يوم' : 'From - To Day'}</label>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <CustomSelect
                              className="!w-32"
                              value={whForm.startDay.toString()}
                              onChange={val => setWhForm(p => ({ ...p, startDay: parseInt(val) }))}
                              options={(lang === 'ar' ? DAYS_AR : DAYS_EN).map((d, i) => ({ value: i.toString(), label: d }))}
                            />
                            <span className="text-[var(--border)] font-medium hidden sm:block">-</span>
                            <CustomSelect
                              className="!w-32"
                              value={whForm.endDay.toString()}
                              onChange={val => setWhForm(p => ({ ...p, endDay: parseInt(val) }))}
                              options={(lang === 'ar' ? DAYS_AR : DAYS_EN).map((d, i) => ({ value: i.toString(), label: d }))}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[var(--text2)] uppercase tracking-widest mb-2 block">{lang === 'ar' ? 'من ساعة - إلى ساعة' : 'From - To Time'}</label>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <input type="time" className="dash-input !py-2 text-center w-full" value={whForm.startTime} onChange={e => setWhForm(p => ({ ...p, startTime: e.target.value }))} />
                            <span className="text-[var(--border)] font-medium hidden sm:block">-</span>
                            <input type="time" className="dash-input !py-2 text-center w-full" value={whForm.endTime} onChange={e => setWhForm(p => ({ ...p, endTime: e.target.value }))} />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-xs bg-[var(--accent)]/10 p-4 rounded-xl border border-[var(--accent)]/20 flex flex-col gap-2">
                        <p className="text-[var(--accent)] font-medium leading-relaxed" dir="ltr">{contactData.workingHours || buildWorkingHours(whForm).en}</p>
                        <p className="text-[var(--accent)] font-bold leading-relaxed" dir="rtl">{contactData.workingHoursAr || buildWorkingHours(whForm).ar}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="dash-card" style={{ padding: 24 }}>
                    <h3 className="font-bold mb-4 text-[var(--text)]">{lang === 'ar' ? 'التواصل الاجتماعي' : 'Social Media'}</h3>
                    <div className="space-y-4">
                      <div><label className="dash-label">Facebook</label><input className="dash-input" value={contactData?.facebook || ''} onChange={e => setContactData((p: any) => ({ ...p, facebook: e.target.value }))} /></div>
                      <div><label className="dash-label">Twitter / X</label><input className="dash-input" value={contactData?.twitter || ''} onChange={e => setContactData((p: any) => ({ ...p, twitter: e.target.value }))} /></div>
                      <div><label className="dash-label">Instagram</label><input className="dash-input" value={contactData?.instagram || ''} onChange={e => setContactData((p: any) => ({ ...p, instagram: e.target.value }))} /></div>
                      <div><label className="dash-label">LinkedIn</label><input className="dash-input" value={contactData?.linkedin || ''} onChange={e => setContactData((p: any) => ({ ...p, linkedin: e.target.value }))} /></div>
                    </div>
                  </div>

                  <div className="dash-card" style={{ padding: 24 }}>
                    <h3 className="font-bold mb-4 text-[var(--text)]">{lang === 'ar' ? 'نصوص الفوتر' : 'Footer Texts'}</h3>
                    <div className="space-y-4">
                      <div><label className="dash-label">Footer Description (EN)</label><textarea className="dash-input dash-ta" value={contactData?.footerDesc || ''} onChange={e => setContactData((p: any) => ({ ...p, footerDesc: e.target.value }))} /></div>
                      <div><label className="dash-label">وصف الفوتر (عربي)</label><textarea className="dash-input dash-ta" dir="rtl" value={contactData?.footerDescAr || ''} onChange={e => setContactData((p: any) => ({ ...p, footerDescAr: e.target.value }))} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Complaints ── */}
          {section === 'complaints' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MessageSquare style={{ width: 24, height: 24, color: 'var(--accent)' }} />
                    {u.complaints}
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{u.complaintsManage}</p>
                </div>
                <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', flexWrap: 'nowrap', flex: 1, justifyContent: 'flex-end', minWidth: 280 }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface2)', borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', padding: '4px 8px', width: '100%', maxWidth: 450 }}>
                    <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                      <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 12, right: isRTL ? 12 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text2)' }} />
                      <input
                        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', padding: '8px 12px', paddingLeft: isRTL ? 12 : 36, paddingRight: isRTL ? 36 : 12, fontSize: 13, color: 'var(--text)' }}
                        placeholder={u.search}
                        value={complaintsSearch}
                        onChange={e => setComplaintsSearch(e.target.value)}
                      />
                    </div>
                    <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 8px' }}></div>
                    <CustomSelect
                      className="!w-40"
                      value={complaintsFilterType}
                      onChange={val => setComplaintsFilterType(val)}
                      options={[
                        { value: 'All', label: lang === 'ar' ? 'جميع الأنواع' : 'All Types' },
                        ...(translationsRoot?.complaints?.types || []).map((type: string) => ({ value: type, label: type }))
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
                <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
                  {/* ... same thead ... */}
                  <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{lang === 'ar' ? 'رقم الشكوى' : 'ID'}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.senderName}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.phone}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.school}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.messageType}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.message}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.status}</th>
                      <th style={{ padding: '14px 12px', width: 48 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.length > 0 ? filteredComplaints.map((c, i) => (
                      <tr key={i} style={{ borderBottom: i === filteredComplaints.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s ease' }} onClick={() => { setSelectedComplaint(c); setComplaintModalOpen(true); }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px 24px', color: 'var(--accent)', fontWeight: 800, fontSize: 12, fontFamily: 'monospace', cursor: 'pointer' }}>
                          {c.id || '—'}
                        </td>
                        <td style={{ padding: '16px 24px', color: 'var(--text)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                          <p>{c.fullName}</p>
                          <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') : ''}</p>
                        </td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13, cursor: 'pointer' }} dir="ltr">{c.phone}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13, cursor: 'pointer' }}>{c.school}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13, cursor: 'pointer' }}><span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--surface2)', fontSize: 11, fontWeight: 700 }}>{c.messageType}</span></td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13, maxWidth: 300, cursor: 'pointer' }}>
                          <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={c.message}>{c.message}</p>
                          <p style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>{c.email}</p>
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                            background: c.status === 'Responded' ? 'rgba(16,185,129,0.15)' : c.status === 'In Progress' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.12)',
                            color: c.status === 'Responded' ? '#10b981' : c.status === 'In Progress' ? '#f59e0b' : 'var(--accent)',
                          }}>{c.status || 'Pending'}</span>
                        </td>
                        <td style={{ padding: '16px 12px' }} onClick={e => e.stopPropagation()}>
                          <button className="dash-icon-btn" title={lang === 'ar' ? 'حذف' : 'Delete'} onClick={() => deleteComplaint(c.id)}>
                            <Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}>
                          <MessageSquare style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} />
                          <p style={{ fontWeight: 600 }}>{u.noResults}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination current={complaintPage} total={complaintTotalPages} onChange={setComplaintPage} lang={lang} />
            </div>
          )}

          {/* ── Contact Messages ── */}
          {section === 'contactMessages' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.contactMessages}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.contactMessagesManage}</p></div>
              </div>

              <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
                {isTableLoading && (
                  <div className="table-loader">
                    <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
                  </div>
                )}
                <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.senderName}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.email}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.subject}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.message}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.date}</th>
                      <th style={{ padding: '14px 12px', width: 48 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {contactMessages.length > 0 ? contactMessages.map((c, i) => (
                      <tr key={i} style={{ cursor: 'pointer', borderBottom: i === contactMessages.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s ease' }} onClick={() => { setSelectedContact(c); setContactModalOpen(true); }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px 24px', color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{c.fullName}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13 }}>{c.email}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13 }}>{c.subject}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13, maxWidth: 300 }}>
                          <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={c.message}>{c.message}</p>
                        </td>
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 12, fontWeight: 600 }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') : c.date || '—'}</td>
                        <td style={{ padding: '16px 12px' }} onClick={e => e.stopPropagation()}>
                          <button className="dash-icon-btn" title={lang === 'ar' ? 'حذف' : 'Delete'} onClick={() => deleteContactMessage(c.id)}>
                            <Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}>
                          <Mail style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} />
                          <p style={{ fontWeight: 600 }}>{u.noResults}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination current={messagePage} total={messageTotalPages} onChange={setMessagePage} lang={lang} />
            </div>
          )}

          {/* ── Settings ── */}
          {section === 'settings' && (
            <div className="section-enter">
              <div style={{ marginBottom: 20 }}><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.settings}</h2></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 540 }}>
                {/* Language */}
                <div className="dash-card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: 'rgba(79,70,229,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe style={{ width: 18, height: 18, color: 'var(--accent)' }} /></div>
                      <div><p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{u.language}</p><p style={{ fontSize: 12, color: 'var(--text2)' }}>EN / AR</p></div>
                    </div>
                    <div className="toggle-pill">
                      <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
                      <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>عربي</button>
                    </div>
                  </div>
                </div>
                {/* Dark Mode */}
                <div className="dash-card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: 'rgba(139,92,246,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{theme === 'dark' ? <Moon style={{ width: 18, height: 18, color: '#8b5cf6' }} /> : <Sun style={{ width: 18, height: 18, color: '#f59e0b' }} />}</div>
                      <div><p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{u.darkMode}</p><p style={{ fontSize: 12, color: 'var(--text2)' }}>{theme === 'dark' ? 'Dark' : 'Light'}</p></div>
                    </div>
                    <label className="switch"><input type="checkbox" checked={theme === 'dark'} onChange={e => setTheme(e.target.checked ? 'dark' : 'light')} /><span className="slider" /></label>
                  </div>
                </div>
                {/* Admin Profile */}
                <div className="dash-card" style={{ padding: 20 }}>
                  <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Users style={{ width: 16, height: 16, color: 'var(--accent)' }} />{u.adminProfile}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div><label className="dash-label">{u.adminName}</label><input className="dash-input" value={profileDraft.name} onChange={e => setProfileDraft(p => ({ ...p, name: e.target.value }))} /></div>
                    <div><label className="dash-label">{u.adminEmail}</label><input className="dash-input" value={profileDraft.email} onChange={e => setProfileDraft(p => ({ ...p, email: e.target.value }))} /></div>
                    <button className="dash-btn dash-btn-primary" style={{ width: 'fit-content' }} onClick={() => { setProfile(profileDraft); showToast(u.profileSaved); }}>
                      <Save style={{ width: 14, height: 14 }} />{u.save}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Modals ── */}
      {editNewsId && newsList.find(n => String(n.id) === String(editNewsId)) && (() => {
        const a = newsList.find(n => String(n.id) === String(editNewsId))!;
        return <ModalWrap title={`${u.edit || 'Edit'} — ${(a.title || '').slice(0, 30)}`} onClose={() => setEditNewsId(null)}>
          <EditNewsForm article={a} lang={lang} onSave={saveNews} onCancel={() => setEditNewsId(null)} />
        </ModalWrap>;
      })()}

      {addNewsOpen && (
        <ModalWrap title={u.addArticle} onClose={() => setAddNewsOpen(false)}>
          <EditNewsForm article={newArt as DashNewsItem} lang={lang} onSave={addNews} onCancel={() => setAddNewsOpen(false)} />
        </ModalWrap>
      )}

      {editHeroId !== null && hero.find(h => String(h.id) === String(editHeroId)) && (() => {
        const s = hero.find(h => String(h.id) === String(editHeroId))!;
        return <ModalWrap title={`${u.edit || 'Edit'} — ${(u.hero || 'Hero')} ${s.id}`} onClose={() => setEditHeroId(null)}>
          <EditHeroForm slide={s} lang={lang} onSave={saveHero} onCancel={() => setEditHeroId(null)} />
        </ModalWrap>;
      })()}

      {editSchoolId && schools.find(sc => String(sc.id) === String(editSchoolId)) && (() => {
        const s = schools.find(sc => String(sc.id) === String(editSchoolId))!;
        return <ModalWrap title={`${u.edit || 'Edit'} — ${s.name || ''}`} onClose={() => setEditSchoolId(null)}>
          <EditSchoolForm school={s} lang={lang} onSave={saveSchool} onCancel={() => setEditSchoolId(null)} />
        </ModalWrap>;
      })()}

      {addJobOpen && (
        <ModalWrap title={lang === 'ar' ? 'إضافة وظيفة جديدة' : 'Add New Vacancy'} onClose={() => setAddJobOpen(false)}>
          <EditJobForm job={newJob} lang={lang} onSave={addJob} onCancel={() => setAddJobOpen(false)} />
        </ModalWrap>
      )}

      {addSchoolOpen && (
        <ModalWrap title={lang === 'ar' ? 'إضافة مدرسة جديدة' : 'Add New School'} onClose={() => setAddSchoolOpen(false)}>
          <EditSchoolForm school={newSchool} lang={lang} onSave={addSchool} onCancel={() => setAddSchoolOpen(false)} />
        </ModalWrap>
      )}

      {editJobId && jobs.find(j => String(j.id) === String(editJobId)) && (() => {
        const j = jobs.find(j => String(j.id) === String(editJobId))!;
        return <ModalWrap title={lang === 'ar' ? 'تعديل الوظيفة' : 'Edit Vacancy'} onClose={() => setEditJobId(null)}>
          <EditJobForm job={j} lang={lang} onSave={saveJob} onCancel={() => setEditJobId(null)} />
        </ModalWrap>;
      })()}

      {addDepartmentOpen && (
        <ModalWrap title={lang === 'ar' ? 'إضافة قسم جديد' : 'Add New Department'} onClose={() => setAddDepartmentOpen(false)}>
          <div className="form-grid">
            <div className="form-col">
              <label className="dash-label">Department Name (EN)</label>
              <input className="dash-input" value={newDepartment.nameEn} onChange={e => setNewDepartment(p => ({ ...p, nameEn: e.target.value }))} />
            </div>
            <div className="form-col">
              <label className="dash-label">اسم القسم (AR)</label>
              <input className="dash-input" dir="rtl" value={newDepartment.nameAr} onChange={e => setNewDepartment(p => ({ ...p, nameAr: e.target.value }))} />
            </div>
            <div className="form-full dash-form-actions">
              <button className="dash-btn dash-btn-primary" onClick={addDepartment}><Save className="w-4 h-4" />{u.save}</button>
              <button className="dash-btn dash-btn-ghost" onClick={() => setAddDepartmentOpen(false)}>{u.cancel}</button>
            </div>
          </div>
        </ModalWrap>
      )}

      {/* complaint detail modal */}
      {complaintModalOpen && selectedComplaint && (
        <ModalWrap title={lang === 'ar' ? 'تفاصيل الشكوى' : 'Complaint Details'} onClose={() => setComplaintModalOpen(false)}>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <p><strong>{u.senderName}:</strong> {selectedComplaint.fullName}</p>
            <p><strong>{u.phone}:</strong> {selectedComplaint.phone}</p>
            <p><strong>{u.school}:</strong> {selectedComplaint.school}</p>
            <p><strong>{u.messageType}:</strong> {selectedComplaint.messageType}</p>
            <p><strong>{u.message}:</strong></p>
            <p>{selectedComplaint.message}</p>
            <div>
              <label className="dash-label">{u.status}</label>
              <CustomSelect
                value={selectedComplaint.status || 'Pending'}
                onChange={val => setSelectedComplaint(c => c ? { ...c, status: val } : null)}
                options={['Pending', 'In Progress', 'Responded'].map(st => ({
                  value: st,
                  label: u[st.toLowerCase().replace(/ /g, '') as keyof typeof u] || st
                }))}
              />
            </div>
            <div>
              <label className="dash-label">{lang === 'ar' ? 'رد الإدارة' : 'Admin Response'}</label>
              <textarea
                className="dash-input dash-ta"
                value={selectedComplaint.response || ''}
                onChange={e => setSelectedComplaint(c => c ? { ...c, response: e.target.value } : null)}
                placeholder={lang === 'ar' ? 'اكتب الرد هنا...' : 'Write response here...'}
              />
            </div>
            <div className="dash-form-actions">
              <button className="dash-btn dash-btn-primary" onClick={async () => {
                if (!selectedComplaint) return;
                try {
                  const res = await updateComplaint(
                    selectedComplaint.id,
                    selectedComplaint.status,
                    selectedComplaint.response || ''
                  );
                  if (res.status === 'success') {
                    showToast(lang === 'ar' ? 'تم تحديث الشكوى بنجاح' : 'Complaint updated successfully');
                    fetchComplaints(); // Refetch paginated data
                    setComplaintModalOpen(false);
                  }
                } catch (err) {
                  showToast(lang === 'ar' ? 'فشل التحديث' : 'Update failed', 'error');
                }
              }}>{u.save}</button>
              <button className="dash-btn dash-btn-ghost" onClick={() => setComplaintModalOpen(false)}>{u.close || u.cancel}</button>
            </div>
          </div>
        </ModalWrap>
      )}

      {/* contact message detail modal */}
      {contactModalOpen && selectedContact && (
        <ModalWrap title={lang === 'ar' ? 'تفاصيل الرسالة' : 'Message Details'} onClose={() => setContactModalOpen(false)}>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <p><strong>{u.senderName}:</strong> {selectedContact.fullName}</p>
            <p><strong>{u.email}:</strong> {selectedContact.email}</p>
            <p><strong>{u.subject}:</strong> {selectedContact.subject}</p>
            <p><strong>{u.date}:</strong> {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB') : selectedContact.date || '—'}</p>
            <p><strong>{u.message}:</strong></p>
            <p>{selectedContact.message}</p>
            <div className="flex gap-2 mt-4">
              <button className="dash-btn dash-btn-ghost" onClick={() => window.print()}>{u.print}</button>
              <button className="dash-btn dash-btn-ghost" onClick={() => setContactModalOpen(false)}>{u.close || u.cancel}</button>
            </div>
          </div>
        </ModalWrap>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <ModalWrap title={lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'} onClose={() => setConfirmAction(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '15px', color: 'var(--text)', fontWeight: 500 }}>
              {confirmAction.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button
                className="dash-btn dash-btn-ghost"
                onClick={() => setConfirmAction(null)}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                className="dash-btn dash-btn-danger"
                onClick={() => {
                  confirmAction.onConfirm();
                  setConfirmAction(null);
                }}
              >
                {u.delete || (lang === 'ar' ? 'حذف' : 'Delete')}
              </button>
            </div>
          </div>
        </ModalWrap>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.type === 'success' ? <CheckCircle style={{ width: 16, height: 16 }} /> : <AlertCircle style={{ width: 16, height: 16 }} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
