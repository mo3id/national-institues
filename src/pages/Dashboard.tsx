import React, { useState, useEffect, useMemo } from 'react';
import {
  getPaginatedEntries, updateComplaint, updateJobApplication, updateAdmission, getAdmissionDetail, getJobApplicationDetails, getDashboardStats, deleteEntry,
  saveNews as apiSaveNews, deleteNews as apiDeleteNews,
  saveSchool as apiSaveSchool, deleteSchool as apiDeleteSchool,
  saveJob as apiSaveJob, deleteJob as apiDeleteJob,
  saveGovernorate, deleteGovernorate as apiDeleteGovernorate,
  saveAlumni as apiSaveAlumni, deleteAlumni as apiDeleteAlumni
} from '@/services/api';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';
import School from 'lucide-react/dist/esm/icons/school';
import Image from 'lucide-react/dist/esm/icons/image';
import Info from 'lucide-react/dist/esm/icons/info';
import Settings from 'lucide-react/dist/esm/icons/settings';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Edit3 from 'lucide-react/dist/esm/icons/edit-3';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Eye from 'lucide-react/dist/esm/icons/eye';
import EyeOff from 'lucide-react/dist/esm/icons/eye-off';
import Save from 'lucide-react/dist/esm/icons/save';
import X from 'lucide-react/dist/esm/icons/x';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import Users from 'lucide-react/dist/esm/icons/users';
import HomeIcon from 'lucide-react/dist/esm/icons/home';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Bell from 'lucide-react/dist/esm/icons/bell';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import Search from 'lucide-react/dist/esm/icons/search';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import Menu from 'lucide-react/dist/esm/icons/menu';
import Moon from 'lucide-react/dist/esm/icons/moon';
import Sun from 'lucide-react/dist/esm/icons/sun';
import Globe from 'lucide-react/dist/esm/icons/globe';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Filter from 'lucide-react/dist/esm/icons/filter';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Phone from 'lucide-react/dist/esm/icons/phone';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronsLeft from 'lucide-react/dist/esm/icons/chevrons-left';
import ChevronsRight from 'lucide-react/dist/esm/icons/chevrons-right';
import { NEWS, SCHOOLS } from '@/constants';
import {
  Section, Theme, Lang, DashNewsItem, DashSchool, DashJob, DashJobApplication, DashAdmission, DashAlumni, HeroSlide, AboutData, AdminProfile,
  UI, HERO_IMAGES
} from './dashboard-components/types';
import { ModalWrap, EditNewsForm, EditHeroForm, EditSchoolForm, EditJobForm, EditAlumniForm } from './dashboard-components/Modals';
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
  values: [],
  storyImage: '/layer-1-small.webp'
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


const formatTimeString = (time24: string, isAr: boolean) => {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampmEn = h >= 12 ? 'PM' : 'AM';
  const ampmAr = h >= 12 ? 'مساءً' : 'صباحاً';
  h = h % 12 || 12;
  const hDisplay = h.toString();
  const mDisplay = m.toString().padStart(2, '0');

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
  const u = UI[lang as Lang];
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
        title={u.firstPage}
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
        {u.page}
        <span>{current} / {total}</span>
      </div>

      <div className="flex items-center gap-1.5">
        {start > 1 && <span className="text-[var(--text2)] px-1">...</span>}
        {pages.map(p => (
          <button
            key={p}
            className={`pagination-btn ${current === p ? 'active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
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
        title={u.lastPage}
      >
        <ChevronsRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

// ─── Admission Detail Modal ────────────────────────────────────────────────────
const AdmissionModal: React.FC<{
  admission: any;
  lang: string;
  isRTL: boolean;
  u: Record<string, string>;
  schools: any[];
  onClose: () => void;
  onUpdate: (id: string, status: string, acceptedSchool: string, adminNotes: string) => Promise<void>;
}> = ({ admission, lang, isRTL, u, schools, onClose, onUpdate }) => {
  const [status, setStatus] = useState(admission.status || 'Pending');
  const [acceptedSchool, setAcceptedSchool] = useState(admission.acceptedSchool || '');
  const [adminNotes, setAdminNotes] = useState(admission.adminNotes || '');
  const [saving, setSaving] = useState(false);
  const [documents, setDocuments] = useState<{ name: string; fileName: string; path: string }[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getAdmissionDetail(admission.id);
        if (!cancelled && res.data?.documents) setDocuments(res.data.documents);
      } catch {}
      if (!cancelled) setLoadingDocs(false);
    })();
    return () => { cancelled = true; };
  }, [admission.id]);

  const statusColors: Record<string, { bg: string; color: string }> = {
    'Pending':      { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
    'Under Review': { bg: 'rgba(99,102,241,0.12)',  color: '#6366f1' },
    'Accepted':     { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
    'Waitlist':     { bg: 'rgba(251,146,60,0.12)',  color: '#fb923c' },
    'Rejected':     { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
  };
  const sc = statusColors[status] || statusColors['Pending'];

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(admission.id, status, acceptedSchool, adminNotes);
    setSaving(false);
  };

  return (
    <ModalWrap title={u.requestDetails} onClose={onClose}>
      <div style={{ width: '100%', maxWidth: 680 }} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'monospace', fontWeight: 700, marginBottom: 4 }}>{admission.id}</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.requestDetails}</h3>
          </div>
          <span style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: sc.bg, color: sc.color }}>{status}</span>
        </div>

        {/* Student & Parent Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { label: u.studentName,       value: admission.studentName },
            { label: u.studentDOB,        value: admission.studentDOB },
            { label: u.studentNationalId, value: admission.studentNationalId },
            { label: u.gradeStage,        value: `${admission.gradeStage} — ${admission.gradeClass}` },
            { label: u.parentName,        value: admission.parentName },
            { label: u.parentPhone,       value: admission.parentPhone },
            { label: u.parentEmail,       value: admission.parentEmail },
            { label: u.date,              value: admission.createdAt ? new Date(admission.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
          ].map(row => (
            <div key={row.label} style={{ background: 'var(--surface2)', borderRadius: 12, padding: '10px 14px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{row.label}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{row.value || '—'}</p>
            </div>
          ))}
        </div>

        {/* Preferences */}
        {(admission.preferences || []).length > 0 && (
          <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{u.preferences}</p>
            <ol style={{ margin: 0, paddingInlineStart: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(admission.preferences || []).map((p: any, i: number) => (
                <li key={i} style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? 'var(--text)' : 'var(--text2)' }}>
                  {lang === 'ar' ? (p.schoolNameAr || p.schoolName) : p.schoolName}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Documents */}
        <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{u.documents}</p>
          {loadingDocs ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
              <div style={{ width: 16, height: 16, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
            </div>
          ) : documents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {documents.map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{doc.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text2)' }}>{doc.fileName}</p>
                  </div>
                  {doc.path ? (
                    <a href={doc.path} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', padding: '4px 10px', borderRadius: 6, background: 'rgba(99,102,241,0.08)' }}>
                      {lang === 'ar' ? 'عرض' : 'View'}
                    </a>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--text2)', fontStyle: 'italic' }}>{lang === 'ar' ? 'غير متوفر' : 'N/A'}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: 'var(--text2)', fontStyle: 'italic' }}>{u.noDocuments}</p>
          )}
        </div>

        {/* Notes from applicant */}
        {admission.notes && (
          <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{u.notes}</p>
            <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{admission.notes}</p>
          </div>
        )}

        {/* Update Status */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{u.changeStatus}</p>
          <CustomSelect
            value={status}
            onChange={val => { setStatus(val); if (val !== 'Accepted') setAcceptedSchool(''); }}
            options={[
              { value: 'Pending',      label: u.pending },
              { value: 'Under Review', label: u.underReview },
              { value: 'Accepted',     label: u.accepted },
              { value: 'Waitlist',     label: u.waitlist },
              { value: 'Rejected',     label: u.rejected },
            ]}
          />

          {status === 'Accepted' && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>{u.acceptedSchool}</p>
              <CustomSelect
                value={acceptedSchool}
                onChange={setAcceptedSchool}
                options={[
                  { value: '', label: lang === 'ar' ? 'اختر مدرسة...' : 'Select school...' },
                  ...(admission.preferences || []).map((p: any) => ({
                    value: lang === 'ar' ? (p.schoolNameAr || p.schoolName) : p.schoolName,
                    label: lang === 'ar' ? (p.schoolNameAr || p.schoolName) : p.schoolName,
                  }))
                ]}
              />
            </div>
          )}

          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>{u.adminNotes}</p>
            <textarea
              className="dash-input"
              style={{ width: '100%', minHeight: 80, resize: 'vertical', fontSize: 13 }}
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder={u.writeResponse}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
            <button className="dash-btn dash-btn-ghost" onClick={onClose}>{u.cancel}</button>
            <button className="dash-btn dash-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <div style={{ width: 14, height: 14, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" /> : <Save style={{ width: 14, height: 14 }} />}
              {u.save}
            </button>
          </div>
        </div>
      </div>
    </ModalWrap>
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
  const [alumniList, setAlumniList] = useState<DashAlumni[]>([]);
  const [departments, setDepartments] = useState<{ id: string, nameEn: string, nameAr: string }[]>([]);
  const [governorates, setGovernorates] = useState<{ id: string, name: string, nameAr: string }[]>([]);
  const [applications, setApplications] = useState<DashJobApplication[]>([]);
  const [hero, setHero] = useState<HeroSlide[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [admissionsList, setAdmissionsList] = useState<DashAdmission[]>([]);
  const [admissionsPage, setAdmissionsPage] = useState(1);
  const [admissionsTotalPages, setAdmissionsTotalPages] = useState(1);
  const [selectedAdmission, setSelectedAdmission] = useState<DashAdmission | null>(null);
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [admissionsSearch, setAdmissionsSearch] = useState('');
  const [admissionsFilterStatus, setAdmissionsFilterStatus] = useState('All');
  const [admissionSettings, setAdmissionSettings] = useState(siteData.admissionSettings);
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
      setGovernorates(siteData.governorates || []);
    }
  }, [siteData]);

  const [profile, setProfile] = useState<AdminProfile>({ name: 'Admin', email: 'admin@nis.edu.eg' });
  const [editNewsId, setEditNewsId] = useState<string | null>(null);
  const [addNewsOpen, setAddNewsOpen] = useState(false);
  const [editHeroId, setEditHeroId] = useState<number | null>(null);
  const [addHeroOpen, setAddHeroOpen] = useState(false);
  const [editSchoolId, setEditSchoolId] = useState<string | null>(null);
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [addAlumniOpen, setAddAlumniOpen] = useState(false);
  const [editAlumniId, setEditAlumniId] = useState<string | null>(null);
  const [newAlumni, setNewAlumni] = useState<Partial<DashAlumni>>({ name: '', nameAr: '', image: '', school: '', schoolAr: '', graduationYear: '', degree: '', degreeAr: '', jobTitle: '', jobTitleAr: '', company: '', companyAr: '', testimonial: '', testimonialAr: '', linkedin: '', twitter: '', featured: false });
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ nameEn: '', nameAr: '' });
  const [addGovernorateOpen, setAddGovernorateOpen] = useState(false);
  const [newGovernorate, setNewGovernorate] = useState({ name: '', nameAr: '' });
  const [selectedRecruitmentJobId, setSelectedRecruitmentJobId] = useState<string | null>('All');
  const [selectedApplicant, setSelectedApplicant] = useState<DashJobApplication | null>(null);
  const [applicantModalOpen, setApplicantModalOpen] = useState(false);
  const [cvBlobUrl, setCvBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedApplicant?.cvData) {
      try {
        const parts = selectedApplicant.cvData.split(',');
        if (parts.length > 1) {
          const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
          const bstr = atob(parts[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) u8arr[n] = bstr.charCodeAt(n);
          const blob = new Blob([u8arr], { type: mime });
          const url = URL.createObjectURL(blob);
          setCvBlobUrl(url);
          return () => URL.revokeObjectURL(url);
        }
      } catch (e) {
        console.error("PDF Preview Error:", e);
      }
    }
    setCvBlobUrl(null);
  }, [selectedApplicant]);

  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editAbout, setEditAbout] = useState(false);
  const [editHome, setEditHome] = useState(false);
  const [newsSearch, setNewsSearch] = useState('');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');
  const [alumniSearch, setAlumniSearch] = useState('');
  const [complaintsSearch, setComplaintsSearch] = useState('');
  const [complaintsFilterType, setComplaintsFilterType] = useState('All');
  const [complaintsFilterSchool, setComplaintsFilterSchool] = useState('');
  const [complaintsFilterGov, setComplaintsFilterGov] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [newArt, setNewArt] = useState<Partial<DashNewsItem>>({ title: '', titleAr: '', summary: '', summaryAr: '', date: '', image: '', published: true });
  const [newJob, setNewJob] = useState<Partial<DashJob>>({ title: '', titleAr: '', department: '', departmentAr: '', location: '', locationAr: '', type: '', typeAr: '', description: '', descriptionAr: '', image: '' });
  const [profileDraft, setProfileDraft] = useState({ ...profile });
  const [addSchoolOpen, setAddSchoolOpen] = useState(false);
  const [newSchool, setNewSchool] = useState<Partial<DashSchool>>({ name: '', location: '', governorate: '', principal: '', logo: '', type: [], mainImage: '', gallery: [], about: '', aboutAr: '', phone: '', email: '', website: '', rating: '', studentCount: '', teachersCount: '', foundedYear: '', address: '', addressAr: '', applicationLink: '' });
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
  const [dashStats, setDashStats] = useState({ totalNews: 0, publishedNews: 0, schoolsCount: 0, totalStudents: 0, totalTeachers: 0 });

  const debouncedComplaintSearch = useDebounce(complaintsSearch, 500);
  const debouncedSchoolSearch = useDebounce(schoolSearch, 500);
  const debouncedNewsSearch = useDebounce(newsSearch, 500);
  const debouncedJobSearch = useDebounce(jobSearch, 500);
  const debouncedAlumniSearch = useDebounce(alumniSearch, 500);

  const u = UI[lang];
  const isRTL = lang === 'ar';

  const getMessageTypeLabel = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('شكوى') || t.includes('complaint')) return u.complaint;
    if (t.includes('اقتراح') || t.includes('suggestion')) return u.suggestion;
    if (t.includes('استفسار') || t.includes('inquiry')) return u.inquiry;
    if (t.includes('شكر') || t.includes('thanks')) return u.thanks;
    return type;
  };

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
    if (['complaints', 'contactMessages', 'recruitment', 'news', 'admissionApplications'].includes(section)) {
      interval = setInterval(() => {
        if (section === 'complaints') fetchComplaints();
        if (section === 'contactMessages') fetchMessages();
        if (section === 'recruitment') fetchApplicants();
        if (section === 'news') fetchNews();
        if (section === 'admissionApplications') fetchAdmissions();
      }, 30000); // 30 seconds polling
    }
    return () => { if (interval) clearInterval(interval); };
  }, [section, complaintPage, messagePage, applicantPage, newsPage, debouncedComplaintSearch, debouncedNewsSearch, complaintsFilterType, complaintsFilterSchool, complaintsFilterGov, selectedRecruitmentJobId]);

  useEffect(() => {
    if (section === 'complaints') fetchComplaints();
  }, [section, complaintPage, debouncedComplaintSearch, complaintsFilterType, complaintsFilterSchool, complaintsFilterGov]);

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
    if (section === 'alumni') fetchAlumni();
  }, [section, debouncedAlumniSearch]);

  useEffect(() => {
    if (section === 'jobs') fetchJobs();
  }, [section, debouncedJobSearch]);

  useEffect(() => {
    if (section === 'departments' || section === 'recruitment' || section === 'jobs') fetchDepartments();
  }, [section]);

  useEffect(() => {
    if (section === 'governorates') fetchGovernorates();
  }, [section]);

  useEffect(() => {
    if (section === 'admissionApplications') fetchAdmissions();
  }, [section, admissionsPage, admissionsSearch, admissionsFilterStatus]);

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
      const res = await getPaginatedEntries({ type: 'complaints', page: complaintPage, limit: 12, search: debouncedComplaintSearch, filterType: complaintsFilterType, filterSchool: complaintsFilterSchool, filterGov: complaintsFilterGov });
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

  const fetchAlumni = async () => {
    setIsTableLoading(true);
    try {
      const res = await getPaginatedEntries({ type: 'alumni', page: 1, limit: 100, search: debouncedAlumniSearch });
      if (res.status === 'success') {
        setAlumniList(res.data.items);
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
        showToast(u.saveFailed.replace('{message}', message), 'error');
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
    const item = newsList.find(n => n.id === id);
    const title = lang === 'ar' ? (item?.titleAr || item?.title) : (item?.title || item?.titleAr);
    setConfirmAction({
      message: u.deleteConfirm.replace('{type}', title || (lang === 'ar' ? 'هذا الخبر' : 'this news article')),
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
    showToast(u.slideSaved || 'Hero slide saved');
  };

  const addHeroSlide = (s: HeroSlide) => {
    const newSlide = { ...s, id: Date.now() }; // ensure unique ID
    const updated = [...hero, newSlide];
    setHero(updated);
    updateData('heroSlides', updated);
    setAddHeroOpen(false);
    showToast(u.slideSaved || 'Hero slide added');
  };

  const deleteHeroSlide = (id: number) => {
    setConfirmAction({
      message: u.deleteConfirm?.replace('{type}', lang === 'ar' ? 'هذه الشريحة' : 'this slide') || 'Are you sure you want to delete this slide?',
      onConfirm: async () => {
        const updated = hero.filter(h => h.id !== id);
        setHero(updated);
        updateData('heroSlides', updated);
        showToast(u.deletedSuccess || 'Slide deleted', 'error');
      }
    });
  };

  const normalizeSchoolType = (type: DashSchool['type']): string[] => {
    const allowed = new Set(['Arabic', 'Languages', 'American', 'British', 'French']);
    const toArray = (t: any): string[] => {
      if (Array.isArray(t)) return t;
      if (typeof t === 'string' && t.trim()) {
        const trimmed = t.trim();
        if (trimmed.startsWith('[')) {
          try {
            const parsed = JSON.parse(trimmed);
            return Array.isArray(parsed) ? parsed : [String(parsed)];
          } catch {
            return [trimmed];
          }
        }
        return trimmed.split(',').map(x => x.trim()).filter(Boolean);
      }
      return [];
    };

    const mapped = toArray(type).map((v) => {
      if (v === 'National') return 'Arabic';
      if (v === 'Language') return 'Languages';
      if (v === 'International') return 'American';
      return v;
    });

    return Array.from(new Set(mapped)).filter(v => allowed.has(v));
  };

  const normalizeSchoolPayload = (s: DashSchool): DashSchool => ({
    ...s,
    type: normalizeSchoolType(s.type),
    gallery: (s.gallery || []).filter(Boolean),
  });

  const saveSchool = async (s: DashSchool) => {
    const normalized = normalizeSchoolPayload(s);
    // Optimistic Update
    setSchools(prev => prev.map(sc => sc.id === normalized.id ? normalized : sc));
    setEditSchoolId(null);

    await apiSaveSchool(normalized);
    showToast(u.schoolSaved);
    fetchSchools();
  };
  const addSchool = async (s: DashSchool) => {
    const newEntry = normalizeSchoolPayload({ ...s, id: String(Date.now()) });

    // Optimistic Update
    setSchools(prev => [newEntry, ...prev]);
    setAddSchoolOpen(false);
    setNewSchool({ name: '', location: '', governorate: '', principal: '', logo: '', type: [], mainImage: '', gallery: [], about: '', aboutAr: '', phone: '', email: '', website: '', rating: '', studentCount: '', teachersCount: '', foundedYear: '', address: '', addressAr: '', applicationLink: '' });
    showToast(u.schoolSaved);

    await apiSaveSchool(newEntry);
    fetchSchools();
  };
  const deleteSchool = (id: string) => {
    const item = schools.find(s => s.id === id);
    const name = lang === 'ar' ? (item?.nameAr || item?.name) : (item?.name || item?.nameAr);
    setConfirmAction({
      message: u.deleteConfirm.replace('{type}', name || (lang === 'ar' ? 'هذه المدرسة' : 'this school')),
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
    const item = jobs.find(j => j.id === id);
    const title = lang === 'ar' ? (item?.titleAr || item?.title) : (item?.title || item?.titleAr);
    setConfirmAction({
      message: u.deleteConfirm.replace('{type}', title || (lang === 'ar' ? 'هذه الوظيفة' : 'this job')),
      onConfirm: async () => {
        // Optimistic Update
        setJobs(prev => prev.filter(jb => jb.id !== id));

        await apiDeleteJob(id);
        showToast(u.jobDeleted, 'error');
        fetchJobs();
      }
    });
  };

  const saveAlumni = async (a: DashAlumni) => {
    setAlumniList(prev => prev.map(al => al.id === a.id ? a : al));
    setEditAlumniId(null);

    await apiSaveAlumni(a);
    showToast(u.alumniSaved);
    fetchAlumni();
  };

  const addAlumni = async (a: DashAlumni) => {
    const newEntry: DashAlumni = {
      ...a,
      id: String(Date.now()),
    };

    setAlumniList(prev => [newEntry, ...prev]);
    setNewAlumni({ name: '', nameAr: '', image: '', school: '', schoolAr: '', graduationYear: '', degree: '', degreeAr: '', jobTitle: '', jobTitleAr: '', company: '', companyAr: '', testimonial: '', testimonialAr: '', linkedin: '', twitter: '', featured: false });
    setAddAlumniOpen(false);
    showToast(u.alumniAdded);

    await apiSaveAlumni(newEntry);
    fetchAlumni();
  };

  const deleteAlumni = (id: string) => {
    const item = alumniList.find(a => a.id === id);
    const name = lang === 'ar' ? (item?.nameAr || item?.name) : (item?.name || item?.nameAr);
    setConfirmAction({
      message: u.deleteConfirm.replace('{type}', name || (lang === 'ar' ? 'هذا الخريج' : 'this alumni')),
      onConfirm: async () => {
        setAlumniList(prev => prev.filter(a => a.id !== id));

        await apiDeleteAlumni(id);
        showToast(u.alumniDeleted, 'error');
        fetchAlumni();
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
    if (!newDepartment.nameEn || !newDepartment.nameAr) return showToast(u.enterDeptBoth, 'error');
    const newEntry = { id: String(Date.now()), nameEn: newDepartment.nameEn, nameAr: newDepartment.nameAr };
    const updated = [newEntry, ...departments];
    setDepartments(updated);
    await updateData('jobDepartments', updated);
    setAddDepartmentOpen(false);
    setNewDepartment({ nameEn: '', nameAr: '' });
    showToast(u.deptAdded);
    fetchDepartments();
  };

  const deleteDepartment = (id: string) => {
    const dep = departments.find(d => d.id === id);
    if (!dep) return;
    const isUsed = jobs.some(j => j.department === dep.nameEn || j.departmentAr === dep.nameAr);
    if (isUsed) {
      showToast(u.cantDeleteDept, 'error');
      return;
    }
    setConfirmAction({
      message: u.deleteConfirm.replace('{type}', lang === 'ar' ? 'هذا القسم' : 'this department').replace('? This cannot be undone.', '?'),
      onConfirm: async () => {
        const updated = departments.filter(d => d.id !== id);
        setDepartments(updated);
        await updateData('jobDepartments', updated);
        showToast(u.deletedSuccess, 'error');
        fetchDepartments();
      }
    });
  };

  const addGovernorate = async () => {
    if (!newGovernorate.name || !newGovernorate.nameAr) return showToast(u.enterGovBoth, 'error');
    const newEntry = { id: String(Date.now()), name: newGovernorate.name, nameAr: newGovernorate.nameAr };
    try {
      await saveGovernorate(newEntry);
      setAddGovernorateOpen(false);
      setNewGovernorate({ name: '', nameAr: '' });
      showToast(u.govAdded);
      fetchGovernorates();
    } catch (error) {
      showToast(u.errAddingGov, 'error');
    }
  };

  const handleDeleteGovernorate = (id: string) => {
    const gov = governorates.find(g => g.id === id);
    if (!gov) return;
    const isUsed = schools.some(s => s.governorate === gov.name || s.governorateAr === gov.nameAr);
    if (isUsed) {
      showToast(u.cantDeleteGov, 'error');
      return;
    }
    setConfirmAction({
      message: u.deleteConfirm.replace('{type}', lang === 'ar' ? 'هذه المحافظة' : 'this governorate').replace('? This cannot be undone.', '?'),
      onConfirm: async () => {
        try {
          await apiDeleteGovernorate(id);
          showToast(u.deletedSuccess, 'error');
          fetchGovernorates();
        } catch (error) {
          showToast(u.errDeletingGov, 'error');
        }
      }
    });
  };

  const fetchGovernorates = () => {
    setGovernorates(siteData.governorates || []);
  };

  const fetchAdmissions = async () => {
    setIsTableLoading(true);
    try {
      const res = await getPaginatedEntries({ type: 'admissions', page: admissionsPage, limit: 12, search: admissionsSearch, filterType: admissionsFilterStatus });
      if (res.status === 'success') {
        setAdmissionsList(res.data.items);
        setAdmissionsTotalPages(res.data.totalPages);
      }
    } catch (err) { console.error(err); }
    finally { setIsTableLoading(false); }
  };

  const deleteComplaint = (item: any) => {
    const id = item.id;
    const typeLabel = getMessageTypeLabel(item.messageType);
    setConfirmAction({
      message: u.deleteConfirm.replace('{type}', typeLabel),
      onConfirm: async () => {
        try {
          await deleteEntry('complaints', id);
          showToast(u.deleteSuccess.replace('{type}', typeLabel), 'error');
          fetchComplaints();
        } catch (err) {
          showToast(u.deleteFailed, 'error');
        }
      }
    });
  };

  const deleteContactMessage = (id: string) => {
    setConfirmAction({
      message: u.confirmDeleteMessage,
      onConfirm: async () => {
        try {
          await deleteEntry('contactMessages', id);
          showToast(u.messageDeleted, 'error');
          fetchMessages();
        } catch {
          showToast(u.deleteFailed, 'error');
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
  const filteredAlumni = alumniList;

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
    { id: 'governorates', label: u.governorates, icon: MapPin },
    { id: 'news', label: u.news, icon: Newspaper },
    { id: 'recruitment', label: u.recruitmentPortal, icon: Briefcase },
    { id: 'departments', label: u.jobDepartments, icon: LayoutDashboard },
    { id: 'jobs', label: u.jobs, icon: Briefcase },
    { id: 'admissionSettings', label: u.admissionSettings, icon: Settings },
    { id: 'admissionApplications', label: u.admissionApplications, icon: GraduationCap },
    { id: 'modifications', label: u.modifications || 'Modification Requests', icon: Edit3 },
    { id: 'alumni', label: u.alumni, icon: GraduationCap },
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
      showToast(u.invalidEmail, 'error');
      return;
    }

    // Check URLs
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (contactData.facebook && !urlPattern.test(contactData.facebook)) {
      showToast(u.invalidFacebook, 'error'); return;
    }
    if (contactData.twitter && !urlPattern.test(contactData.twitter)) {
      showToast(u.invalidTwitter, 'error'); return;
    }
    if (contactData.instagram && !urlPattern.test(contactData.instagram)) {
      showToast(u.invalidInstagram, 'error'); return;
    }
    if (contactData.linkedin && !urlPattern.test(contactData.linkedin)) {
      showToast(u.invalidLinkedIn, 'error'); return;
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
              <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', lineHeight: 1.2 }}>
                {section === 'departments' ? u.jobDepartments : (section === 'governorates' ? u.governorates : (u[section as keyof typeof u] as string))}
              </p>
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
                <p style={{ fontSize: 11, color: 'var(--text2)' }}>{u.superAdmin}</p>
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
                  { icon: Newspaper, label: u.totalArticles, val: (dashStats.totalNews || 0).toString(), color: '#4f46e5', bg: 'rgba(79,70,229,0.1)' },
                  { icon: CheckCircle, label: u.publishedCount, val: (dashStats.publishedNews || 0).toString(), color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                  { icon: School, label: u.schoolsCount, val: (dashStats.schoolsCount || 0).toString(), color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
                  { icon: Users, label: u.totalTeachers, val: (dashStats.totalTeachers || 0).toString(), color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
                  { icon: Users, label: u.studentsCount, val: (dashStats.totalStudents || 0).toString(), color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                ].map(({ icon: Icon, label, val, color, bg }) => (
                  <div key={label} className="stat-card">
                    <div className="stat-icon" style={{ background: bg }}><Icon style={{ width: 22, height: 22, color }} /></div>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>{label}</p>
                      <p style={{ fontSize: 26, fontWeight: 900, color: 'var(--text)', lineHeight: 1.1 }}>{val}</p>
                      <p style={{ fontSize: 11, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}><TrendingUp style={{ width: 12, height: 12 }} />{u.thisYear}</p>
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
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{lang === 'ar' ? (n.titleAr || n.title) : n.title}</p>
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
                        {lang === 'ar' ? (n.titleAr || n.title) : n.title}
                        {n.featured && <span style={{ fontSize: '10px', background: '#eab308', color: 'white', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', fontWeight: 'bold' }}>⭐ {u.featured}</span>}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{lang === 'ar' ? (n.summaryAr || n.summary) : n.summary}</p>
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
                        <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{lang === 'ar' ? (s.nameAr || s.name) : s.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}><MapPin style={{ width: 11, height: 11 }} />{lang === 'ar' ? (s.locationAr || s.location) : s.location}{s.governorate ? `, ${lang === 'ar' ? (s.governorateAr || s.governorate) : s.governorate}` : ''}</p>
                        <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {(Array.isArray(s.type) ? s.type : []).map((t: string) => {
                            const typeMap: Record<string, string> = {
                              'Arabic': 'عربي/قومي',
                              'Languages': 'لغات',
                              'American': 'أمريكي',
                              'British': 'بريطاني',
                              'French': 'فرنسي'
                            };
                            return (
                              <span key={t} style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(79,70,229,0.1)', color: 'var(--accent)' }}>
                                {lang === 'ar' ? (typeMap[t] || t) : t}
                              </span>
                            );
                          })}
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

          {/* ── Alumni ── */}
          {section === 'alumni' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.alumni}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.alumniManage}</p></div>
                <button className="dash-btn dash-btn-primary" onClick={() => setAddAlumniOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.addAlumni}</button>
              </div>
              <div style={{ position: 'relative', marginBottom: 18, maxWidth: 320 }}>
                <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 14, right: isRTL ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text2)' }} />
                <input className="dash-input" style={{ paddingLeft: isRTL ? 14 : 40, paddingRight: isRTL ? 40 : 14 }} placeholder={u.search} value={alumniSearch} onChange={e => setAlumniSearch(e.target.value)} />
              </div>
              <div style={{ position: 'relative' }}>
                {isTableLoading && (
                  <div className="table-loader" style={{ borderRadius: 24 }}>
                    <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
                  </div>
                )}
                <div className="school-grid">
                  {filteredAlumni.map(a => (
                    <div key={a.id} className="school-card">
                      <img src={a.image || undefined} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', background: 'var(--surface2)', flexShrink: 0 }} alt={a.name} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{lang === 'ar' ? (a.nameAr || a.name) : a.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}><GraduationCap style={{ width: 11, height: 11 }} />{lang === 'ar' ? (a.schoolAr || a.school) : a.school} • {a.graduationYear}</p>
                        {(a.jobTitle || a.jobTitleAr) && <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{lang === 'ar' ? (a.jobTitleAr || a.jobTitle) : a.jobTitle}{(a.company || a.companyAr) ? ` @ ${lang === 'ar' ? (a.companyAr || a.company) : a.company}` : ''}</p>}
                        {a.featured && <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(245,158,11,0.1)', color: '#d97706', marginTop: 4 }}>★ {u.featured}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="dash-icon-btn" onClick={() => setEditAlumniId(a.id)} title={u.edit}><Pencil style={{ width: 15, height: 15, color: 'var(--accent)' }} /></button>
                        <button className="dash-icon-btn" onClick={() => deleteAlumni(a.id)} title={u.delete}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
                      </div>
                    </div>
                  ))}
                  {filteredAlumni.length === 0 && (
                    <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)', gridColumn: '1 / -1' }}>
                      <GraduationCap style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} />
                      <p style={{ fontWeight: 600 }}>{u.noResults}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Departments ── */}
          {section === 'departments' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.jobDepartmentsTitle}</h2></div>
                <button className="dash-btn dash-btn-primary" onClick={() => setAddDepartmentOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.newDept}</button>
              </div>
              <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
                <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.nameEn}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.nameAr}</th>
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

          {/* ── Governorates ── */}
          {section === 'governorates' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.governoratesTitle}</h2></div>
                <button className="dash-btn dash-btn-primary" onClick={() => setAddGovernorateOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.newGov}</button>
              </div>
              <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
                <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.nameEn}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.nameAr}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {governorates.map((gov, i) => (
                      <tr key={gov.id} style={{ borderBottom: i === governorates.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s ease' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px 24px', color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{gov.name}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text)', fontSize: 13 }}>{gov.nameAr}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <button className="dash-icon-btn" onClick={() => handleDeleteGovernorate(gov.id)} title={u.delete}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
                        </td>
                      </tr>
                    ))}
                    {governorates.length === 0 && <tr><td colSpan={3} style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}><MapPin style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>{u.noResults}</p></td></tr>}
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
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 10, overflow: 'hidden', background: 'var(--surface2)', flexShrink: 0, border: '1px solid var(--border)' }}>
                              <img src={job.image || "/layer-1-small.webp"} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{lang === 'ar' ? job.titleAr : job.title}</p>
                              <p style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 500 }}>{lang === 'ar' ? job.typeAr : job.type}</p>
                            </div>
                          </div>
                        </td>
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
                  key="All"
                  onClick={() => setSelectedRecruitmentJobId('All')}
                  className="dash-btn"
                  style={{
                    padding: '8px 24px',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: selectedRecruitmentJobId === 'All' ? 'none' : '1px solid var(--border)',
                    backgroundColor: selectedRecruitmentJobId === 'All' ? '#111827' : 'var(--bg)',
                    color: selectedRecruitmentJobId === 'All' ? 'white' : 'var(--text2)',
                    flexShrink: 0,
                    boxShadow: selectedRecruitmentJobId === 'All' ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {u.all}
                </button>
                {departments.map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedRecruitmentJobId(lang === 'ar' ? dept.nameAr : dept.nameEn)}
                    className="dash-btn"
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
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.appliedJob}</th>
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
                            showToast(u.failedToLoadApp, 'error');
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
                        {cvBlobUrl ? (
                          <iframe src={cvBlobUrl} width="100%" height="450px" className="border rounded-xl" title="cv preview" />
                        ) : (
                          <div className="p-10 border-2 border-dashed rounded-xl text-center text-slate-400 bg-slate-50">
                            {u.preparingPreview}
                          </div>
                        )}
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
                            showToast(u.statusUpdated);
                            fetchApplicants(); // Refetch paginated data
                            setApplicantModalOpen(false);
                          }
                        } catch (err) {
                          showToast(u.updateFailed, 'error');
                        }
                      }}>{u.save}</button>
                      <button className="dash-btn dash-btn-ghost" onClick={() => setApplicantModalOpen(false)}>{u.cancel}</button>
                      <button
                        className="dash-btn dash-btn-danger"
                        style={{ marginInlineStart: 'auto' }}
                        onClick={() => {
                          setConfirmAction({
                            message: u.deleteConfirm.replace('{type}', u.applicant),
                            onConfirm: async () => {
                              try {
                                await deleteEntry('jobApplications', selectedApplicant.id);
                                showToast(u.deletedSuccess);
                                fetchApplicants();
                                setApplicantModalOpen(false);
                              } catch (err) {
                                showToast(u.deleteFailed, 'error');
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
                <button className="dash-btn dash-btn-primary" onClick={() => setAddHeroOpen(true)}><Plus className="w-4 h-4" />{lang === 'ar' ? 'إضافة شريحة' : 'Add Slide'}</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {hero.map((s, i) => (
                  <div key={s.id} className="hero-card">
                    {s.image && <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}><img src={s.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} /><span style={{ position: 'absolute', bottom: 12, left: 16, right: 16, color: 'white', fontWeight: 800, fontSize: 18 }}>{s.title}</span></div>}
                    <div style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{s.title || (lang === 'ar' ? '(بدون نص)' : '(No text)')}</p>
                          <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{s.subtitle}</p>
                          <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4, maxWidth: 400 }}>{s.description}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="dash-btn dash-btn-ghost" onClick={() => setEditHeroId(s.id)}><Pencil style={{ width: 14, height: 14 }} />{u.edit}</button>
                        <button className="dash-btn dash-btn-danger" onClick={() => deleteHeroSlide(s.id)}><Trash2 style={{ width: 14, height: 14 }} /></button>
                      </div>
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
                  <div className="dash-card" style={{ padding: 18 }}>
                    <p className="dash-label">{u.storyImage}</p>
                    {about.storyImage && (
                      <img src={about.storyImage} alt="" className="w-48 h-32 rounded-2xl object-cover border border-var(--border) mt-2" />
                    )}
                  </div>
                  <div className="dash-card" style={{ padding: 18 }}><p className="dash-label">{u.mission}</p><p style={{ fontWeight: 700 }}>{lang === 'ar' ? about.missionTitleAr : about.missionTitle}</p><p style={{ fontSize: 13, color: 'var(--text2)' }}>{lang === 'ar' ? about.missionDescAr : about.missionDesc}</p></div>
                  <div className="dash-card" style={{ padding: 18 }}><p className="dash-label">{u.vision}</p><p style={{ fontWeight: 700 }}>{lang === 'ar' ? about.visionTitleAr : about.visionTitle}</p><p style={{ fontSize: 13, color: 'var(--text2)' }}>{lang === 'ar' ? about.visionDescAr : about.visionDesc}</p></div>
                </div>
              ) : (
                <div className="dash-card" style={{ padding: 24 }}>
                  <div className="form-grid">
                    <h4 className="form-full font-bold border-b pb-2 mb-2 text-slate-400 uppercase text-xs tracking-widest">{u.story}</h4>
                    <div className="form-col"><label className="dash-label">{u.storyTitleLabel} (EN)</label><input className="dash-input" value={about.storyTitle} onChange={e => setAbout(a => ({ ...a, storyTitle: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.storyTitleLabel} (AR)</label><input className="dash-input" dir="rtl" value={about.storyTitleAr} onChange={e => setAbout(a => ({ ...a, storyTitleAr: e.target.value }))} /></div>
                    <div className="form-full">
                      <ImageUpload label={u.storyImage} value={about.storyImage || ''} onChange={val => setAbout(a => ({ ...a, storyImage: val }))} />
                    </div>
                    <div className="form-full"><label className="dash-label">{u.storyDescLabel} (EN)</label><textarea className="dash-input dash-ta" value={about.storyDesc} onChange={e => setAbout(a => ({ ...a, storyDesc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.storyDescLabel} (AR)</label><textarea className="dash-input dash-ta" dir="rtl" value={about.storyDescAr} onChange={e => setAbout(a => ({ ...a, storyDescAr: e.target.value }))} /></div>

                    <h4 className="form-full font-bold border-b pb-2 mb-2 mt-4 text-slate-400 uppercase text-xs tracking-widest">{u.mission} & {u.vision}</h4>
                    <div className="form-col"><label className="dash-label">{u.missionTitleLabel} (EN)</label><input className="dash-input" value={about.missionTitle} onChange={e => setAbout(a => ({ ...a, missionTitle: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.missionTitleLabel} (AR)</label><input className="dash-input" dir="rtl" value={about.missionTitleAr} onChange={e => setAbout(a => ({ ...a, missionTitleAr: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.missionDescLabel} (EN)</label><textarea className="dash-input dash-ta" value={about.missionDesc} onChange={e => setAbout(a => ({ ...a, missionDesc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.missionDescLabel} (AR)</label><textarea className="dash-input dash-ta" dir="rtl" value={about.missionDescAr} onChange={e => setAbout(a => ({ ...a, missionDescAr: e.target.value }))} /></div>

                    <div className="form-col"><label className="dash-label">{u.visionTitleLabel} (EN)</label><input className="dash-input" value={about.visionTitle} onChange={e => setAbout(a => ({ ...a, visionTitle: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.visionTitleLabel} (AR)</label><input className="dash-input" dir="rtl" value={about.visionTitleAr} onChange={e => setAbout(a => ({ ...a, visionTitleAr: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.visionDescLabel} (EN)</label><textarea className="dash-input dash-ta" value={about.visionDesc} onChange={e => setAbout(a => ({ ...a, visionDesc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.visionDescLabel} (AR)</label><textarea className="dash-input dash-ta" dir="rtl" value={about.visionDescAr} onChange={e => setAbout(a => ({ ...a, visionDescAr: e.target.value }))} /></div>

                    <h4 className="form-full font-bold border-b pb-2 mb-2 mt-4 text-slate-400 uppercase text-xs tracking-widest">{u.foundationYear}</h4>
                    <div className="form-col">
                      <label className="dash-label">{u.foundationYear}</label>
                      <input 
                        type="number" 
                        className="dash-input" 
                        value={about.foundationYear || ''} 
                        onChange={e => setAbout(a => ({ ...a, foundationYear: parseInt(e.target.value) || undefined }))} 
                        min="1900"
                        max={new Date().getFullYear()}
                        placeholder={u.exampleYear}
                      />
                      <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>
                        {u.foundationYearDesc}
                      </p>
                    </div>

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
                    <p className="dash-label">{u.bottomCTA}</p>
                    <p style={{ fontWeight: 700 }}>{homeData.ctaTitle}</p>
                    <p style={{ fontSize: 13, color: 'var(--text2)' }}>{homeData.ctaDesc}</p>
                  </div>
                </div>
              ) : (
                <div className="dash-card" style={{ padding: 24 }}>
                  <div className="form-grid">
                    <h4 className="form-full font-bold border-b pb-2 mb-2 text-slate-400 uppercase text-xs tracking-widest">{u.introduction}</h4>
                    <div className="form-col"><label className="dash-label">{u.nameEn}</label><input className="dash-input" value={homeData.trustedTitle} onChange={e => setHomeData(p => ({ ...p, trustedTitle: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.nameAr}</label><input className="dash-input" dir="rtl" value={homeData.trustedTitleAr} onChange={e => setHomeData(p => ({ ...p, trustedTitleAr: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.highlightEnLabel}</label><input className="dash-input" value={homeData.trustedHighlight} onChange={e => setHomeData(p => ({ ...p, trustedHighlight: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.highlightArLabel}</label><input className="dash-input" dir="rtl" value={homeData.trustedHighlightAr} onChange={e => setHomeData(p => ({ ...p, trustedHighlightAr: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.descriptionEnLabel}</label><textarea className="dash-input dash-ta" value={homeData.trustedDesc} onChange={e => setHomeData(p => ({ ...p, trustedDesc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.descArLabel}</label><textarea className="dash-input dash-ta" dir="rtl" value={homeData.trustedDescAr} onChange={e => setHomeData(p => ({ ...p, trustedDescAr: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.ctaTextEn}</label><input className="dash-input" value={homeData.trustedCTA} onChange={e => setHomeData(p => ({ ...p, trustedCTA: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.ctaTextAr}</label><input className="dash-input" dir="rtl" value={homeData.trustedCTAAr} onChange={e => setHomeData(p => ({ ...p, trustedCTAAr: e.target.value }))} /></div>

                    <h4 className="form-full font-bold border-b pb-2 mb-2 mt-6 text-slate-400 uppercase text-xs tracking-widest">{u.map}</h4>
                    <div className="form-col"><label className="dash-label">{u.gatewayTitleEnLabel}</label><input className="dash-input" value={homeData.gatewayTitle} onChange={e => setHomeData(p => ({ ...p, gatewayTitle: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.titleArLabel}</label><input className="dash-input" dir="rtl" value={homeData.gatewayTitleAr} onChange={e => setHomeData(p => ({ ...p, gatewayTitleAr: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.gatewayHighlightEnLabel}</label><input className="dash-input" value={homeData.gatewayHighlight} onChange={e => setHomeData(p => ({ ...p, gatewayHighlight: e.target.value }))} /></div>
                    <div className="form-col"><label className="dash-label">{u.highlightArLabel}</label><input className="dash-input" dir="rtl" value={homeData.gatewayHighlightAr} onChange={e => setHomeData(p => ({ ...p, gatewayHighlightAr: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.gatewayDescEnLabel}</label><textarea className="dash-input dash-ta" value={homeData.gatewayDesc} onChange={e => setHomeData(p => ({ ...p, gatewayDesc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.descArLabel}</label><textarea className="dash-input dash-ta" dir="rtl" value={homeData.gatewayDescAr} onChange={e => setHomeData(p => ({ ...p, gatewayDescAr: e.target.value }))} /></div>
                    <div className="form-full">
                      <ImageUpload label={u.mapImageLabel} value={homeData.mapImage} onChange={val => setHomeData(p => ({ ...p, mapImage: val }))} />
                    </div>

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
                            <p className="text-[10px] text-center mt-2 text-slate-400 font-bold">{p.name || `${u.partner} ${i + 1}`}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <h4 className="form-full font-bold border-b pb-2 mb-2 mt-6 text-slate-400 uppercase text-xs tracking-widest">{u.galleryMosaic}</h4>
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
                  <h3 className="font-bold mb-4 text-[var(--text)]">{u.contactForm}</h3>
                  <div className="space-y-4">
                    <div><label className="dash-label">Title (EN)</label><input className="dash-input" value={formSettings?.contactFormTitle || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormTitle: e.target.value }))} /></div>
                    <div><label className="dash-label">{u.titleArLabel}</label><input className="dash-input" dir="rtl" value={formSettings?.contactFormTitleAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormTitleAr: e.target.value }))} /></div>
                    <div><label className="dash-label">{u.descriptionEnLabel}</label><textarea className="dash-input" value={formSettings?.contactFormDesc || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormDesc: e.target.value }))} /></div>
                    <div><label className="dash-label">{u.descArLabel}</label><textarea className="dash-input" dir="rtl" value={formSettings?.contactFormDescAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormDescAr: e.target.value }))} /></div>
                  </div>
                </div>
                <div className="dash-card" style={{ padding: 24 }}>
                  <h3 className="font-bold mb-4 text-[var(--text)]">{u.careersForm}</h3>
                  <div className="space-y-4">
                    <div><label className="dash-label">Title (EN)</label><input className="dash-input" value={formSettings?.jobFormTitle || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormTitle: e.target.value }))} /></div>
                    <div><label className="dash-label">{u.titleArLabel}</label><input className="dash-input" dir="rtl" value={formSettings?.jobFormTitleAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormTitleAr: e.target.value }))} /></div>
                    <div><label className="dash-label">{u.descriptionEnLabel}</label><textarea className="dash-input" value={formSettings?.jobFormDesc || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormDesc: e.target.value }))} /></div>
                    <div><label className="dash-label">{u.descArLabel}</label><textarea className="dash-input" dir="rtl" value={formSettings?.jobFormDescAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormDescAr: e.target.value }))} /></div>
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
                  <h3 className="font-bold mb-4 text-[var(--text)]">{u.basicInfo}</h3>
                  <div className="space-y-4">
                    <div><label className="dash-label">{u.addressLabel}</label><input className="dash-input" value={contactData?.address || ''} onChange={e => setContactData((p: any) => ({ ...p, address: e.target.value }))} /></div>
                    <div><label className="dash-label">{u.addressAr}</label><input className="dash-input" dir="rtl" value={contactData?.addressAr || ''} onChange={e => setContactData((p: any) => ({ ...p, addressAr: e.target.value }))} /></div>
                    <div><label className="dash-label">{u.phone}</label><input className="dash-input" value={contactData?.phone || ''} onChange={e => setContactData((p: any) => ({ ...p, phone: e.target.value }))} /></div>
                    <div><label className="dash-label">{u.email}</label><input className="dash-input" value={contactData?.email || ''} onChange={e => setContactData((p: any) => ({ ...p, email: e.target.value }))} /></div>
                    <div className="pt-2 border-t border-[var(--border)]">
                      <label className="dash-label mb-3">{u.workingHoursLabel}</label>
                      <div className="flex flex-col gap-4 bg-[var(--surface2)] border border-[var(--border)] p-4 rounded-xl">
                        <div>
                          <label className="text-[11px] font-bold text-[var(--text2)] uppercase tracking-widest mb-2 block">{u.fromToDay}</label>
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
                          <label className="text-[11px] font-bold text-[var(--text2)] uppercase tracking-widest mb-2 block">{u.fromToTime}</label>
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
                    <h3 className="font-bold mb-4 text-[var(--text)]">{u.socialMedia}</h3>
                    <div className="space-y-4">
                      <div><label className="dash-label">Facebook</label><input className="dash-input" value={contactData?.facebook || ''} onChange={e => setContactData((p: any) => ({ ...p, facebook: e.target.value }))} /></div>
                      <div><label className="dash-label">Twitter / X</label><input className="dash-input" value={contactData?.twitter || ''} onChange={e => setContactData((p: any) => ({ ...p, twitter: e.target.value }))} /></div>
                      <div><label className="dash-label">Instagram</label><input className="dash-input" value={contactData?.instagram || ''} onChange={e => setContactData((p: any) => ({ ...p, instagram: e.target.value }))} /></div>
                      <div><label className="dash-label">LinkedIn</label><input className="dash-input" value={contactData?.linkedin || ''} onChange={e => setContactData((p: any) => ({ ...p, linkedin: e.target.value }))} /></div>
                    </div>
                  </div>

                  <div className="dash-card" style={{ padding: 24 }}>
                    <h3 className="font-bold mb-4 text-[var(--text)]">{u.footerTexts}</h3>
                    <div className="space-y-4">
                      <div><label className="dash-label">Footer Description (EN)</label><textarea className="dash-input dash-ta" value={contactData?.footerDesc || ''} onChange={e => setContactData((p: any) => ({ ...p, footerDesc: e.target.value }))} /></div>
                      <div><label className="dash-label">{u.descArLabel}</label><textarea className="dash-input dash-ta" dir="rtl" value={contactData?.footerDescAr || ''} onChange={e => setContactData((p: any) => ({ ...p, footerDescAr: e.target.value }))} /></div>
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
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Search + Type filter */}
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface2)', borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', padding: '4px 8px', maxWidth: 450 }}>
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
                        { value: 'All', label: u.allTypes },
                        ...(translationsRoot?.complaints?.types || []).map((type: string) => ({ value: type, label: type }))
                      ]}
                    />
                  </div>
                  {/* Governorate filter */}
                  <CustomSelect
                    className="!w-36"
                    value={complaintsFilterGov}
                    onChange={val => { setComplaintsFilterGov(val); setComplaintsFilterSchool(''); setComplaintPage(1); }}
                    options={[
                      { value: '', label: u.allGovs },
                      ...Array.from(new Set(schools.map((s: any) => lang === 'ar' ? (s.governorateAr || s.governorate) : s.governorate).filter(Boolean))).sort().map((g: string) => ({ value: g, label: g }))
                    ]}
                  />
                  {/* School filter (filtered by governorate) */}
                  <CustomSelect
                    className="!w-44"
                    value={complaintsFilterSchool}
                    onChange={val => {
                      setComplaintsFilterSchool(val);
                      // Auto-set governorate when school is selected
                      if (val) {
                        const school = schools.find((s: any) => s.name === val || s.nameAr === val);
                        if (school) {
                          const gov = lang === 'ar' ? (school.governorateAr || school.governorate) : school.governorate;
                          if (gov && gov !== complaintsFilterGov) setComplaintsFilterGov(gov);
                        }
                      }
                      setComplaintPage(1);
                    }}
                    options={[
                      { value: '', label: u.allSchools },
                      ...schools
                        .filter((s: any) => !complaintsFilterGov || (lang === 'ar' ? (s.governorateAr || s.governorate) : s.governorate) === complaintsFilterGov)
                        .map((s: any) => ({ value: s.name, label: lang === 'ar' ? (s.nameAr || s.name) : s.name }))
                    ]}
                  />
                </div>
              </div>

              {/* Top 3 Schools by Complaints */}
              {(() => {
                const schoolCounts: Record<string, number> = {};
                complaints.forEach((c: any) => {
                  const school = c.school || '';
                  if (school) schoolCounts[school] = (schoolCounts[school] || 0) + 1;
                });
                const top3 = Object.entries(schoolCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
                if (top3.length === 0) return null;
                return (
                  <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'center', marginRight: 8 }}>{u.topComplaintSchools}:</p>
                    {top3.map(([school, count], idx) => {
                      const schoolData = schools.find((s: any) => s.name === school || s.nameAr === school);
                      const displayName = lang === 'ar' ? (schoolData?.nameAr || school) : school;
                      const medals = ['#f59e0b', '#94a3b8', '#cd7f32'];
                      return (
                        <div key={school} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface2)', borderRadius: 12, padding: '8px 14px', border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => { setComplaintsFilterSchool(school); setComplaintPage(1); }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: medals[idx] || 'var(--text2)' }}>#{idx + 1}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{displayName}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(239,68,68,0.12)', color: '#ef4444', borderRadius: 999, padding: '2px 8px' }}>{count} {u.complaintsCount}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
                <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.requestId}</th>
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
                        <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13, cursor: 'pointer' }}><span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--surface2)', fontSize: 11, fontWeight: 700 }}>{getMessageTypeLabel(c.messageType)}</span></td>
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
                          <button className="dash-icon-btn" title={u.delete} onClick={() => deleteComplaint(c)}>
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
                          <button className="dash-icon-btn" title={u.delete} onClick={() => deleteContactMessage(c.id)}>
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

          {/* ── Admission Settings ── */}
          {section === 'admissionSettings' && (
            <div className="section-enter">
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Settings style={{ width: 24, height: 24, color: 'var(--accent)' }} />
                  {u.admissionSettings}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{u.admissionSettingsManage}</p>
              </div>

              {/* Admission Settings Card */}
              <div className="dash-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={admissionSettings?.isOpen ?? true} onChange={e => setAdmissionSettings((p: any) => ({ ...p, isOpen: e.target.checked }))} style={{ width: 16, height: 16 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{u.isOpen}</span>
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12, marginBottom: 16 }}>
                  {/* Required Documents */}
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{u.requiredDocuments}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {(admissionSettings?.requiredDocuments || []).map((doc: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input value={doc} onChange={e => setAdmissionSettings((p: any) => { const docs = [...(p.requiredDocuments || [])]; docs[i] = e.target.value; return { ...p, requiredDocuments: docs }; })} className="dash-input" style={{ flex: 1, fontSize: 12 }} />
                          <button className="dash-icon-btn" disabled={!doc.trim()} onClick={() => setAdmissionSettings((p: any) => ({ ...p, requiredDocuments: [...(p.requiredDocuments || []), ''] }))} title={u.addDocument}><Plus style={{ width: 13, height: 13 }} /></button>
                          <button className="dash-icon-btn" onClick={() => setAdmissionSettings((p: any) => { const docs = [...(p.requiredDocuments || [])]; docs.splice(i, 1); return { ...p, requiredDocuments: docs }; })}><X style={{ width: 13, height: 13, color: '#ef4444' }} /></button>
                        </div>
                      ))}
                      {(admissionSettings?.requiredDocuments || []).length === 0 && (
                        <button className="dash-btn dash-btn-ghost" style={{ fontSize: 12, justifyContent: 'flex-start' }} onClick={() => setAdmissionSettings((p: any) => ({ ...p, requiredDocuments: [''] }))}><Plus style={{ width: 13, height: 13 }} />{u.addDocument}</button>
                      )}
                    </div>
                  </div>
                  {/* Grade Stages */}
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{u.gradeStages}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {(admissionSettings?.gradeStages || []).map((stage: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input value={stage} onChange={e => setAdmissionSettings((p: any) => { const arr = [...(p.gradeStages || [])]; const oldName = arr[i]; const newName = e.target.value; arr[i] = newName; const map = { ...(p.gradeClassesByStage || {}) }; if (oldName !== newName && map[oldName] !== undefined) { map[newName] = map[oldName]; delete map[oldName]; } return { ...p, gradeStages: arr, gradeClassesByStage: map }; })} className="dash-input" style={{ flex: 1, fontSize: 12 }} />
                          <button className="dash-icon-btn" disabled={!stage.trim()} onClick={() => setAdmissionSettings((p: any) => ({ ...p, gradeStages: [...(p.gradeStages || []), ''], gradeClassesByStage: { ...(p.gradeClassesByStage || {}), '': [] } }))} title={u.addStage}><Plus style={{ width: 13, height: 13 }} /></button>
                          <button className="dash-icon-btn" onClick={() => setAdmissionSettings((p: any) => { const arr = [...(p.gradeStages || [])]; const oldStage = arr[i]; arr.splice(i, 1); const newMap = { ...(p.gradeClassesByStage || {}) }; delete newMap[oldStage]; return { ...p, gradeStages: arr, gradeClassesByStage: newMap }; })}><X style={{ width: 13, height: 13, color: '#ef4444' }} /></button>
                        </div>
                      ))}
                      {(admissionSettings?.gradeStages || []).length === 0 && (
                        <button className="dash-btn dash-btn-ghost" style={{ fontSize: 12, justifyContent: 'flex-start' }} onClick={() => setAdmissionSettings((p: any) => ({ ...p, gradeStages: [''], gradeClassesByStage: { '': [] } }))}><Plus style={{ width: 13, height: 13 }} />{u.addStage}</button>
                      )}
                    </div>
                  </div>
                </div>
                {/* Grade Classes by Stage */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{u.gradeClasses}</p>
                  {(admissionSettings?.gradeStages || []).map((stage: string) => (
                    <div key={stage} style={{ background: 'var(--surface2)', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{stage || (lang === 'ar' ? 'مرحلة جديدة' : 'New Stage')}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {((admissionSettings?.gradeClassesByStage || {})[stage] || []).map((cls: string, i: number) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input value={cls} onChange={e => setAdmissionSettings((p: any) => { const map = { ...(p.gradeClassesByStage || {}) }; const arr = [...(map[stage] || [])]; arr[i] = e.target.value; map[stage] = arr; return { ...p, gradeClassesByStage: map }; })} className="dash-input" style={{ flex: 1, fontSize: 11 }} />
                            <button className="dash-icon-btn" disabled={!cls.trim()} onClick={() => setAdmissionSettings((p: any) => { const map = { ...(p.gradeClassesByStage || {}) }; map[stage] = [...(map[stage] || []), '']; return { ...p, gradeClassesByStage: map }; })} title={u.addClass}><Plus style={{ width: 12, height: 12 }} /></button>
                            <button className="dash-icon-btn" onClick={() => setAdmissionSettings((p: any) => { const map = { ...(p.gradeClassesByStage || {}) }; const arr = [...(map[stage] || [])]; arr.splice(i, 1); map[stage] = arr; return { ...p, gradeClassesByStage: map }; })}><X style={{ width: 12, height: 12, color: '#ef4444' }} /></button>
                          </div>
                        ))}
                        {((admissionSettings?.gradeClassesByStage || {})[stage] || []).length === 0 && (
                          <button className="dash-btn dash-btn-ghost" style={{ fontSize: 11, justifyContent: 'flex-start' }} onClick={() => setAdmissionSettings((p: any) => { const map = { ...(p.gradeClassesByStage || {}) }; map[stage] = ['']; return { ...p, gradeClassesByStage: map }; })}><Plus style={{ width: 12, height: 12 }} />{u.addClass}</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button className="dash-btn dash-btn-primary" onClick={() => { updateData('admissionSettings', admissionSettings); showToast(u.admissionSaved); }}><Save style={{ width: 14, height: 14 }} />{u.save}</button>
                </div>
              </div>
            </div>
          )}

          {/* ── Admission Applications ── */}
          {section === 'admissionApplications' && (
            <div className="section-enter">
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <GraduationCap style={{ width: 24, height: 24, color: 'var(--accent)' }} />
                    {u.admissionApplications}
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{u.admissionApplicationsManage}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface2)', borderRadius: 16, border: '1px solid var(--border)', padding: '4px 8px', gap: 8 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 10, right: isRTL ? 10 : 'auto', width: 14, height: 14, color: 'var(--text2)' }} />
                      <input
                        style={{ background: 'transparent', border: 'none', outline: 'none', padding: '6px 10px', paddingLeft: isRTL ? 10 : 28, paddingRight: isRTL ? 28 : 10, fontSize: 13, color: 'var(--text)', width: 180 }}
                        placeholder={u.search}
                        value={admissionsSearch}
                        onChange={e => { setAdmissionsSearch(e.target.value); setAdmissionsPage(1); }}
                      />
                    </div>
                    <div style={{ width: 1, height: 20, background: 'var(--border)' }}></div>
                    <CustomSelect
                      className="!w-40"
                      value={admissionsFilterStatus}
                      onChange={val => { setAdmissionsFilterStatus(val); setAdmissionsPage(1); }}
                      options={[
                        { value: 'All', label: u.all },
                        { value: 'Pending', label: u.pending },
                        { value: 'Under Review', label: u.underReview },
                        { value: 'Accepted', label: u.accepted },
                        { value: 'Waitlist', label: u.waitlist },
                        { value: 'Rejected', label: u.rejected },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
                {isTableLoading && (
                  <div className="table-loader">
                    <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
                  </div>
                )}
                <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.admissionId}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.studentName}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.parentPhone}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.gradeStage}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.preferences}</th>
                      <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.status}</th>
                      <th style={{ padding: '14px 12px', width: 48 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {admissionsList.length > 0 ? admissionsList.map((adm, i) => {
                      const statusColors: Record<string, { bg: string; color: string }> = {
                        'Pending':      { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
                        'Under Review': { bg: 'rgba(99,102,241,0.12)',  color: 'var(--accent)' },
                        'Accepted':     { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
                        'Waitlist':     { bg: 'rgba(251,146,60,0.12)',  color: '#fb923c' },
                        'Rejected':     { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
                      };
                      const sc = statusColors[adm.status] || statusColors['Pending'];
                      return (
                        <tr key={adm.id} style={{ borderBottom: i === admissionsList.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s ease', cursor: 'pointer' }}
                          onClick={() => { setSelectedAdmission(adm); setAdmissionModalOpen(true); }}
                          onMouseOver={e => e.currentTarget.style.background = 'var(--surface2)'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '16px 24px', color: 'var(--accent)', fontWeight: 800, fontSize: 12, fontFamily: 'monospace' }}>{adm.id}</td>
                          <td style={{ padding: '16px 24px', color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>
                            <p>{adm.studentName}</p>
                            <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{adm.createdAt ? new Date(adm.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') : ''}</p>
                          </td>
                          <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13 }} dir="ltr">{adm.parentPhone}</td>
                          <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13 }}>{adm.gradeStage} — {adm.gradeClass}</td>
                          <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 12, maxWidth: 200 }}>
                            <ol style={{ margin: 0, paddingInlineStart: 16 }}>
                              {(adm.preferences || []).slice(0, 3).map((p: any, pi: number) => (
                                <li key={pi} style={{ fontWeight: pi === 0 ? 700 : 400, color: pi === 0 ? 'var(--text)' : 'var(--text2)' }}>
                                  {lang === 'ar' ? (p.schoolNameAr || p.schoolName) : p.schoolName}
                                </li>
                              ))}
                              {(adm.preferences || []).length > 3 && <li style={{ color: 'var(--text2)', fontStyle: 'italic' }}>+{(adm.preferences || []).length - 3} more</li>}
                            </ol>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color }}>{adm.status}</span>
                          </td>
                          <td style={{ padding: '16px 12px' }} onClick={e => e.stopPropagation()}>
                            <button className="dash-icon-btn" title={u.delete} onClick={() => {
                              setConfirmAction({
                                message: u.deleteConfirm.replace('{type}', adm.studentName || adm.id),
                                onConfirm: async () => {
                                  await deleteEntry('admissions', adm.id);
                                  showToast(u.admissionDeleted, 'error');
                                  fetchAdmissions();
                                }
                              });
                            }}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}>
                          <GraduationCap style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} />
                          <p style={{ fontWeight: 600 }}>{u.noResults}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination current={admissionsPage} total={admissionsTotalPages} onChange={setAdmissionsPage} lang={lang} />

              {/* Admission Detail Modal */}
              {admissionModalOpen && selectedAdmission && (
                <AdmissionModal
                  admission={selectedAdmission}
                  lang={lang}
                  isRTL={isRTL}
                  u={u}
                  schools={schools}
                  onClose={() => { setAdmissionModalOpen(false); setSelectedAdmission(null); }}
                  onUpdate={async (id, status, acceptedSchool, adminNotes) => {
                    try {
                      await updateAdmission(id, status, acceptedSchool, adminNotes);
                      showToast(u.admissionUpdated);
                      fetchAdmissions();
                      setAdmissionModalOpen(false);
                    } catch (err) {
                      showToast(u.updateFailed, 'error');
                    }
                  }}
                />
              )}
            </div>
          )}

          {/* ── Modifications ── */}
          {section === 'modifications' && (
            <div className="section-enter">
              <ModificationsSection 
                lang={lang} 
                isRTL={isRTL} 
                u={u} 
                showToast={showToast}
              />
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
        return <ModalWrap title={`${u.edit || 'Edit'} — ${(u.hero || 'Hero')}`} onClose={() => setEditHeroId(null)}>
          <EditHeroForm slide={s} lang={lang} onSave={saveHero} onCancel={() => setEditHeroId(null)} />
        </ModalWrap>;
      })()}

      {addHeroOpen && (
        <ModalWrap title={lang === 'ar' ? 'إضافة شريحة' : 'Add Slide'} onClose={() => setAddHeroOpen(false)}>
          <EditHeroForm 
            slide={{ id: 0, title: '', subtitle: '', description: '', image: '' }} 
            lang={lang} 
            onSave={addHeroSlide} 
            onCancel={() => setAddHeroOpen(false)} 
          />
        </ModalWrap>
      )}


      {editSchoolId && schools.find(sc => String(sc.id) === String(editSchoolId)) && (() => {
        const s = schools.find(sc => String(sc.id) === String(editSchoolId))!;
        return <ModalWrap title={`${u.edit || 'Edit'} — ${s.name || ''}`} onClose={() => setEditSchoolId(null)}>
          <EditSchoolForm school={s} lang={lang} onSave={saveSchool} onCancel={() => setEditSchoolId(null)} />
        </ModalWrap>;
      })()}

      {addJobOpen && (
        <ModalWrap title={u.addJobTitle} onClose={() => setAddJobOpen(false)}>
          <EditJobForm job={newJob} lang={lang} onSave={addJob} onCancel={() => setAddJobOpen(false)} />
        </ModalWrap>
      )}

      {addSchoolOpen && (
        <ModalWrap title={u.addSchoolTitle} onClose={() => setAddSchoolOpen(false)}>
          <EditSchoolForm school={newSchool as DashSchool} lang={lang} onSave={addSchool} onCancel={() => setAddSchoolOpen(false)} />
        </ModalWrap>
      )}

      {editAlumniId && alumniList.find(a => String(a.id) === String(editAlumniId)) && (() => {
        const a = alumniList.find(a => String(a.id) === String(editAlumniId))!;
        return <ModalWrap title={u.editAlumni} onClose={() => setEditAlumniId(null)}>
          <EditAlumniForm alumni={a} lang={lang} onSave={saveAlumni} onCancel={() => setEditAlumniId(null)} />
        </ModalWrap>;
      })()}

      {addAlumniOpen && (
        <ModalWrap title={u.addAlumni} onClose={() => setAddAlumniOpen(false)}>
          <EditAlumniForm alumni={newAlumni as DashAlumni} lang={lang} onSave={addAlumni} onCancel={() => setAddAlumniOpen(false)} />
        </ModalWrap>
      )}

      {editJobId && jobs.find(j => String(j.id) === String(editJobId)) && (() => {
        const j = jobs.find(j => String(j.id) === String(editJobId))!;
        return <ModalWrap title={u.editJobTitle} onClose={() => setEditJobId(null)}>
          <EditJobForm job={j} lang={lang} onSave={saveJob} onCancel={() => setEditJobId(null)} />
        </ModalWrap>;
      })()}

      {addDepartmentOpen && (
        <ModalWrap title={u.newDept} onClose={() => setAddDepartmentOpen(false)}>
          <div className="form-grid">
            <div className="form-col">
              <label className="dash-label">{u.nameEn}</label>
              <input className="dash-input" value={newDepartment.nameEn} onChange={e => setNewDepartment({ ...newDepartment, nameEn: e.target.value })} />
            </div>
            <div className="form-col">
              <label className="dash-label">{u.nameAr}</label>
              <input className="dash-input" dir="rtl" value={newDepartment.nameAr} onChange={e => setNewDepartment({ ...newDepartment, nameAr: e.target.value })} />
            </div>
            <div className="form-full dash-form-actions">
              <button className="dash-btn dash-btn-primary" onClick={addDepartment}><Save className="w-4 h-4" />{u.save}</button>
              <button className="dash-btn dash-btn-ghost" onClick={() => setAddDepartmentOpen(false)}>{u.cancel}</button>
            </div>
          </div>
        </ModalWrap>
      )}

      {addGovernorateOpen && (
        <ModalWrap title={u.newGov} onClose={() => setAddGovernorateOpen(false)}>
          <div className="form-grid">
            <div className="form-col">
              <label className="dash-label">{u.nameEn}</label>
              <input className="dash-input" value={newGovernorate.name} onChange={e => setNewGovernorate({ ...newGovernorate, name: e.target.value })} placeholder="e.g., Cairo" />
            </div>
            <div className="form-col">
              <label className="dash-label">{u.nameAr}</label>
              <input className="dash-input" dir="rtl" value={newGovernorate.nameAr} onChange={e => setNewGovernorate({ ...newGovernorate, nameAr: e.target.value })} placeholder="مثال: القاهرة" />
            </div>
            <div className="form-full dash-form-actions">
              <button className="dash-btn dash-btn-primary" onClick={addGovernorate}><Save className="w-4 h-4" />{u.save}</button>
              <button className="dash-btn dash-btn-ghost" onClick={() => setAddGovernorateOpen(false)}>{u.cancel}</button>
            </div>
          </div>
        </ModalWrap>
      )}

      {/* complaint detail modal */}
      {complaintModalOpen && selectedComplaint && (
        <ModalWrap title={u.requestDetails} onClose={() => setComplaintModalOpen(false)}>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <p><strong>{u.senderName}:</strong> {selectedComplaint.fullName}</p>
            <p><strong>{u.phone}:</strong> {selectedComplaint.phone}</p>
            <p><strong>{u.school}:</strong> {selectedComplaint.school}</p>
            <p><strong>{u.messageType}:</strong> {getMessageTypeLabel(selectedComplaint.messageType)}</p>
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
              <label className="dash-label">{u.adminResponse}</label>
              <textarea
                className="dash-input dash-ta"
                value={selectedComplaint.response || ''}
                onChange={e => setSelectedComplaint(c => c ? { ...c, response: e.target.value } : null)}
                placeholder={u.writeResponse}
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
                    showToast(u.updatedSuccess);
                    fetchComplaints(); // Refetch paginated data
                    setComplaintModalOpen(false);
                  }
                } catch (err) {
                  showToast(u.updateFailed, 'error');
                }
              }}>{u.save}</button>
              <button className="dash-btn dash-btn-ghost" onClick={() => setComplaintModalOpen(false)}>{u.close || u.cancel}</button>
            </div>
          </div>
        </ModalWrap>
      )}

      {/* contact message detail modal */}
      {contactModalOpen && selectedContact && (
        <ModalWrap title={u.messageDetails} onClose={() => setContactModalOpen(false)}>
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
        <ModalWrap title={u.confirmDeletion} onClose={() => setConfirmAction(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '15px', color: 'var(--text)', fontWeight: 500 }}>
              {confirmAction.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button
                className="dash-btn dash-btn-ghost"
                onClick={() => setConfirmAction(null)}
              >
                {u.cancel}
              </button>
              <button
                className="dash-btn dash-btn-danger"
                onClick={() => {
                  confirmAction.onConfirm();
                  setConfirmAction(null);
                }}
              >
                {u.delete}
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

// ═══════════════════════════════════════════════════════════════════════════
// Modifications Section Component
// ═══════════════════════════════════════════════════════════════════════════
interface ModificationsSectionProps {
  lang: 'en' | 'ar';
  isRTL: boolean;
  u: Record<string, string>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const ModificationsSection: React.FC<ModificationsSectionProps> = ({ lang, isRTL, u, showToast }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      // Get paginated entries for modification_requests
      const res = await getPaginatedEntries({ 
        type: 'modification_requests', 
        page: 1, 
        limit: 100,
        search: filterStatus === 'all' ? '' : filterStatus
      });
      if (res.status === 'success') {
        // Filter by status on client side since API doesn't support status filter
        let items = res.data.items || [];
        if (filterStatus !== 'all') {
          items = items.filter((req: any) => req.status === filterStatus);
        }
        setRequests(items);
      }
    } catch (err) {
      console.error('Failed to fetch modification requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!selectedRequest) return;
    if (action === 'reject' && !adminResponse.trim()) {
      showToast(lang === 'ar' ? 'يرجى إدخال سبب الرفض' : 'Please enter rejection reason', 'error');
      return;
    }

    try {
      const res = await fetch('/api.php?action=review_modification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          action,
          adminResponse: adminResponse.trim(),
        }),
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        showToast(action === 'approve' ? (u.approved || 'Approved') : (u.rejected || 'Rejected'));
        setReviewModalOpen(false);
        setSelectedRequest(null);
        setAdminResponse('');
        fetchRequests();
      } else {
        showToast(data.message || u.error, 'error');
      }
    } catch (err) {
      showToast(u.error, 'error');
    }
  };

  const statusColors: Record<string, { bg: string; color: string }> = {
    'pending':  { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
    'approved': { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
    'rejected': { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
    'completed':{ bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6' },
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Edit3 style={{ width: 24, height: 24, color: 'var(--accent)' }} />
            {u.modifications}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{u.modificationsManage}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface2)', borderRadius: 16, border: '1px solid var(--border)', padding: '4px 8px', gap: 8 }}>
            <CustomSelect
              className="!w-40"
              value={filterStatus}
              onChange={val => setFilterStatus(val)}
              options={[
                { value: 'all', label: u.all },
                { value: 'pending', label: u.pending },
                { value: 'approved', label: u.approved },
                { value: 'rejected', label: u.rejected },
                { value: 'completed', label: u.completed },
              ]}
            />
          </div>
          <button 
            className="dash-btn dash-btn-primary"
            onClick={fetchRequests}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Search style={{ width: 14, height: 14 }} />
            {u.refresh}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
        {isLoading && (
          <div className="table-loader">
            <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
          </div>
        )}
        <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.requestId}</th>
              <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.studentName}</th>
              <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.reason}</th>
              <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.status}</th>
              <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.date}</th>
              <th style={{ padding: '14px 12px', width: 48 }} />
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? requests.map((req, i) => (
              <tr 
                key={req.id} 
                style={{ 
                  cursor: 'pointer', 
                  borderBottom: i === requests.length - 1 ? 'none' : '1px solid var(--border)', 
                  transition: 'background 0.2s ease' 
                }} 
                onClick={() => { setSelectedRequest(req); setReviewModalOpen(true); }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '16px 24px', color: 'var(--text)', fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>{req.requestNumber}</td>
                <td style={{ padding: '16px 24px', color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{req.studentName}</td>
                <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13, maxWidth: 200 }}>
                  <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.requestReason}>{req.requestReason}</p>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                    background: statusColors[req.status]?.bg || statusColors['pending'].bg,
                    color: statusColors[req.status]?.color || statusColors['pending'].color,
                  }}>{req.status}</span>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 12, fontWeight: 600 }}>{req.createdAt ? new Date(req.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') : '—'}</td>
                <td style={{ padding: '16px 12px' }}>
                  <ChevronRight style={{ width: 16, height: 16, color: 'var(--border)', transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}>
                  <Edit3 style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} />
                  <p style={{ fontWeight: 600 }}>{u.noResults}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedRequest && (
        <ModalWrap title={u.reviewRequest || 'Review Request'} onClose={() => { setReviewModalOpen(false); setAdminResponse(''); }}>
          <div style={{ width: '100%', maxWidth: 600 }} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'monospace', fontWeight: 700, marginBottom: 4 }}>{selectedRequest.requestNumber}</p>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.requestDetails}</h3>
              </div>
              <span style={{ 
                padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, 
                background: statusColors[selectedRequest.status]?.bg || statusColors['pending'].bg, 
                color: statusColors[selectedRequest.status]?.color || statusColors['pending'].color 
              }}>{selectedRequest.status}</span>
            </div>

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div className="dash-card" style={{ padding: 12 }}>
                <p className="dash-label">{u.studentName}</p>
                <p style={{ fontWeight: 700 }}>{selectedRequest.studentName}</p>
              </div>
              <div className="dash-card" style={{ padding: 12 }}>
                <p className="dash-label">{u.nationalId}</p>
                <p style={{ fontFamily: 'monospace' }}>****{selectedRequest.nationalIdSuffix}</p>
              </div>
            </div>

            {/* Reason */}
            <div className="dash-card" style={{ padding: 16, marginBottom: 20 }}>
              <p className="dash-label">{u.reason}</p>
              <p style={{ fontWeight: 600 }}>{selectedRequest.requestReason}</p>
            </div>

            {/* Requested Preferences */}
            <div className="dash-card" style={{ padding: 16, marginBottom: 20 }}>
              <p className="dash-label">{u.requestedPreferences || 'Requested Preferences'}</p>
              <ol style={{ paddingLeft: 20 }}>
                {selectedRequest.requestedPreferences && JSON.parse(selectedRequest.requestedPreferences || '[]').map((pref: any, idx: number) => (
                  <li key={idx} style={{ fontWeight: 600, marginBottom: 4 }}>
                    {pref.schoolNameAr || pref.schoolName}
                  </li>
                ))}
              </ol>
            </div>

            {/* Admin Response */}
            {selectedRequest.status === 'pending' ? (
              <div style={{ marginBottom: 20 }}>
                <label className="dash-label">{u.adminResponse || 'Your Response'}</label>
                <textarea 
                  className="dash-input dash-ta" 
                  value={adminResponse}
                  onChange={e => setAdminResponse(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب ردك أو سبب الرفض...' : 'Write your response or rejection reason...'}
                />
              </div>
            ) : selectedRequest.adminResponse ? (
              <div className="dash-card" style={{ padding: 16, marginBottom: 20, background: selectedRequest.status === 'rejected' ? 'rgba(239,68,68,0.05)' : 'rgba(16,185,129,0.05)' }}>
                <p className="dash-label">{u.adminResponse || 'Admin Response'}</p>
                <p style={{ fontWeight: 600 }}>{selectedRequest.adminResponse}</p>
              </div>
            ) : null}

            {/* Actions */}
            <div className="dash-form-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {selectedRequest.status === 'pending' ? (
                <>
                  <button 
                    className="dash-btn dash-btn-primary" 
                    onClick={() => handleReview('approve')}
                    style={{ background: '#10b981', borderColor: '#10b981' }}
                  >
                    <CheckCircle style={{ width: 14, height: 14 }} />
                    {u.approve || 'Approve'}
                  </button>
                  <button 
                    className="dash-btn dash-btn-danger" 
                    onClick={() => handleReview('reject')}
                  >
                    <XCircle style={{ width: 14, height: 14 }} />
                    {u.reject || 'Reject'}
                  </button>
                  <button 
                    className="dash-btn dash-btn-ghost" 
                    onClick={() => { setReviewModalOpen(false); setAdminResponse(''); }}
                    style={{ marginInlineStart: 'auto' }}
                  >
                    {u.cancel}
                  </button>
                </>
              ) : (
                <button 
                  className="dash-btn dash-btn-ghost" 
                  onClick={() => { setReviewModalOpen(false); setAdminResponse(''); }}
                  style={{ marginInlineStart: 'auto' }}
                >
                  {u.close || 'Close'}
                </button>
              )}
            </div>
          </div>
        </ModalWrap>
      )}
    </>
  );
};

// Add translations
UI.en.approve = 'Approve';
UI.en.reject = 'Reject';
UI.en.approved = 'Approved';
UI.en.rejected = 'Rejected';
UI.en.reviewRequest = 'Review Request';
UI.en.requestedPreferences = 'Requested Preferences';
UI.en.adminResponse = 'Admin Response';
UI.en.close = 'Close';
UI.en.refresh = 'Refresh';
UI.ar.approve = 'موافقة';
UI.ar.reject = 'رفض';
UI.ar.approved = 'تمت الموافقة';
UI.ar.rejected = 'تم الرفض';
UI.ar.reviewRequest = 'مراجعة الطلب';
UI.ar.requestedPreferences = 'الرغبات المطلوبة';
UI.ar.adminResponse = 'رد الإدارة';
UI.ar.close = 'إغلاق';
UI.ar.refresh = 'تحديث';

export default Dashboard;
