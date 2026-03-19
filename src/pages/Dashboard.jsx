import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { API_BASE_URL } from '../api';
import { Home, Bot, MessageCircle, Key, CreditCard, HelpCircle, LogOut, RefreshCw, Power, RotateCcw } from 'lucide-react';

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
    <div className="min-h-screen bg-[#010409] flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
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
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-[13px] transition-colors ${
                      isActive
                        ? 'text-white border-l-[3px] border-[#388bfd] -ml-[3px] pl-[15px]'
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
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-[13px] transition-colors ${
                      isActive
                        ? 'text-white border-l-[3px] border-[#388bfd] -ml-[3px] pl-[15px]'
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
            <div className="px-3 mb-2">
              <p className="text-[12px] text-[#8b949e] truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#8b949e] hover:text-white hover:bg-[#161b22] rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[220px] p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[20px] font-semibold text-[#e6edf3]">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0d1117] border border-[#21262d] rounded-md p-4">
            <p className="text-[12px] font-medium text-[#8b949e] uppercase mb-1">Bot Status</p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${userData?.bot_status === 'running' ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} />
              <span className={`text-[14px] font-semibold ${userData?.bot_status === 'running' ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                {userData?.bot_status === 'running' ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
          </div>

          <div className="bg-[#0d1117] border border-[#21262d] rounded-md p-4">
            <p className="text-[12px] font-medium text-[#8b949e] uppercase mb-1">Messages Today</p>
            <p className="text-[24px] font-bold text-[#e6edf3]">{messages}</p>
          </div>

          <div className="bg-[#0d1117] border border-[#21262d] rounded-md p-4">
            <p className="text-[12px] font-medium text-[#8b949e] uppercase mb-1">Plan</p>
            <span className={`inline-block text-[14px] font-semibold px-2 py-0.5 rounded ${
              userData?.plan === 'pro' 
                ? 'bg-[#388bfd]/20 text-[#388bfd]' 
                : 'bg-[#3fb950]/20 text-[#3fb950]'
            }`}>
              {userData?.plan || 'Basic'}
            </span>
          </div>

          <div className="bg-[#0d1117] border border-[#21262d] rounded-md p-4">
            <p className="text-[12px] font-medium text-[#8b949e] uppercase mb-1">WhatsApp</p>
            <p className="text-[14px] font-medium text-[#e6edf3]">{userData?.whatsapp_number || '—'}</p>
          </div>
        </div>

        {/* Bot Status Section */}
        <div className="bg-[#0d1117] border border-[#21262d] rounded-md mb-6">
          <div className="px-4 py-3 border-b border-[#21262d] flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#e6edf3]">Bot Status</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#3fb950] rounded-full animate-pulse" />
                <span className="text-[14px] text-[#3fb950] font-medium">LIVE</span>
              </div>
              <span className="text-[14px] text-[#8b949e]">Uptime: <span className="text-[#e6edf3] font-medium">{uptime}%</span></span>
            </div>
          </div>
          <div className="p-4">
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
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0d1117] border border-[#21262d] rounded-md">
          <div className="px-4 py-3 border-b border-[#21262d]">
            <h2 className="text-[16px] font-semibold text-[#e6edf3]">Recent Activity</h2>
          </div>
          <div>
            {recentActivity.map((activity, idx) => (
              <div 
                key={idx} 
                className="px-4 py-3 border-b border-[#21262d] last:border-b-0 hover:bg-[#161b22] transition-colors cursor-pointer flex items-center gap-4"
              >
                <MessageCircle className="w-4 h-4 text-[#8b949e]" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-[#e6edf3] truncate">{activity.user}</p>
                  <p className="text-[12px] text-[#8b949e] truncate">{activity.bot}</p>
                </div>
                <span className="text-[12px] text-[#8b949e] whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Section */}
        <div className="bg-[#0d1117] border border-[#21262d] rounded-md mt-6">
          <div className="px-4 py-3 border-b border-[#21262d] flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#e6edf3]">WhatsApp Connection</h2>
            <span className="flex items-center gap-2 text-[14px] text-[#3fb950]">
              <span className="w-2 h-2 bg-[#3fb950] rounded-full" />
              Connected
            </span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[12px] text-[#8b949e] uppercase mb-1">Phone Number</p>
              <p className="text-[14px] font-medium text-[#e6edf3]">{userData?.whatsapp_number || '—'}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#21262d] hover:bg-[#161b22] text-[#8b949e] text-[14px] rounded transition-colors">
              <RefreshCw className="w-4 h-4" />
              Reconnect
            </button>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-[#0d1117] border border-[#21262d] rounded-md mt-6">
          <div className="px-4 py-3 border-b border-[#21262d] flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#e6edf3]">API Settings</h2>
            <span className="flex items-center gap-2 text-[14px] text-[#3fb950] bg-[#3fb950]/10 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 bg-[#3fb950] rounded-full" />
              Active
            </span>
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="flex-1 bg-[#010409] border border-[#21262d] rounded px-3 py-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#8b949e]" />
              <code className="flex-1 text-[14px] text-[#8b949e] font-mono">
                {userData?.gemini_api_key ? userData.gemini_api_key.slice(0, 20) + '••••••••' : '••••••••••••••••'}
              </code>
            </div>
            <button className="px-4 py-2 border border-[#21262d] hover:bg-[#161b22] text-[#8b949e] text-[14px] rounded transition-colors">
              Edit
            </button>
          </div>
        </div>

        {/* Billing */}
        <div className="bg-[#0d1117] border border-[#21262d] rounded-md mt-6">
          <div className="px-4 py-3 border-b border-[#21262d]">
            <h2 className="text-[16px] font-semibold text-[#e6edf3]">Billing</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-[12px] text-[#8b949e] uppercase mb-1">Current Plan</p>
                <p className="text-[14px] font-semibold text-[#e6edf3] capitalize">{userData?.plan || 'Basic'}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#8b949e] uppercase mb-1">Price</p>
                <p className="text-[14px] font-semibold text-[#e6edf3]">${userData?.plan === 'pro' ? '19' : '9'}<span className="text-[#8b949e] font-normal">/month</span></p>
              </div>
              <div>
                <p className="text-[12px] text-[#8b949e] uppercase mb-1">Next Billing</p>
                <p className="text-[14px] font-semibold text-[#e6edf3]">April 18, 2026</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#21262d]">
              <button className="px-4 py-2 bg-[#388bfd] hover:bg-[#1f6feb] text-white text-[14px] font-medium rounded transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
