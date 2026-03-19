import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { API_BASE_URL } from '../api';
import { Home, Bot, MessageCircle, Key, CreditCard, HelpCircle, LogOut, Eye, EyeOff, RefreshCw, Power, RotateCcw, ChevronRight } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'bot', label: 'Bot Status', icon: Bot },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'api', label: 'API Settings', icon: Key },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'support', label: 'Support', icon: HelpCircle },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [messages, setMessages] = useState(247);
  const [uptime, setUptime] = useState(99.8);
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

  const toggleApiKey = () => setShowApiKey(!showApiKey);

  const maskApiKey = (key) => {
    if (!key) return '••••••••••••';
    return key.slice(0, 8) + '••••••••••••••••';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1e1e2e] border-t-[#155dfd] rounded-full animate-spin" />
      </div>
    );
  }

  const getUserName = () => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d0d14] border-r border-[#1e1e2e] flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#155dfd] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white">Seculo</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#155dfd]/10 text-[#155dfd] border-l-2 border-[#155dfd]'
                        : 'text-gray-400 hover:bg-[#1e1e2e] hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[#1e1e2e]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#155dfd] rounded-full flex items-center justify-center text-white font-semibold">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{getUserName()}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#1e1e2e] rounded-xl text-sm text-gray-400 hover:bg-[#1e1e2e] hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {getUserName()}!</h1>
          <p className="text-gray-500">Here's what's happening with your AI assistant</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5 hover:border-[#155dfd]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">Bot Status</span>
              <Bot className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${userData?.bot_status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-lg font-semibold ${userData?.bot_status === 'running' ? 'text-green-500' : 'text-red-500'}`}>
                {userData?.bot_status === 'running' ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5 hover:border-[#155dfd]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">Messages Today</span>
              <MessageCircle className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-white">{messages}</p>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5 hover:border-[#155dfd]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">Plan</span>
              <CreditCard className="w-5 h-5 text-gray-500" />
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              userData?.plan === 'pro' 
                ? 'bg-[#155dfd]/20 text-[#155dfd]' 
                : 'bg-green-500/20 text-green-500'
            }`}>
              {userData?.plan || 'Basic'}
            </span>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5 hover:border-[#155dfd]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">WhatsApp</span>
              <MessageCircle className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-lg font-semibold text-white">{userData?.whatsapp_number || 'Not connected'}</p>
          </div>
        </div>

        {/* Bot Status Section */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Bot Status</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-500 font-semibold text-lg">LIVE</span>
                </div>
                <span className="text-gray-500">|</span>
                <span className="text-gray-400">Uptime: <span className="text-white font-medium">{uptime}%</span></span>
              </div>

              <div className="bg-[#0d0d14] rounded-xl p-4 mb-4">
                <p className="text-gray-500 text-sm mb-2">Recent Activity</p>
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-[#111118] rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{activity.user}</p>
                        <p className="text-gray-500 text-xs truncate">{activity.bot}</p>
                      </div>
                      <span className="text-gray-600 text-xs">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#155dfd] hover:bg-[#104bc2] rounded-xl text-white font-medium transition-all">
                <RotateCcw className="w-4 h-4" />
                Restart Bot
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-500/50 hover:bg-red-500/10 rounded-xl text-red-500 font-medium transition-all">
                <Power className="w-4 h-4" />
                Stop Bot
              </button>
            </div>
          </div>
        </div>

        {/* WhatsApp Section */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">WhatsApp Connection</h2>
            <span className="flex items-center gap-2 text-green-500 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Phone Number</p>
              <p className="text-white font-medium">{userData?.whatsapp_number || 'Not connected'}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#1e1e2e] hover:bg-[#1e1e2e] rounded-xl text-gray-400 text-sm transition-all">
              <RefreshCw className="w-4 h-4" />
              Reconnect
            </button>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">API Settings</h2>
            <span className="flex items-center gap-2 text-green-500 text-sm bg-green-500/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Active
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-[#0d0d14] rounded-xl px-4 py-3 flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-500" />
              <code className="flex-1 text-gray-400 font-mono text-sm">
                {showApiKey ? (userData?.gemini_api_key || 'Not set') : maskApiKey(userData?.gemini_api_key)}
              </code>
              <button onClick={toggleApiKey} className="text-gray-500 hover:text-white transition-all">
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button className="px-4 py-2 border border-[#1e1e2e] hover:bg-[#1e1e2e] rounded-xl text-gray-400 text-sm transition-all">
              Edit
            </button>
          </div>
        </div>

        {/* Billing */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Billing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">Current Plan</p>
              <p className="text-white font-semibold text-lg capitalize">{userData?.plan || 'Basic'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Price</p>
              <p className="text-white font-semibold text-lg">
                ${userData?.plan === 'pro' ? '19' : '9'}<span className="text-gray-500 font-normal text-sm">/month</span>
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Next Billing</p>
              <p className="text-white font-semibold text-lg">April 18, 2026</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#1e1e2e]">
            <button className="px-6 py-3 bg-gradient-to-r from-[#155dfd] to-[#6366f1] hover:opacity-90 rounded-xl text-white font-medium transition-all">
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-[#0d0d14] rounded-xl hover:bg-[#1e1e2e] transition-all cursor-pointer">
                <div className="w-10 h-10 bg-[#155dfd]/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#155dfd]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{activity.user}</p>
                  <p className="text-gray-500 text-sm truncate">{activity.bot}</p>
                </div>
                <span className="text-gray-600 text-sm whitespace-nowrap">{activity.time}</span>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0d0d14] border-t border-[#1e1e2e] px-4 py-2 flex justify-around items-center">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl ${
                isActive ? 'text-[#155dfd]' : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
