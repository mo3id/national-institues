import React from 'react';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Pagination from '../Pagination';

interface ContactMessagesSectionProps {
  contactMessages: any[];
  messagePage: number;
  messageTotalPages: number;
  setMessagePage: (v: number) => void;
  setSelectedContact: (v: any) => void;
  setContactModalOpen: (v: boolean) => void;
  deleteContactMessage: (id: string) => void;
  u: Record<string, string>;
  isRTL: boolean;
  lang: string;
  isTableLoading: boolean;
}

const ContactMessagesSection: React.FC<ContactMessagesSectionProps> = ({
  contactMessages, messagePage, messageTotalPages, setMessagePage, setSelectedContact, setContactModalOpen, deleteContactMessage, u, isRTL, lang, isTableLoading
}) => (
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
);

export default ContactMessagesSection;
