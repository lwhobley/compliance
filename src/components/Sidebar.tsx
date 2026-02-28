import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  Shield,
  Users,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Shield size={22} />
          </div>
          <div>
            <div className="sidebar-logo-text">ComplianceDaddy</div>
            <div className="sidebar-logo-sub">Hospitality Compliance</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav animate-enter-left">
          <div className="sidebar-group delay-1">
            <div className="sidebar-nav-label">OPERATIONS</div>
            <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`} onClick={() => setMobileOpen(false)}>
              <span className="sidebar-link-icon"><LayoutDashboard size={18} /></span>
              <span className="sidebar-link-label">Command Center</span>
              <ChevronRight size={14} className="sidebar-link-arrow" />
            </NavLink>
            <NavLink to="/checklists" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`} onClick={() => setMobileOpen(false)}>
              <span className="sidebar-link-icon"><ClipboardCheck size={18} /></span>
              <span className="sidebar-link-label">Daily Checklists</span>
              <span className="sidebar-link-badge">3</span>
            </NavLink>
            <NavLink to="/audits" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`} onClick={() => setMobileOpen(false)}>
              <span className="sidebar-link-icon"><FileText size={18} /></span>
              <span className="sidebar-link-label">State Audits</span>
              <ChevronRight size={14} className="sidebar-link-arrow" />
            </NavLink>
          </div>

          <div className="sidebar-group delay-2">
            <div className="sidebar-nav-label">COMPLIANCE VAULT</div>
            <NavLink to="/inspections" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`} onClick={() => setMobileOpen(false)}>
              <span className="sidebar-link-icon"><Shield size={18} /></span>
              <span className="sidebar-link-label">Inspection Logs</span>
              <ChevronRight size={14} className="sidebar-link-arrow" />
            </NavLink>
            <NavLink to="/certifications" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`} onClick={() => setMobileOpen(false)}>
              <span className="sidebar-link-icon"><Users size={18} /></span>
              <span className="sidebar-link-label">Staff Certs</span>
              <span className="sidebar-link-badge badge-pulse">2</span>
            </NavLink>

            <NavLink to="/incidents" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`} onClick={() => setMobileOpen(false)}>
              <span className="sidebar-link-icon"><AlertTriangle size={18} /></span>
              <span className="sidebar-link-label">Incident Reports</span>
              <ChevronRight size={14} className="sidebar-link-arrow" />
            </NavLink>
          </div>

          <div className="sidebar-group delay-3">
            <div className="sidebar-nav-label">EMERGENCY</div>
            <NavLink to="/inspector-mode" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''} sidebar-link--emergency`} onClick={() => setMobileOpen(false)}>
              <span className="sidebar-link-icon"><Shield size={18} /></span>
              <span className="sidebar-link-label">INSPECTOR MODE</span>
              <ChevronRight size={14} className="sidebar-link-arrow" />
            </NavLink>
          </div>

          <div className="sidebar-group delay-4">
            <div className="sidebar-nav-label">SYSTEM</div>
            <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`} onClick={() => setMobileOpen(false)}>
              <span className="sidebar-link-icon"><Settings size={18} /></span>
              <span className="sidebar-link-label">Settings</span>
              <ChevronRight size={14} className="sidebar-link-arrow" />
            </NavLink>
          </div>
        </nav>

        {/* User */}
        <div className="sidebar-footer animate-enter-left delay-5">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {(user?.firstName || user?.displayName)?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.displayName || 'User'}</div>
              <div className="sidebar-user-role">{user?.role || 'Admin'}</div>
            </div>
            <button className="sidebar-signout" onClick={handleSignOut} title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        .sidebar-mobile-toggle {
          display: none;
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 1001;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          color: var(--text-primary);
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 998;
        }

        @media (max-width: 768px) {
          .sidebar-mobile-toggle { display: flex; }
          .sidebar-overlay { display: block; }
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 260px;
          height: 100vh;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-default);
          display: flex;
          flex-direction: column;
          z-index: 999;
          transition: transform var(--transition-normal);
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar--open {
            transform: translateX(0);
          }
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px 20px;
          border-bottom: 1px solid var(--border-default);
        }

        .sidebar-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--gold-400), var(--gold-600));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--metal-950);
          flex-shrink: 0;
        }

        .sidebar-logo-text {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--gold-400), var(--cream-200));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-logo-sub {
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
        }

        .sidebar-group {
          margin-bottom: 24px;
        }

        .sidebar-nav-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          padding: 0 8px;
          margin-bottom: 8px;
        }

        .sidebar-link--emergency {
          border: 1px dashed rgba(251, 113, 133, 0.4);
          background: rgba(251, 113, 133, 0.05);
        }

        .sidebar-link--emergency:hover {
          background: rgba(251, 113, 133, 0.1);
          border-color: var(--accent-rose);
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all var(--transition-fast);
          margin-bottom: 2px;
        }

        .sidebar-link:hover {
          background: rgba(255,255,255,0.04);
          color: var(--text-primary);
        }

        .sidebar-link--active {
          background: rgba(212,175,55,0.1);
          color: var(--gold-400);
        }

        .sidebar-link--active .sidebar-link-icon {
          color: var(--gold-400);
        }

        .sidebar-link-icon {
          flex-shrink: 0;
          opacity: 0.7;
        }

        .sidebar-link--active .sidebar-link-icon {
          opacity: 1;
        }

        .sidebar-link-label {
          flex: 1;
        }

        .sidebar-link-badge {
          background: rgba(251,113,133,0.2);
          color: var(--accent-rose);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 100px;
        }

        .sidebar-link-arrow {
          opacity: 0;
          transition: opacity var(--transition-fast);
          color: var(--text-muted);
        }

        .sidebar-link:hover .sidebar-link-arrow {
          opacity: 1;
        }

        .sidebar-footer {
          padding: 12px;
          border-top: 1px solid var(--border-default);
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: var(--radius-md);
          background: var(--bg-elevated);
        }

        .sidebar-user-avatar {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, var(--gold-400), var(--gold-600));
          color: var(--metal-950);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-user-info {
          flex: 1;
          min-width: 0;
        }

        .sidebar-user-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-user-role {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        .sidebar-signout {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .sidebar-signout:hover {
          background: rgba(251,113,133,0.15);
          color: var(--accent-rose);
        }
      `}</style>
    </>
  );
}
