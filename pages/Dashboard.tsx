import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Newspaper, School, Image, Info, Settings,
    Plus, Pencil, Trash2, Eye, EyeOff, Save, X,
    Users, GraduationCap, MapPin, Bell, LogOut, Search,
    TrendingUp, CheckCircle, AlertCircle, Menu, Moon, Sun,
    Globe, ChevronRight
} from 'lucide-react';
import { NEWS, SCHOOLS } from '../constants';
import {
    Section, Theme, Lang, DashNewsItem, DashSchool, HeroSlide, AboutData, AdminProfile,
    UI, HERO_IMAGES
} from './dashboard-components/types';
import { ModalWrap, EditNewsForm, EditHeroForm, EditSchoolForm } from './dashboard-components/Modals';
import { useAuth } from '../AuthContext';

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
    name: 'Dr. Ahmed El-Said', role: 'Chairman of NIS',
    desc: 'Welcome to the National Institutes. We are a community dedicated to academic rigor and character building.',
    points: ['National Curriculum', 'International Standards', 'Holistic Growth', 'Ethical Leadership'],
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cairo:wght@400;600;700;800&display=swap');
  .dash-root { --bg:#f0f4ff; --surface:#ffffff; --surface2:#f8faff; --border:#e2e8f0; --text:#0f172a; --text2:#64748b; --accent:#4f46e5; --accent2:#818cf8; --sidebar:#1e1b4b; --sidebar2:#312e81; --danger:#ef4444; --success:#10b981; --warn:#f59e0b; }
  .dash-root.dark { --bg:#0f0f1a; --surface:#1a1a2e; --surface2:#16213e; --border:#2d2d4e; --text:#f1f5f9; --text2:#94a3b8; --accent:#818cf8; --accent2:#a5b4fc; --sidebar:#0d0d1f; --sidebar2:#1a1a35; }
  .dash-root { min-height:100vh; background:var(--bg); font-family:'Inter',sans-serif; display:flex; color:var(--text); transition:background 0.3s,color 0.3s; }
  .dash-root.rtl { direction:rtl; font-family:'Cairo',sans-serif; }
  .dash-sidebar { width:260px; background:linear-gradient(160deg,var(--sidebar) 0%,var(--sidebar2) 100%); display:flex; flex-direction:column; position:fixed; top:0; bottom:0; left:0; z-index:100; overflow:hidden; transition:width 0.3s,left 0.3s,right 0.3s; border-right:1px solid rgba(255,255,255,0.05); }
  .dash-root.rtl .dash-sidebar { left:auto; right:0; border-right:none; border-left:1px solid rgba(255,255,255,0.05); }
  .dash-sidebar.collapsed { width:72px; }
  .dash-main { flex:1; margin-left:260px; display:flex; flex-direction:column; min-height:100vh; transition:margin 0.3s; }
  .dash-root.rtl .dash-main { margin-left:0; margin-right:260px; }
  .dash-main.collapsed { margin-left:72px; }
  .dash-root.rtl .dash-main.collapsed { margin-left:0; margin-right:72px; }
  .dash-topbar { background:var(--surface); border-bottom:1px solid var(--border); padding:0 24px; height:64px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:50; backdrop-filter:blur(12px); }
  .dash-content { padding:28px 24px; flex:1; }
  .dash-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; transition:box-shadow 0.2s,transform 0.2s; }
  .dash-card:hover { box-shadow:0 8px 32px rgba(79,70,229,0.08); }
  .nav-item { display:flex; align-items:center; gap:12px; padding:11px 18px; border-radius:12px; cursor:pointer; transition:all 0.2s; color:rgba(255,255,255,0.6); white-space:nowrap; overflow:hidden; margin:2px 10px; position:relative; }
  .nav-item:hover { background:rgba(255,255,255,0.08); color:white; }
  .nav-item.active { background:linear-gradient(135deg,rgba(99,102,241,0.4),rgba(139,92,246,0.25)); color:white; font-weight:700; }
  .nav-item.active::before { content:''; position:absolute; left:0; top:25%; bottom:25%; width:3px; background:linear-gradient(180deg,#818cf8,#c084fc); border-radius:0 4px 4px 0; }
  .dash-root.rtl .nav-item.active::before { left:auto; right:0; border-radius:4px 0 0 4px; }
  .dash-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; border:none; white-space:nowrap; }
  .dash-btn-primary { background:linear-gradient(135deg,#4f46e5,#7c3aed); color:white; box-shadow:0 4px 14px rgba(79,70,229,0.3); }
  .dash-btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(79,70,229,0.4); }
  .dash-btn-danger { background:#fee2e2; color:#dc2626; }
  .dash-btn-danger:hover { background:#fecaca; }
  .dash-btn-ghost { background:var(--surface2); color:var(--text2); border:1px solid var(--border); }
  .dash-btn-ghost:hover { background:var(--border); color:var(--text); }
  .dash-input { width:100%; border:1.5px solid var(--border); border-radius:10px; padding:10px 14px; font-size:14px; outline:none; transition:border-color 0.2s,box-shadow 0.2s; background:var(--surface); color:var(--text); }
  .dash-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(79,70,229,0.12); }
  .dash-ta { resize:vertical; min-height:80px; }
  .dash-label { display:block; font-size:11px; font-weight:700; color:var(--text2); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:6px; }
  .dash-img-preview { width:100%; height:140px; object-fit:cover; border-radius:12px; }
  .dash-cb { width:16px; height:16px; accent-color:var(--accent); cursor:pointer; }
  .dash-cb-label { font-size:14px; font-weight:600; color:var(--text); cursor:pointer; }
  .dash-form-actions { display:flex; gap:10px; padding-top:8px; }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .form-col { }
  .form-full { grid-column:1/-1; }
  .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:22px; display:flex; align-items:flex-start; gap:16px; transition:all 0.2s; overflow:hidden; position:relative; }
  .stat-card::after { content:''; position:absolute; inset:0; opacity:0.04; }
  .stat-card:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(79,70,229,0.1); }
  .stat-icon { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .row-header { display:grid; grid-template-columns:56px 1fr 115px 110px 110px; align-items:center; gap:12px; padding:12px 20px; background:var(--surface2); border-bottom:1px solid var(--border); }
  .news-row { display:grid; grid-template-columns:56px 1fr 115px 110px 110px; align-items:center; gap:12px; padding:13px 20px; border-bottom:1px solid var(--border); transition:background 0.15s; }
  .news-row:last-child { border-bottom:none; }
  .news-row:hover { background:var(--surface2); }
  .dash-badge { display:inline-flex; align-items:center; gap:4px; padding:4px 11px; border-radius:999px; font-size:11px; font-weight:700; }
  .badge-green { background:#dcfce7; color:#15803d; }
  .badge-gray { background:var(--surface2); color:var(--text2); border:1px solid var(--border); }
  .dash-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(6px); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn 0.2s ease; }
  .dash-modal { background:var(--surface); border:1px solid var(--border); border-radius:22px; width:100%; max-width:600px; max-height:90vh; overflow-y:auto; box-shadow:0 30px 80px rgba(0,0,0,0.3); animation:slideUp2 0.25s ease; }
  .dash-modal-header { display:flex; align-items:center; justify-content:space-between; padding:22px 24px; border-bottom:1px solid var(--border); }
  .dash-modal-title { font-size:17px; font-weight:800; color:var(--text); }
  .dash-modal-body { padding:24px; }
  .dash-icon-btn { padding:8px; border-radius:10px; border:none; background:transparent; color:var(--text2); cursor:pointer; transition:all 0.15s; display:flex; align-items:center; justify-content:center; }
  .dash-icon-btn:hover { background:var(--surface2); color:var(--text); }
  .school-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:14px; }
  .school-card { background:var(--surface); border:1.5px solid var(--border); border-radius:16px; padding:18px; display:flex; align-items:center; gap:14px; transition:all 0.2s; cursor:default; }
  .school-card:hover { border-color:var(--accent); box-shadow:0 6px 20px rgba(79,70,229,0.1); transform:translateY(-1px); }
  .hero-card { background:var(--surface); border:1.5px solid var(--border); border-radius:18px; overflow:hidden; transition:all 0.2s; }
  .hero-card:hover { border-color:var(--accent2); box-shadow:0 8px 24px rgba(79,70,229,0.1); }
  .toast { position:fixed; bottom:28px; right:28px; z-index:300; padding:14px 20px; border-radius:14px; font-size:14px; font-weight:600; display:flex; align-items:center; gap:10px; box-shadow:0 8px 30px rgba(0,0,0,0.2); animation:slideUp2 0.3s ease; }
  .dash-root.rtl .toast { right:auto; left:28px; }
  .toast-success { background:linear-gradient(135deg,#4f46e5,#7c3aed); color:white; }
  .toast-error { background:linear-gradient(135deg,#dc2626,#b91c1c); color:white; }
  .toggle-pill { display:flex; align-items:center; gap:0; background:var(--surface2); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
  .toggle-pill button { padding:8px 16px; font-size:13px; font-weight:600; border:none; cursor:pointer; background:transparent; color:var(--text2); transition:all 0.15s; }
  .toggle-pill button.active { background:linear-gradient(135deg,#4f46e5,#7c3aed); color:white; }
  .switch { position:relative; display:inline-block; width:44px; height:24px; }
  .switch input { opacity:0; width:0; height:0; }
  .slider { position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background:var(--border); border-radius:999px; transition:.3s; }
  .slider:before { position:absolute; content:""; height:18px; width:18px; left:3px; bottom:3px; background:white; border-radius:50%; transition:.3s; }
  input:checked + .slider { background:linear-gradient(135deg,#4f46e5,#7c3aed); }
  input:checked + .slider:before { transform:translateX(20px); }
  .section-enter { animation:fadeSlide 0.25s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp2 { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes fadeSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .glow-dot { width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 6px #10b981; animation:pulse2 2s infinite; }
  @keyframes pulse2 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
`;

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
    const { logout } = useAuth();
    const [section, setSection] = useState<Section>('overview');
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('dash-theme') as Theme) || 'light');
    const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('dash-lang') as Lang) || 'en');
    const [newsList, setNewsList] = useState<DashNewsItem[]>(initNews);
    const [schools, setSchools] = useState<DashSchool[]>(initSchools);
    const [hero, setHero] = useState<HeroSlide[]>(initHero);
    const [about, setAbout] = useState<AboutData>(initAbout);
    const [profile, setProfile] = useState<AdminProfile>({ name: 'Admin', email: 'admin@nis.edu.eg' });
    const [editNewsId, setEditNewsId] = useState<string | null>(null);
    const [addNewsOpen, setAddNewsOpen] = useState(false);
    const [editHeroId, setEditHeroId] = useState<number | null>(null);
    const [editSchoolId, setEditSchoolId] = useState<string | null>(null);
    const [editAbout, setEditAbout] = useState(false);
    const [newsSearch, setNewsSearch] = useState('');
    const [schoolSearch, setSchoolSearch] = useState('');
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [newArt, setNewArt] = useState<Partial<DashNewsItem>>({ title: '', titleAr: '', summary: '', summaryAr: '', date: '', image: '', published: true });
    const [profileDraft, setProfileDraft] = useState({ ...profile });

    const u = UI[lang];
    const isRTL = lang === 'ar';

    useEffect(() => {
        localStorage.setItem('dash-theme', theme);
        localStorage.setItem('dash-lang', lang);
    }, [theme, lang]);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Handlers
    const togglePublish = (id: string) => { setNewsList(p => p.map(n => n.id === id ? { ...n, published: !n.published } : n)); showToast(u.articleSaved); };
    const deleteNews = (id: string) => { setNewsList(p => p.filter(n => n.id !== id)); showToast(u.articleDeleted, 'error'); };
    const saveNews = (a: DashNewsItem) => { setNewsList(p => p.map(n => n.id === a.id ? a : n)); setEditNewsId(null); showToast(u.articleSaved); };
    const addNews = () => {
        if (!newArt.title || !newArt.date) return showToast(u.required, 'error');
        setNewsList(p => [{ id: String(Date.now()), title: newArt.title!, titleAr: newArt.titleAr || '', summary: newArt.summary || '', summaryAr: newArt.summaryAr || '', date: newArt.date!, image: newArt.image || `https://picsum.photos/seed/${Date.now()}/800/600`, published: newArt.published ?? true }, ...p]);
        setAddNewsOpen(false);
        setNewArt({ title: '', titleAr: '', summary: '', summaryAr: '', date: '', image: '', published: true });
        showToast(u.articleAdded);
    };
    const saveHero = (s: HeroSlide) => { setHero(p => p.map(h => h.id === s.id ? s : h)); setEditHeroId(null); showToast(u.slideSaved); };
    const saveSchool = (s: DashSchool) => { setSchools(p => p.map(sc => sc.id === s.id ? s : sc)); setEditSchoolId(null); showToast(u.schoolSaved); };

    const filtered = newsList.filter(n => n.title.toLowerCase().includes(newsSearch.toLowerCase()) || n.titleAr.includes(newsSearch));
    const filteredSchools = schools.filter(s => s.name.toLowerCase().includes(schoolSearch.toLowerCase()) || s.governorate.toLowerCase().includes(schoolSearch.toLowerCase()));
    const publishedCount = newsList.filter(n => n.published).length;

    const navItems: { id: Section; icon: React.ElementType }[] = [
        { id: 'overview', icon: LayoutDashboard }, { id: 'news', icon: Newspaper },
        { id: 'schools', icon: School }, { id: 'hero', icon: Image },
        { id: 'about', icon: Info }, { id: 'settings', icon: Settings },
    ];

    return (
        <div className={`dash-root \${theme === 'dark' ? 'dark' : ''} \${isRTL ? 'rtl' : ''}`}>
      <style>{CSS}</style>

      {/* Sidebar */}
      <aside className={`dash-sidebar \${collapsed ? 'collapsed' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#ef4444,#dc2626)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GraduationCap style={{ width: 20, height: 20, color: 'white' }} />
          </div>
          {!collapsed && <div><p style={{ color: 'white', fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>NIS Admin</p><p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Content Manager</p></div>}
        </div>
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {!collapsed && <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 20px', marginBottom: 6 }}>{u.overview}</p>}
          {navItems.filter(n => n.id !== 'settings').map(item => (
            <div key={item.id} className={`nav-item \${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)}>
              <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: 13 }}>{u[item.id as keyof typeof u] as string}</span>}
              {!collapsed && section === item.id && <ChevronRight style={{ width: 14, height: 14, marginLeft: 'auto', opacity: 0.5 }} />}
            </div>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: 8 }}>
          <div className={`nav-item \${section === 'settings' ? 'active' : ''}`} onClick={() => setSection('settings')}>
            <Settings style={{ width: 18, height: 18, flexShrink: 0 }} />{!collapsed && <span style={{ fontSize: 13 }}>{u.settings}</span>}
          </div>
          <div className="nav-item" onClick={logout}><LogOut style={{ width: 18, height: 18, flexShrink: 0 }} />{!collapsed && <span style={{ fontSize: 13 }}>{u.logout}</span>}</div>
        </div>
      </aside>

      {/* Main */}
      <div className={`dash-main \${collapsed ? 'collapsed' : ''}`}>
        {/* Topbar */}
        <header className="dash-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="dash-icon-btn" onClick={() => setCollapsed(!collapsed)}><Menu style={{ width: 20, height: 20 }} /></button>
            <div>
              <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', lineHeight: 1.2 }}>{u[section as keyof typeof u] as string}</p>
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
            <button className="dash-icon-btn" style={{ position: 'relative' }}>
              <Bell style={{ width: 18, height: 18 }} />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: '#ef4444', borderRadius: '50%' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 10, borderLeft: '1px solid var(--border)' }}>
              <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>AD</span>
              </div>
              <div style={{ display: 'none' }} className="sm-show">
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{profile.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text2)' }}>Super Admin</p>
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
                  { icon: Newspaper, label: u.totalArticles, val: String(newsList.length), color: '#4f46e5', bg: 'rgba(79,70,229,0.1)' },
                  { icon: CheckCircle, label: u.publishedCount, val: String(publishedCount), color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                  { icon: School, label: u.schoolsCount, val: '25', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
                  { icon: Users, label: u.studentsCount, val: '120k+', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                ].map(({ icon: Icon, label, val, color, bg }) => (
                  <div key={label} className="stat-card">
                    <div className="stat-icon" style={{ background: bg }}><Icon style={{ width: 22, height: 22, color }} /></div>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>{label}</p>
                      <p style={{ fontSize: 26, fontWeight: 900, color: 'var(--text)', lineHeight: 1.1 }}>{val}</p>
                      <p style={{ fontSize: 11, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}><TrendingUp style={{ width: 12, height: 12 }} />This year</p>
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
                  <button className="dash-btn dash-btn-ghost" onClick={() => setSection('about')}><Info style={{ width: 15, height: 15 }} />{u.updateAbout}</button>
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
                    <img src={n.image} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} alt="" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{n.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{n.date}</p>
                    </div>
                    <span className={`dash-badge \${n.published ? 'badge-green' : 'badge-gray'}`}>{n.published ? u.published : u.draft}</span>
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
                  <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{filtered.length} {u.newsManage} · {publishedCount} {u.publishedCount}</p>
                </div>
                <button className="dash-btn dash-btn-primary" onClick={() => setAddNewsOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.addArticle}</button>
              </div>
              <div style={{ position: 'relative', marginBottom: 16, maxWidth: 320 }}>
                <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 14, right: isRTL ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text2)' }} />
                <input className="dash-input" style={{ paddingLeft: isRTL ? 14 : 40, paddingRight: isRTL ? 40 : 14 }} placeholder={u.search} value={newsSearch} onChange={e => setNewsSearch(e.target.value)} />
              </div>
              <div className="dash-card" style={{ overflow: 'hidden' }}>
                <div className="row-header">
                  <div /><p className="dash-label" style={{ margin: 0 }}>{u.title}</p><p className="dash-label" style={{ margin: 0 }}>{u.date}</p><p className="dash-label" style={{ margin: 0 }}>{u.status}</p><p className="dash-label" style={{ margin: 0 }}>{u.actions}</p>
                </div>
                {filtered.map(n => (
                  <div key={n.id} className="news-row">
                    <img src={n.image} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover' }} alt="" />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{n.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{n.titleAr}</p>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text2)' }}>{n.date}</p>
                    <button className={`dash-badge \${n.published ? 'badge-green' : 'badge-gray'}`} style={{ cursor: 'pointer', border: 'none' }} onClick={() => togglePublish(n.id)}>{n.published ? u.published : u.draft}</button>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="dash-icon-btn" title={u.edit} onClick={() => setEditNewsId(n.id)}><Pencil style={{ width: 15, height: 15, color: 'var(--accent)' }} /></button>
                      <button className="dash-icon-btn" title={n.published ? 'Unpublish' : 'Publish'} onClick={() => togglePublish(n.id)}>{n.published ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}</button>
                      <button className="dash-icon-btn" title={u.delete} onClick={() => deleteNews(n.id)}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}><Newspaper style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>No articles found</p></div>}
              </div>
            </div>
          )}

          {/* ── Schools ── */}
          {section === 'schools' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.schools}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.schoolsManage}</p></div>
              </div>
              <div style={{ position: 'relative', marginBottom: 18, maxWidth: 320 }}>
                <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 14, right: isRTL ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text2)' }} />
                <input className="dash-input" style={{ paddingLeft: isRTL ? 14 : 40, paddingRight: isRTL ? 40 : 14 }} placeholder={u.search} value={schoolSearch} onChange={e => setSchoolSearch(e.target.value)} />
              </div>
              <div className="school-grid">
                {filteredSchools.map(s => (
                  <div key={s.id} className="school-card">
                    <img src={s.logo} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', background: 'var(--surface2)', flexShrink: 0 }} alt={s.name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}><MapPin style={{ width: 11, height: 11 }} />{s.location}, {s.governorate}</p>
                      <span style={{ marginTop: 6, display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(79,70,229,0.1)', color: 'var(--accent)' }}>{s.type}</span>
                    </div>
                    <button className="dash-icon-btn" onClick={() => setEditSchoolId(s.id)} title={u.edit}><Pencil style={{ width: 15, height: 15, color: 'var(--accent)' }} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Hero ── */}
          {section === 'hero' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.hero}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.heroManage}</p></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {hero.map((s, i) => (
                  <div key={s.id} className="hero-card">
                    {s.image && <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}><img src={s.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} /><div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} /><span style={{ position: 'absolute', bottom: 12, left: 16, right: 16, color: 'white', fontWeight: 800, fontSize: 18 }}>{s.title}</span></div>}
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

          {/* ── About ── */}
          {section === 'about' && (
            <div className="section-enter">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.about}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.aboutManage}</p></div>
                {!editAbout && <button className="dash-btn dash-btn-primary" onClick={() => setEditAbout(true)}><Pencil style={{ width: 14, height: 14 }} />{u.editSection}</button>}
              </div>
              {!editAbout ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[{ l: u.chairmanName, v: about.name }, { l: u.role, v: about.role }, { l: u.quote, v: `"\${about.quote}"` }, { l: u.description, v: about.desc }].map(({ l, v }) => (
                    <div key={l} className="dash-card" style={{ padding: 18 }}><p className="dash-label">{l}</p><p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.6 }}>{v}</p></div>
                  ))}
                  <div className="dash-card" style={{ padding: 18 }}><p className="dash-label">{u.keyPoints}</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>{about.points.map((p, i) => <span key={i} style={{ padding: '4px 14px', borderRadius: 999, background: 'rgba(79,70,229,0.1)', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>{p}</span>)}</div></div>
                </div>
              ) : (
                <div className="dash-card" style={{ padding: 24 }}>
                  <div className="form-grid">
                    <div><label className="dash-label">{u.chairmanName}</label><input className="dash-input" value={about.name} onChange={e => setAbout(a => ({ ...a, name: e.target.value }))} /></div>
                    <div><label className="dash-label">{u.role}</label><input className="dash-input" value={about.role} onChange={e => setAbout(a => ({ ...a, role: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.quote}</label><input className="dash-input" value={about.quote} onChange={e => setAbout(a => ({ ...a, quote: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.description}</label><textarea className="dash-input dash-ta" value={about.desc} onChange={e => setAbout(a => ({ ...a, desc: e.target.value }))} /></div>
                    <div className="form-full"><label className="dash-label">{u.keyPoints}</label><input className="dash-input" value={about.points.join(', ')} onChange={e => setAbout(a => ({ ...a, points: e.target.value.split(',').map(p => p.trim()).filter(Boolean) }))} /></div>
                    <div className="form-full dash-form-actions">
                      <button className="dash-btn dash-btn-primary" onClick={() => { setEditAbout(false); showToast(u.aboutSaved); }}><Save style={{ width: 14, height: 14 }} />{u.save}</button>
                      <button className="dash-btn dash-btn-ghost" onClick={() => setEditAbout(false)}>{u.cancel}</button>
                    </div>
                  </div>
                </div>
              )}
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
      {editNewsId && (() => { const a = newsList.find(n => n.id === editNewsId); return a ? <ModalWrap title={u.edit + ' — ' + a.title.slice(0, 30)} onClose={() => setEditNewsId(null)}><EditNewsForm article={a} lang={lang} onSave={saveNews} onCancel={() => setEditNewsId(null)} /></ModalWrap> : null; })()}

      {addNewsOpen && (
        <ModalWrap title={u.addArticle} onClose={() => setAddNewsOpen(false)}>
          <div className="form-grid">
            <div><label className="dash-label">{u.titleEn}</label><input className="dash-input" value={newArt.title || ''} onChange={e => setNewArt(p => ({ ...p, title: e.target.value }))} /></div>
            <div><label className="dash-label">{u.titleAr}</label><input className="dash-input" dir="rtl" value={newArt.titleAr || ''} onChange={e => setNewArt(p => ({ ...p, titleAr: e.target.value }))} /></div>
            <div><label className="dash-label">{u.summaryEn}</label><textarea className="dash-input dash-ta" value={newArt.summary || ''} onChange={e => setNewArt(p => ({ ...p, summary: e.target.value }))} /></div>
            <div><label className="dash-label">{u.summaryAr}</label><textarea className="dash-input dash-ta" dir="rtl" value={newArt.summaryAr || ''} onChange={e => setNewArt(p => ({ ...p, summaryAr: e.target.value }))} /></div>
            <div><label className="dash-label">{u.date}</label><input className="dash-input" type="date" value={newArt.date || ''} onChange={e => setNewArt(p => ({ ...p, date: e.target.value }))} /></div>
            <div><label className="dash-label">{u.imageUrl}</label><input className="dash-input" value={newArt.image || ''} onChange={e => setNewArt(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
            {newArt.image && <div className="form-full"><img src={newArt.image} alt="" className="dash-img-preview" onError={e => (e.currentTarget.style.display = 'none')} /></div>}
            <div className="form-full" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="np" checked={newArt.published !== false} onChange={e => setNewArt(p => ({ ...p, published: e.target.checked }))} className="dash-cb" />
              <label htmlFor="np" className="dash-cb-label">{u.publishNow}</label>
            </div>
            <div className="form-full dash-form-actions">
              <button className="dash-btn dash-btn-primary" onClick={addNews}><Save style={{ width: 14, height: 14 }} />{u.addArticle}</button>
              <button className="dash-btn dash-btn-ghost" onClick={() => setAddNewsOpen(false)}>{u.cancel}</button>
            </div>
          </div>
        </ModalWrap>
      )}

      {editHeroId !== null && (() => { const s = hero.find(h => h.id === editHeroId); return s ? <ModalWrap title={`\${u.edit} — \${u.hero} \${s.id}`} onClose={() => setEditHeroId(null)}><EditHeroForm slide={s} lang={lang} onSave={saveHero} onCancel={() => setEditHeroId(null)} /></ModalWrap> : null; })()}

      {editSchoolId && (() => { const s = schools.find(sc => sc.id === editSchoolId); return s ? <ModalWrap title={`\${u.edit} — \${s.name}`} onClose={() => setEditSchoolId(null)}><EditSchoolForm school={s} lang={lang} onSave={saveSchool} onCancel={() => setEditSchoolId(null)} /></ModalWrap> : null; })()}

      {/* Toast */}
      {toast && (
        <div className={`toast \${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.type === 'success' ? <CheckCircle style={{ width: 16, height: 16 }} /> : <AlertCircle style={{ width: 16, height: 16 }} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
