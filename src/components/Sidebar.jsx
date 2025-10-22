import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Wallet,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, company, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/cari', icon: Users, label: 'Cari Hesaplar' },
    { path: '/cari-ekstre', icon: FileText, label: 'Cari Ekstre' },
    { path: '/stok', icon: Package, label: 'Stok Yönetimi' },
    { path: '/fatura', icon: FileText, label: 'Fatura İşlemleri' },
    { path: '/kasa', icon: Wallet, label: 'Kasa/Banka' },
    { path: '/raporlar', icon: BarChart3, label: 'Raporlar' },
    { path: '/ayarlar', icon: Settings, label: 'Ayarlar' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Hamburger Button (Mobile) */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Luka Muhasebe</h2>
          <p>{company?.name || 'Ön Muhasebe Sistemi'}</p>
          <button className="sidebar-close" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-name">{user?.full_name || 'Kullanıcı'}</p>
            <p className="user-email">{user?.email}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;