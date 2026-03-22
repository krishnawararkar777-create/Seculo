import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);

      const { data: data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user data:', error);
      } else {
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
    navigate('/login');
  };

  const getPlanDisplay = () => {
    if (!userData?.plan) return 'No Plan';
    return userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1);
  };

  const getPlanPrice = () => {
    if (userData?.plan === 'pro') return '$19';
    if (userData?.plan === 'basic') return '$9';
    return '$0';
  };

  const getNextBilling = () => {
    if (!userData?.created_at) return 'Not available';
    const date = new Date(userData.created_at);
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const maskPhone = (phone) => {
    if (!phone) return 'Not Set';
    if (phone.length <= 7) return phone;
    const visible = phone.slice(-7);
    return `+91 ${visible.slice(0, 5)}-${visible.slice(5)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#3c4a3d] border-t-[#4ff07f] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e4e1e9] font-['Inter']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .glass-panel {
          background: rgba(17, 17, 24, 0.4);
          backdrop-filter: blur(40px);
          border: 0.5px solid rgba(255, 255, 255, 0.1);
        }
        .radial-glow {
          background: radial-gradient(circle at center, rgba(79, 240, 127, 0.15) 0%, transparent 70%);
        }
        .text-glow {
          text-shadow: 0 0 10px rgba(79, 240, 127, 0.5);
        }
      `}</style>

      {/* Side Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 z-[60] bg-[#131318]/40 backdrop-blur-2xl border-r border-[#3c4a3d]/15 flex flex-col p-6 gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4ff07f]/20 rounded-lg flex items-center justify-center border border-[#4ff07f]/30">
            <span className="text-[#4ff07f] text-xl">🛡️</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-[#4ff07f] font-['Plus_Jakarta_Sans'] tracking-tighter">Seculo</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#bbcbb9] font-semibold">Enterprise AI</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[#4ff07f] bg-[#4ff07f]/10 rounded-lg font-['Plus_Jakarta_Sans'] font-semibold tracking-tight active:translate-x-1 duration-200">
            <span className="text-xl">🏠</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/logs" className="flex items-center gap-3 px-4 py-3 text-[#bbcbb9] hover:bg-[#1f1f25] hover:text-[#4ff07f] transition-all font-['Plus_Jakarta_Sans'] font-semibold tracking-tight active:translate-x-1 duration-200">
            <span className="text-xl">📋</span>
            <span>Message Logs</span>
          </Link>
          <Link to="/config" className="flex items-center gap-3 px-4 py-3 text-[#bbcbb9] hover:bg-[#1f1f25] hover:text-[#4ff07f] transition-all font-['Plus_Jakarta_Sans'] font-semibold tracking-tight active:translate-x-1 duration-200">
            <span className="text-xl">🧠</span>
            <span>AI Config</span>
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-[#bbcbb9] hover:bg-[#1f1f25] hover:text-[#4ff07f] transition-all font-['Plus_Jakarta_Sans'] font-semibold tracking-tight active:translate-x-1 duration-200">
            <span className="text-xl">⚙️</span>
            <span>Settings</span>
          </Link>
        </nav>

        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full bg-[#4ff07f] text-[#003915] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-['Plus_Jakarta_Sans']"
          >
            <span className="text-xl">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Top Navigation */}
      <header className="fixed top-0 left-64 right-0 h-20 z-50 bg-[#131318]/80 backdrop-blur-xl border-b border-[#3c4a3d]/15 flex justify-between items-center px-8">
        <div className="flex items-center flex-1 max-w-md">
          <div className="w-full bg-[#1b1b20] rounded-full px-4 py-2 flex items-center gap-3 border border-[#3c4a3d]/15">
            <span className="text-[#bbcbb9] text-sm">🔍</span>
            <input 
              className="bg-transparent border-none text-sm w-full focus:ring-0 text-[#e4e1e9]" 
              placeholder="Search system logs..." 
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#bbcbb9] hover:text-[#4ff07f] transition-colors">
              <span className="text-xl">🔔</span>
            </button>
            <button className="p-2 text-[#bbcbb9] hover:text-[#4ff07f] transition-colors">
              <span className="text-xl">⚡</span>
            </button>
          </div>
          <div className="h-8 w-[1px] bg-[#3c4a3d]/30"></div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-[#e4e1e9]">{user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-[10px] text-[#4ff07f] uppercase tracking-widest">{getPlanDisplay()} Tier</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#4ff07f]/20 border border-[#4ff07f]/30 flex items-center justify-center">
              <span className="text-[#4ff07f] font-bold text-sm">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 mt-20 p-8 min-h-screen relative">
        {/* Ambient Background Glows */}
        <div className="fixed top-1/4 left-1/3 w-[500px] h-[500px] radial-glow opacity-30 -z-10 pointer-events-none"></div>
        <div className="fixed bottom-1/4 right-1/4 w-[600px] h-[600px] radial-glow opacity-20 -z-10 pointer-events-none"></div>

        {/* Bot Status Bar */}
        <div className="flex justify-center mb-10">
          <div className="glass-panel px-8 py-3 rounded-full flex items-center gap-4 shadow-xl border-[#4ff07f]/20">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ff07f] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4ff07f]"></span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold tracking-[0.15em] text-[#4ff07f] text-sm">
              BOT STATUS: {userData?.bot_status === 'live' ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-12 gap-8">
          {/* Central QR Code Section */}
          <div className="col-span-12 lg:col-span-7 row-span-2">
            <div className="glass-panel h-full rounded-[2rem] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-[#4ff07f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 mb-8 p-6 bg-white rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                <img 
                  alt="WhatsApp Activation QR Code" 
                  className="w-48 h-48" 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=https://seculo.app/activate" 
                />
              </div>
              <h2 className="text-3xl font-['Plus_Jakarta_Sans'] font-extrabold text-[#e4e1e9] mb-4 tracking-tight">Activate Seculo AI</h2>
              <p className="text-[#bbcbb9] max-w-md mb-8 leading-relaxed">
                Scan this code with your WhatsApp app to activate the <span className="text-[#4ff07f] font-bold">Seculo AI engine</span>. Initializing will sync your logs and knowledge base.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-4 bg-[#4ff07f] text-[#003915] font-bold rounded-xl text-lg flex items-center gap-3 shadow-[0_10px_30px_rgba(79,240,127,0.3)] hover:scale-105 transition-transform font-['Plus_Jakarta_Sans']">
                  <span className="text-xl">📷</span>
                  Scan QR
                </button>
                <button className="px-8 py-4 border border-[#3c4a3d]/30 text-[#e4e1e9] font-bold rounded-xl text-lg hover:bg-white/5 transition-colors font-['Plus_Jakarta_Sans']">
                  Help Center
                </button>
              </div>
            </div>
          </div>

          {/* WhatsApp Connection Status */}
          <div className="col-span-12 lg:col-span-5">
            <div className="glass-panel rounded-[2rem] p-8 flex items-center justify-between group hover:border-[#4ff07f]/40 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#25d366]/10 flex items-center justify-center border border-[#25d366]/20">
                  <span className="text-[#25d366] text-3xl">💬</span>
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#e4e1e9]">WhatsApp Connection</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#4ff07f] font-bold">Connected</span>
                    <span className="text-[#4ff07f] text-sm">✅</span>
                    <span className="text-[#bbcbb9] text-sm ml-2">
                      {userData?.whatsapp_number ? maskPhone(userData.whatsapp_number) : 'Not configured'}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-[#bbcbb9] hover:text-[#ffb4ab] transition-colors p-2">
                <span className="text-xl">🚪</span>
              </button>
            </div>
          </div>

          {/* Gemini API Status */}
          <div className="col-span-12 lg:col-span-5">
            <div className="glass-panel rounded-[2rem] p-8 group hover:border-[#4ff07f]/40 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#acc7ff]/10 flex items-center justify-center border border-[#acc7ff]/20">
                    <span className="text-[#acc7ff] text-3xl">✨</span>
                  </div>
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#e4e1e9]">Gemini API Status</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {userData?.gemini_api_key ? (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-[#4ff07f] animate-pulse"></span>
                          <span className="text-[#4ff07f] text-sm font-bold uppercase tracking-widest">Valid & Active</span>
                        </>
                      ) : (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-[#ffb4ab]"></span>
                          <span className="text-[#ffb4ab] text-sm font-bold uppercase tracking-widest">Not Configured</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-[#2a292f] hover:bg-[#35343a] text-[#e4e1e9] text-sm font-bold rounded-xl border border-[#3c4a3d]/10 transition-all font-['Plus_Jakarta_Sans']">
                  Test Endpoint
                </button>
                <button className="flex-1 py-3 bg-[#4ff07f]/10 hover:bg-[#4ff07f]/20 text-[#4ff07f] text-sm font-bold rounded-xl border border-[#4ff07f]/20 transition-all flex items-center justify-center gap-2 font-['Plus_Jakarta_Sans']">
                  <span className="text-sm">🔄</span>
                  Rotate API Key
                </button>
              </div>
            </div>
          </div>

          {/* Plan Detail Card */}
          <div className="col-span-12">
            <div className="glass-panel rounded-[2rem] p-8 overflow-hidden relative">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#4ff07f]/5 rounded-full blur-[100px]"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center relative z-10">
                <div>
                  <p className="text-[#bbcbb9] text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Current Plan</p>
                  <h4 className="text-3xl font-['Plus_Jakarta_Sans'] font-extrabold text-[#e4e1e9]">
                    {getPlanDisplay()} <span className="text-sm font-medium text-[#4ff07f] ml-2">{getPlanPrice()}/mo</span>
                  </h4>
                </div>
                <div>
                  <p className="text-[#bbcbb9] text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Usage Limit</p>
                  <div className="flex items-end gap-2 mb-2">
                    <h4 className="text-2xl font-['Plus_Jakarta_Sans'] font-extrabold text-[#e4e1e9]">84%</h4>
                    <span className="text-[#bbcbb9] text-sm mb-1">/ UNLIMITED</span>
                  </div>
                  <div className="w-full h-2 bg-[#35343a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4ff07f] shadow-[0_0_10px_rgba(79,240,127,0.5)]" style={{ width: '84%' }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-[#bbcbb9] text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Next Billing</p>
                  <h4 className="text-xl font-['Plus_Jakarta_Sans'] font-bold text-[#e4e1e9]">{getNextBilling()}</h4>
                  <p className="text-[10px] text-[#bbcbb9]">Auto-renew active</p>
                </div>
                <div className="flex justify-end">
                  <button className="px-10 py-4 bg-[#4ff07f] text-[#003915] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(79,240,127,0.4)] transition-all font-['Plus_Jakarta_Sans']">
                    Manage Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer System Status */}
        <footer className="mt-12 flex justify-between items-center text-[#bbcbb9] text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ff07f]"></span>
              <span>Database: Latency 14ms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ff07f]"></span>
              <span>Auth: Synced</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#acc7ff]"></span>
              <span>v2.4.0-seculo</span>
            </div>
          </div>
          <p>© 2024 Seculo AI Enterprise. All rights secured.</p>
        </footer>
      </main>
    </div>
  );
}
