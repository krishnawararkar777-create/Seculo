import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { API_BASE_URL } from '../api';
import { Home, Bot, MessageCircle, Key, CreditCard, HelpCircle, LogOut, RefreshCw, Power, RotateCcw, Search } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'bot', label: 'Bot Status', icon: Bot },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'api', label: 'API Settings', icon: Key },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

const bottomMenuItems = [
  { id: 'support', label: 'Support', icon: HelpCircle },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [messages] = useState(247);
  const [uptime] = useState(99.8);
  const [recentActivity] = useState([
    { time: '2 min ago', user: 'What is AI?', bot: 'Artificial Intelligence is...' },
    { time: '15 min ago', user: 'Help me code', bot: 'I can help you with...' },
    { time: '1 hour ago', user: 'Weather in Mumbai', bot: 'Current weather...' },
    { time: '2 hours ago', user: 'Set reminder', bot: 'Reminder set for...' },
    { time: '3 hours ago', user: 'Book flight', bot: 'I found flights...' },
  ]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);

      const response = await fetch(`${API_BASE_URL}/dashboard/${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#21262d] border-t-[#388bfd] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010409] flex" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.08), 0 0 40px rgba(255, 255, 255, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.12), 0 0 60px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Sidebar */}
      <aside className="w-[220px] bg-[#0d1117] border-r border-[#21262d] flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-4 border-b border-[#21262d]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#388bfd] rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Seculo</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3">
          <p className="text-[11px] font-medium text-[#8b949e] uppercase tracking-wider mb-2 px-3">Navigation</p>
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 h-9 rounded text-[14px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1c2128] text-white border-l-[3px] border-[#388bfd]'
                        : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#21262d]">
          <p className="text-[11px] font-medium text-[#8b949e] uppercase tracking-wider mb-2 px-3">Account</p>
          <ul className="space-y-0.5">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 h-9 rounded text-[14px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1c2128] text-white border-l-[3px] border-[#388bfd]'
                        : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
          
          <div className="mt-4 pt-3 border-t border-[#21262d]">
            <p className="text-[12px] text-[#8b949e] px-3 mb-3">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 h-9 text-[14px] font-medium text-[#8b949e] hover:text-white hover:bg-[#161b22] rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">
        {/* Top Search Bar */}
        <div className="h-12 bg-[#0d1117] border-b border-[#21262d] flex items-center px-6">
          <div className="flex items-center gap-2 flex-1 bg-[#010409] border border-[#21262d] rounded-md px-3 h-8">
            <Search className="w-4 h-4 text-[#8b949e]" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent text-[14px] text-[#e6edf3] placeholder-[#8b949e] outline-none"
            />
          </div>
        </div>

        {/* Main Area */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[20px] font-semibold text-[#e6edf3]">Dashboard</h1>
          </div>

          {/* Stats - Direct on dark bg with dividers */}
          <div className="mb-6">
            <div className="flex items-stretch">
              <div className="flex-1 px-6 py-3 flex flex-col justify-center border-r border-[#21262d]">
                <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-1">Bot Status</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${userData?.bot_status === 'running' ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} />
                  <span className="text-[24px] font-bold text-[#ffffff]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {userData?.bot_status === 'running' ? 'LIVE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
              <div className="flex-1 px-6 py-3 flex flex-col justify-center border-r border-[#21262d]">
                <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-1">Messages Today</p>
                <p className="text-[24px] font-bold text-[#ffffff]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{messages}</p>
              </div>
              <div className="flex-1 px-6 py-3 flex flex-col justify-center border-r border-[#21262d]">
                <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-1">Plan</p>
                <p className="text-[24px] font-bold text-[#ffffff] capitalize" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{userData?.plan || 'Basic'}</p>
              </div>
              <div className="flex-1 px-6 py-3 flex flex-col justify-center">
                <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-1">WhatsApp</p>
                <p className="text-[24px] font-bold text-[#ffffff]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{userData?.whatsapp_number || '—'}</p>
              </div>
            </div>
            <div className="border-b border-[#21262d] mt-2"></div>
          </div>

          {/* Bot Status Section - Direct on dark bg */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-[#ffffff]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Bot Status</h2>
              <span className="text-[14px] text-[#8b949e]">Uptime: <span className="text-[#e6edf3] font-medium">{uptime}%</span></span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[#3fb950] rounded-full" />
              <span className="text-[14px] font-medium text-[#3fb950]">LIVE</span>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#388bfd] hover:bg-[#1f6feb] text-white text-[14px] font-medium rounded transition-colors">
                <RotateCcw className="w-4 h-4" />
                Restart Bot
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-[#f85149]/50 hover:bg-[#f85149]/10 text-[#f85149] text-[14px] font-medium rounded transition-colors">
                <Power className="w-4 h-4" />
                Stop Bot
              </button>
            </div>
            <div className="border-b border-[#21262d] mt-6"></div>
          </div>

          {/* Recent Activity - Glassmorphism */}
          <div className="mb-8">
            <h2 className="text-[16px] font-semibold text-[#ffffff] mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Recent Activity</h2>
            <div className="glass-card">
              <div>
                {recentActivity.map((activity, idx) => (
                  <div 
                    key={idx} 
                    className="px-4 py-3 border-b border-[#21262d]/50 last:border-b-0 hover:bg-[#161b22]/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#388bfd] rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-[#e6edf3]">{activity.user}</p>
                        <p className="text-[14px] text-[#8b949e]">{activity.bot}</p>
                      </div>
                      <span className="text-[14px] text-[#8b949e]">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp - Glassmorphism */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-[#ffffff]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>WhatsApp Connection</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#3fb950] rounded-full" />
                <span className="text-[14px] text-[#3fb950]">Connected</span>
              </div>
            </div>
            <div className="glass-card flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#8b949e] uppercase mb-1">Phone Number</p>
                <p className="text-[14px] font-medium text-[#e6edf3]">{userData?.whatsapp_number || '—'}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-[#21262d]/50 hover:bg-[#161b22]/50 text-[#8b949e] text-[14px] rounded transition-colors">
                <RefreshCw className="w-4 h-4" />
                Reconnect
              </button>
            </div>
          </div>

          {/* API Settings - Glassmorphism */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-[#ffffff]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>API Settings</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#3fb950] rounded-full" />
                <span className="text-[14px] text-[#3fb950]">Active</span>
              </div>
            </div>
            <div className="glass-card flex items-center gap-3">
              <div className="flex-1 bg-[#010409]/50 border border-[#21262d]/50 rounded px-3 py-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#8b949e]" />
                <code className="flex-1 text-[14px] text-[#8b949e] font-mono">
                  {userData?.gemini_api_key ? userData.gemini_api_key.slice(0, 20) + '••••••••' : '••••••••••••••••'}
                </code>
              </div>
              <button className="px-4 py-2 border border-[#21262d]/50 hover:bg-[#161b22]/50 text-[#8b949e] text-[14px] rounded transition-colors">
                Edit
              </button>
            </div>
          </div>

          {/* Billing - Glassmorphism */}
          <div className="mb-8">
            <h2 className="text-[16px] font-semibold text-[#ffffff] mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Billing</h2>
            <div className="glass-card">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[12px] font-medium text-[#8b949e] uppercase mb-1">Current Plan</p>
                  <p className="text-[14px] font-semibold text-[#e6edf3] capitalize">{userData?.plan || 'Basic'}</p>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-[#8b949e] uppercase mb-1">Price</p>
                  <p className="text-[14px] font-semibold text-[#e6edf3]">${userData?.plan === 'pro' ? '19' : '9'}<span className="text-[#8b949e] font-normal">/month</span></p>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-[#8b949e] uppercase mb-1">Next Billing</p>
                  <p className="text-[14px] font-semibold text-[#e6edf3]">April 18, 2026</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#21262d]/50">
                <button className="px-4 py-2 bg-[#388bfd] hover:bg-[#1f6feb] text-white text-[14px] font-medium rounded transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
