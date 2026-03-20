import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { API_BASE_URL } from '../api';
import { Home, HelpCircle, LogOut, RefreshCw, Power, RotateCcw, Search } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
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
      `}</style>

      {/* Sidebar */}
      <aside className="w-[200px] bg-[#000000] border-r border-[#1e1e2e] flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-4 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#388bfd] rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-white">Seculo</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3">
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-2 px-3 h-8 rounded text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1c2128] text-white border-l-[2px] border-[#388bfd]'
                        : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#1e1e2e]">
          <ul className="space-y-0.5">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className="w-full flex items-center gap-2 px-3 h-8 text-[13px] font-medium text-[#8b949e] hover:text-white hover:bg-[#161b22] rounded transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
          
          <div className="mt-4 pt-3 border-t border-[#1e1e2e]">
            <p className="text-[11px] text-[#8b949e] px-3 mb-2 truncate">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 h-8 text-[13px] font-medium text-[#8b949e] hover:text-white hover:bg-[#161b22] rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-[200px] flex flex-col min-h-screen">
        {/* Top Search Bar */}
        <div className="h-10 bg-[#000000] border-b border-[#1e1e2e] flex items-center px-4">
          <div className="flex items-center gap-2 flex-1 bg-[#010409] border border-[#1e1e2e] rounded px-2 h-6">
            <Search className="w-3 h-3 text-[#8b949e]" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent text-[12px] text-[#e6edf3] placeholder-[#8b949e] outline-none"
            />
          </div>
        </div>

        {/* Main Area */}
        <main className="flex-1 p-4">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-[16px] font-semibold text-[#e6edf3]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Dashboard</h1>
          </div>

          {/* Top Stats Row */}
          <div className="mb-4">
            <div className="flex items-stretch">
              <div className="flex-1 px-4 py-2 flex flex-col justify-center border-r border-[#1e1e2e]">
                <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-0.5">Bot Status</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${userData?.bot_status === 'running' ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} />
                  <span className="text-[18px] font-bold text-[#e6edf3]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {userData?.bot_status === 'running' ? 'LIVE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
              <div className="flex-1 px-4 py-2 flex flex-col justify-center border-r border-[#1e1e2e]">
                <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-0.5">Messages Today</p>
                <p className="text-[18px] font-bold text-[#e6edf3]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{messages}</p>
              </div>
              <div className="flex-1 px-4 py-2 flex flex-col justify-center border-r border-[#1e1e2e]">
                <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-0.5">Plan</p>
                <p className="text-[18px] font-bold text-[#e6edf3] capitalize" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{userData?.plan || 'Basic'}</p>
              </div>
              <div className="flex-1 px-4 py-2 flex flex-col justify-center">
                <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-0.5">WhatsApp</p>
                <p className="text-[18px] font-bold text-[#e6edf3]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{userData?.whatsapp_number || '—'}</p>
              </div>
            </div>
            <div className="border-b border-[#1e1e2e]"></div>
          </div>

          {/* Bot Status Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#3fb950] rounded-full" />
                <span className="text-[13px] font-medium text-[#3fb950]">LIVE</span>
                <span className="text-[11px] text-[#8b949e]">Uptime: {uptime}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-2.5 h-7 bg-[#388bfd] hover:bg-[#1f6feb] text-white text-[12px] font-medium rounded transition-colors">
                  <RotateCcw className="w-3 h-3" />
                  Restart Bot
                </button>
                <button className="flex items-center gap-1.5 px-2.5 h-7 border border-[#f85149]/50 hover:bg-[#f85149]/10 text-[#f85149] text-[12px] font-medium rounded transition-colors">
                  <Power className="w-3 h-3" />
                  Stop Bot
                </button>
              </div>
            </div>
            <div className="border-b border-[#1e1e2e]"></div>
          </div>

          {/* Recent Activity Section */}
          <div className="mb-6">
            <h2 className="text-[13px] font-semibold text-[#e6edf3] uppercase mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Recent Activity</h2>
            <div>
              {recentActivity.map((activity, idx) => (
                <div 
                  key={idx} 
                  className="py-2.5 border-b border-[#1a1a2a] last:border-b-0 hover:bg-[#0d0d18] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#388bfd] rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#e6edf3]">{activity.user}</p>
                      <p className="text-[12px] text-[#8b949e]">{activity.bot}</p>
                    </div>
                    <span className="text-[11px] text-[#8b949e]">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-b border-[#1e1e2e]"></div>
          </div>

          {/* WhatsApp Connection Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-0.5">Phone Number</p>
                <p className="text-[13px] font-medium text-[#e6edf3]">{userData?.whatsapp_number || '—'}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#3fb950] rounded-full" />
                  <span className="text-[12px] text-[#3fb950]">Connected</span>
                </span>
                <button className="flex items-center gap-1.5 px-2.5 h-7 border border-[#1e1e2e] hover:bg-[#0d0d18] text-[#8b949e] text-[12px] rounded transition-colors">
                  <RefreshCw className="w-3 h-3" />
                  Reconnect
                </button>
              </div>
            </div>
            <div className="border-b border-[#1e1e2e]"></div>
          </div>

          {/* API Settings Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-0.5">API Key</p>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#e6edf3] font-mono">
                    {userData?.gemini_api_key ? userData.gemini_api_key.slice(0, 20) + '••••••••' : '••••••••••••••••'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#3fb950] rounded-full" />
                  <span className="text-[12px] text-[#3fb950]">Active</span>
                </span>
                <button className="px-2.5 h-7 border border-[#1e1e2e] hover:bg-[#0d0d18] text-[#8b949e] text-[12px] rounded transition-colors">
                  Edit
                </button>
              </div>
            </div>
            <div className="border-b border-[#1e1e2e]"></div>
          </div>

          {/* Billing Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-0.5">Current Plan</p>
                  <p className="text-[13px] font-semibold text-[#e6edf3] capitalize">{userData?.plan || 'Basic'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-0.5">Price</p>
                  <p className="text-[13px] font-semibold text-[#e6edf3]">${userData?.plan === 'pro' ? '19' : '9'}<span className="text-[#8b949e] font-normal">/month</span></p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#8b949e] uppercase mb-0.5">Next Billing</p>
                  <p className="text-[13px] font-semibold text-[#e6edf3]">April 18, 2026</p>
                </div>
              </div>
              <button className="px-2.5 h-7 bg-[#388bfd] hover:bg-[#1f6feb] text-white text-[12px] font-medium rounded transition-colors">
                Upgrade Plan
              </button>
            </div>
            <div className="border-b border-[#1e1e2e]"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
