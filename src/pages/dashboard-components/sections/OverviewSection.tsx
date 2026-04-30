import React from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Image from 'lucide-react/dist/esm/icons/image';
import Users from 'lucide-react/dist/esm/icons/users';
import Info from 'lucide-react/dist/esm/icons/info';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import School from 'lucide-react/dist/esm/icons/school';
import type { DashNewsItem, Section } from '../types';

interface OverviewSectionProps {
  dashStats: {
    totalNews: number;
    publishedNews: number;
    schoolsCount: number;
    totalTeachers: number;
    totalStudents: number;
  };
  newsList: DashNewsItem[];
  setSection: (s: Section) => void;
  setAddNewsOpen: (v: boolean) => void;
  u: Record<string, string>;
  lang: string;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({
  dashStats, newsList, setSection, setAddNewsOpen, u, lang
}) => (
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
);

export default OverviewSection;
