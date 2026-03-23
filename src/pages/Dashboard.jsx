import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BotCard from '../components/BotCard';

const API_BASE_URL = 'https://seculo-2.onrender.com/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [messagesToday, setMessagesToday] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [restarting, setRestarting] = useState(false);
  const [restartMsg, setRestartMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const subscription = supabase
      .channel('users-realtime')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${user.id}`,
      }, (payload) => {
        setUserData(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);

  const fetchAllData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      setError('');

      const { data: data, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user data:', userError);
        setError('Could not load data. Please refresh.');
      } else {
        setUserData(data);
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      try {
        const { count, error: msgError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString());
        
        if (!msgError) {
          setMessagesToday(count || 0);
        }
      } catch (e) {
        console.log('Messages table not available');
      }

      try {
        const { data: lastMsg, error: lastError } = await supabase
          .from('messages')
          .select('created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (!lastError && lastMsg) {
          setLastMessage(lastMsg);
        }
      } catch (e) {
        console.log('Messages table not available');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Could not load data. Please refresh.');
    } finally {
      setLoading(false);
      setDataLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleRestart = async () => {
    if (!user) return;
    setRestarting(true);
    setRestartMsg('Restarting bot instance...');
    try {
      const response = await fetch(`${API_BASE_URL}/bot/restart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });
      const result = await response.json();
      if (response.ok) {
        setRestartMsg('Bot restarted successfully!');
        setTimeout(() => setRestartMsg(''), 3000);
      } else {
        setRestartMsg(`Error: ${result.error || 'Restart failed'}`);
        setTimeout(() => setRestartMsg(''), 5000);
      }
    } catch (err) {
      setRestartMsg('Network error - please try again');
      setTimeout(() => setRestartMsg(''), 5000);
    } finally {
      setRestarting(false);
    }
  };

  const getPlanDisplay = () => {
    if (!userData?.plan) return 'No Plan';
    return userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1) + ' Plan';
  };

  const getPlanPrice = () => {
    if (userData?.plan === 'pro') return '₹1,500';
    if (userData?.plan === 'basic') return '₹750';
    return '₹0';
  };

  const getNextBilling = () => {
    if (!userData?.created_at) return 'Not available';
    const date = new Date(userData.created_at);
    date.setDate(date.getDate() + 30);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getBotStatus = () => {
    if (userData?.bot_status === 'live') {
      return { status: 'Healthy', color: '#3ECF8E', dot: true };
    }
    if (userData?.bot_status === 'pending') {
      return { status: 'Setting Up', color: '#ffb956', dot: true };
    }
    return { status: 'Offline', color: '#ffb4ab', dot: false };
  };

  const getConnectionStatus = () => {
    if (userData?.bot_status === 'live') return 'Connected';
    return 'Disconnected';
  };

  const getApiStatus = () => {
    if (userData?.gemini_api_key && userData.gemini_api_key.trim() !== '') {
      return { status: 'Valid', color: '#3ECF8E', valid: true };
    }
    return { status: 'Not configured', color: '#ffb4ab', valid: false };
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserAvatar = () => {
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    if (user?.user_metadata?.picture) return user.user_metadata.picture;
    return null;
  };

  const getLastMessageTime = () => {
    if (!lastMessage?.created_at) return 'No messages yet';
    const msgDate = new Date(lastMessage.created_at);
    const now = new Date();
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const SkeletonBox = ({ width = '100%', height = 20 }) => (
    <div style={{
      width,
      height,
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: 4,
      animation: 'pulse 1.5s infinite',
    }} />
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#101010' }}>
        <div style={{ width: 24, height: 24, border: '2px solid #3d4a41', borderTopColor: '#3ECF8E', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const botStatus = getBotStatus();
  const apiStatus = getApiStatus();
  const userAvatar = getUserAvatar();
  const userName = getUserName();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#101010', color: '#ededed', fontFamily: 'Geist, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap');
        .mono-label { font-family: 'Geist Mono', monospace; font-size: 10px; font-weight: 500; text-transform: uppercase; color: #666; letter-spacing: 0.05em; }
        .data-mono { font-family: 'Geist Mono', monospace; }
        .ghost-border { border: 1px solid rgba(255,255,255,0.08); }
        .pulse-green { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .scan-line { height: 2px; background: #3ECF8E; width: 100%; position: absolute; top: 0; left: 0; box-shadow: 0 0 8px #3ECF8E; animation: scan 3s ease-in-out infinite; }
        @keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
      `}</style>

      {/* Side Navigation Bar */}
      <aside style={{ position: 'fixed', left: 0, top: 0, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, paddingBottom: 16, zIndex: 50, backgroundColor: '#141414', width: 48, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ marginBottom: 32, color: '#3ECF8E', fontWeight: 'bold', fontSize: 24 }}>
          ⌨️
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6, transition: 'all 0.2s', transform: 'scale(0.95)' }}
          >
            <span style={{ fontSize: 20 }}>🏠</span>
          </button>
          <button
            onClick={() => navigate('/logs')}
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', transform: 'scale(0.95)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >
            <span style={{ fontSize: 20 }}>📊</span>
          </button>
          <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', transform: 'scale(0.95)' }}>
            <span style={{ fontSize: 20 }}>⌨️</span>
          </button>
          <button
            onClick={() => navigate('/settings')}
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', transform: 'scale(0.95)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >
            <span style={{ fontSize: 20 }}>🔒</span>
          </button>
          <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', transform: 'scale(0.95)' }}>
            <span style={{ fontSize: 20 }}>🗄️</span>
          </button>
          <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', transform: 'scale(0.95)' }}>
            <span style={{ fontSize: 16, fontStyle: 'italic' }}>𝑓</span>
          </button>
          <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', transform: 'scale(0.95)' }}>
            <span style={{ fontSize: 20 }}>📡</span>
          </button>
          <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', transform: 'scale(0.95)' }}>
            <span style={{ fontSize: 20 }}>📈</span>
          </button>
          <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', transform: 'scale(0.95)' }}>
            <span style={{ fontSize: 20 }}>📄</span>
          </button>
        </nav>
        <button
          onClick={handleLogout}
          style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', transform: 'scale(0.95)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
        >
          <span style={{ fontSize: 20 }}>⚙️</span>
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 48, backgroundColor: '#101010' }}>
        {/* Top Nav Bar */}
        <header style={{ position: 'fixed', top: 0, right: 0, left: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', zIndex: 40, height: 48, backgroundColor: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h1 style={{ color: '#ededed', fontWeight: 600, fontSize: 14 }}>Seculo Bot</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)', fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>
              <span>Seculo Org</span>
              <span style={{ fontSize: 12 }}>›</span>
              <span>main</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', fontSize: 10, fontFamily: 'Geist Mono, monospace', textTransform: 'uppercase', color: '#3ECF8E', letterSpacing: '0.05em' }}>Production</div>
            <div style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.6)' }}>
              <span style={{ fontSize: 20, cursor: 'pointer' }}>🔔</span>
              <span style={{ fontSize: 20, cursor: 'pointer' }}>❓</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#ededed' }}>{userName}</p>
                <p style={{ fontSize: 10, color: '#3ECF8E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{getPlanDisplay()}</p>
              </div>
              {userAvatar ? (
                <img src={userAvatar} alt={userName} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#3ECF8E' }}>{userName[0]?.toUpperCase() || 'U'}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ marginTop: 48, padding: 32, maxWidth: 1400, marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Error Banner */}
          {error && (
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255,180,171,0.1)', border: '1px solid rgba(255,180,171,0.3)', borderRadius: 8, color: '#ffb4ab', fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>
              {error}
            </div>
          )}

          {/* Dashboard Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: '#ededed' }}>Seculo WhatsApp Bot</h2>
              {dataLoading ? (
                <SkeletonBox width={200} height={14} />
              ) : (
                <p style={{ color: '#a0a0a0', fontSize: 12, fontFamily: 'Geist Mono, monospace' }}>ID: SEC-WA-{user?.id?.slice(0,8).toUpperCase() || 'USER'}-{getPlanDisplay().split(' ')[0].toUpperCase()}</p>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleRestart}
                disabled={restarting}
                style={{ padding: '6px 16px', backgroundColor: '#3ECF8E', color: '#003822', fontSize: 12, fontWeight: 600, borderRadius: 6, transition: 'all 0.2s', opacity: restarting ? 0.6 : 1, cursor: restarting ? 'not-allowed' : 'pointer', border: 'none' }}
              >
                {restarting ? 'Restarting...' : 'RESTART INSTANCE'}
              </button>
              <button
                onClick={() => navigate('/logs')}
                style={{ padding: '6px 16px', border: '1px solid rgba(255,255,255,0.08)', color: '#ededed', fontSize: 12, fontWeight: 600, borderRadius: 6, transition: 'all 0.2s', cursor: 'pointer', backgroundColor: 'transparent' }}
              >
                VIEW LOGS
              </button>
            </div>
          </div>

          {/* Restart Message */}
          {restartMsg && (
            <div style={{ padding: '12px 16px', backgroundColor: restartMsg.includes('Error') || restartMsg.includes('Network') ? 'rgba(255,180,171,0.1)' : 'rgba(62,207,142,0.1)', border: `1px solid ${restartMsg.includes('Error') || restartMsg.includes('Network') ? 'rgba(255,180,171,0.3)' : 'rgba(62,207,142,0.3)'}`, borderRadius: 8, color: restartMsg.includes('Error') || restartMsg.includes('Network') ? '#ffb4ab' : '#3ECF8E', fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>
              {restartMsg}
            </div>
          )}

          {/* Status Grid & DB Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
            {/* Status 2x2 */}
            <div style={{ gridColumn: 'span 12 / span 4', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ backgroundColor: '#141414', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 120 }}>
                <span className="mono-label">BOT STATUS</span>
                {dataLoading ? (
                  <SkeletonBox width={80} height={20} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: botStatus.color, animation: botStatus.dot ? 'pulse 2s infinite' : 'none' }}></div>
                    <span style={{ fontSize: 18, fontWeight: 500, color: '#ededed' }}>{botStatus.status}</span>
                  </div>
                )}
              </div>
              <div style={{ backgroundColor: '#141414', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 120 }}>
                <span className="mono-label">LAST MESSAGE</span>
                {dataLoading ? (
                  <SkeletonBox width={60} height={20} />
                ) : (
                  <span style={{ fontSize: 18, fontFamily: 'Geist Mono, monospace', color: '#ededed' }}>{getLastMessageTime()}</span>
                )}
              </div>
              <div style={{ backgroundColor: '#141414', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 120 }}>
                <span className="mono-label">CONNECTION</span>
                {dataLoading ? (
                  <SkeletonBox width={100} height={20} />
                ) : (
                  <span style={{ fontSize: 18, fontWeight: 500, color: '#ededed' }}>{getConnectionStatus()}</span>
                )}
              </div>
              <div style={{ backgroundColor: '#141414', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 120 }}>
                <span className="mono-label">GEMINI KEY</span>
                {dataLoading ? (
                  <SkeletonBox width={60} height={20} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: apiStatus.color }}>
                    <span style={{ fontSize: 18 }}>{apiStatus.valid ? '✅' : '❌'}</span>
                    <span style={{ fontSize: 18, fontWeight: 500 }}>{apiStatus.status}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Primary DB Card */}
            <div style={{ gridColumn: 'span 12 / span 8', backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="mono-label">DATABASE CLUSTER</span>
                  <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 4, color: '#ededed' }}>WhatsApp Connection</h3>
                </div>
                <div style={{ padding: '4px 12px', backgroundColor: 'rgba(62,207,142,0.1)', border: '1px solid rgba(62,207,142,0.2)', color: '#3ECF8E', fontSize: 10, fontFamily: 'Geist Mono, monospace', borderRadius: '9999px' }}>ACTIVE NODE</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 32 }}>
                <div>
                  <span className="mono-label">LINKED NUMBER</span>
                  {dataLoading ? (
                    <SkeletonBox width={120} height={16} />
                  ) : (
                    <p className="data-mono" style={{ fontSize: 14, marginTop: 4, color: '#ededed' }}>{userData?.whatsapp_number || 'Not configured'}</p>
                  )}
                </div>
                <div>
                  <span className="mono-label">REGION</span>
                  <p className="data-mono" style={{ fontSize: 14, marginTop: 4, color: '#ededed' }}>South Asia Mumbai</p>
                </div>
                <div>
                  <span className="mono-label">LATENCY</span>
                  <p className="data-mono" style={{ fontSize: 14, marginTop: 4, color: '#3ECF8E' }}>14ms</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monitor & QR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
            {/* Real-Time Monitor */}
            <div style={{ gridColumn: 'span 12 / span 7', backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="mono-label">BOT STATUS REAL-TIME</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 8px', backgroundColor: userData?.bot_status === 'live' ? 'rgba(62,207,142,0.1)' : 'rgba(255,80,80,0.1)', borderRadius: 4, border: `1px solid ${userData?.bot_status === 'live' ? 'rgba(62,207,142,0.2)' : 'rgba(255,80,80,0.2)'}` }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: userData?.bot_status === 'live' ? '#3ECF8E' : '#ff5050', animation: userData?.bot_status === 'live' ? 'pulse 1s infinite' : 'none' }}></span>
                    <span style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: userData?.bot_status === 'live' ? '#3ECF8E' : '#ff5050', fontWeight: 'bold' }}>{userData?.bot_status === 'live' ? 'LIVE' : 'OFFLINE'}</span>
                  </div>
                </div>
                <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.2)' }}>⋮</span>
              </div>
              <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '30%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '45%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '60%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '40%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '80%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
                <div style={{ flex: 1, backgroundColor: 'rgba(62,207,142,0.2)', height: '95%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '70%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '50%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '65%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '85%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '30%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', height: '20%', borderTopLeftRadius: 4, borderTopRightRadius: 4, transition: 'all 0.2s' }}></div>
              </div>
            </div>

            {/* Bot Control */}
            <div style={{ gridColumn: 'span 12 / span 5', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <BotCard />

              {/* Plan Details */}
              <div style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <span className="mono-label">BILLING PLAN</span>
                    {dataLoading ? (
                      <SkeletonBox width={100} height={18} />
                    ) : (
                      <h4 style={{ color: '#ededed', fontWeight: 600, marginTop: 4 }}>{getPlanDisplay()}</h4>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="mono-label">COST</span>
                    {dataLoading ? (
                      <SkeletonBox width={60} height={16} />
                    ) : (
                      <p style={{ color: '#ededed', fontFamily: 'Geist Mono, monospace', fontSize: 14 }}>{getPlanPrice()}/mo</p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'Geist Mono, monospace', color: '#666' }}>
                    <span>USAGE METER</span>
                    <span style={{ color: '#ededed' }}>84%</span>
                  </div>
                  <div style={{ width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#3ECF8E', height: '100%', width: '84%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Core & Conversations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
            {/* AI Core */}
            <div style={{ gridColumn: 'span 12 / span 4', backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 20, color: '#3ECF8E' }}>✨</span>
                  <span className="mono-label">AI CORE ENGINE</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#ededed' }}>Gemini 1.5 Pro</h3>
                {dataLoading ? (
                  <SkeletonBox width={140} height={14} />
                ) : (
                  <p style={{ color: '#666', fontSize: 12, marginTop: 8, fontFamily: 'Geist Mono, monospace' }}>Current key validation: {apiStatus.valid ? 'Success' : 'Not configured'}</p>
                )}
              </div>
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#a0a0a0' }}>Tokens Processed</span>
                  <span style={{ fontSize: 12, fontFamily: 'Geist Mono, monospace', color: '#ededed' }}>1.2M</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#a0a0a0' }}>Response Latency</span>
                  <span style={{ fontSize: 12, fontFamily: 'Geist Mono, monospace', color: '#3ECF8E' }}>840ms</span>
                </div>
              </div>
            </div>

            {/* Recent Conversations */}
            <div style={{ gridColumn: 'span 12 / span 8', backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono-label">RECENT CONVERSATIONS</span>
                <button style={{ fontSize: 10, fontFamily: 'Geist Mono, monospace', color: '#3ECF8E', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>VIEW ALL</button>
              </div>
              <div style={{ padding: '24px', textAlign: 'center', color: '#666', fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>
                Conversations will appear here once you start chatting with your WhatsApp bot.
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12, fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer', backgroundColor: 'transparent', color: '#ededed' }}>
              <span style={{ fontSize: 14 }}>🔄</span> Clear Cache
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12, fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer', backgroundColor: 'transparent', color: '#ededed' }}>
              <span style={{ fontSize: 14 }}>⌨️</span> CLI Access
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12, fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer', backgroundColor: 'transparent', color: '#ededed' }}>
              <span style={{ fontSize: 14 }}>⬇️</span> Export History
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12, fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer', backgroundColor: 'transparent', color: '#ededed' }}>
              <span style={{ fontSize: 14 }}>📢</span> Broadcast Message
            </button>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <footer style={{ position: 'fixed', bottom: 0, right: 0, left: 48, height: 48, backgroundColor: '#141414', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mono-label">MESSAGES TODAY:</span>
              {dataLoading ? (
                <SkeletonBox width={40} height={12} />
              ) : (
                <span style={{ fontSize: 12, fontFamily: 'Geist Mono, monospace', color: '#3ECF8E' }}>{messagesToday.toLocaleString()}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mono-label">CONNECTION:</span>
              {dataLoading ? (
                <SkeletonBox width={80} height={12} />
              ) : (
                <span style={{ fontSize: 12, fontFamily: 'Geist Mono, monospace', color: userData?.bot_status === 'live' ? '#3ECF8E' : '#ffb4ab' }}>{getConnectionStatus()}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mono-label">NEXT BILLING:</span>
              {dataLoading ? (
                <SkeletonBox width={80} height={12} />
              ) : (
                <span style={{ fontSize: 12, fontFamily: 'Geist Mono, monospace', color: '#ededed' }}>{getNextBilling()}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#666', fontSize: 10, fontFamily: 'Geist Mono, monospace' }}>
            <span>{currentTime.toLocaleTimeString()}</span>
            <span>SYSTEM UPTIME: 99.99%</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3ECF8E' }}></span>
          </div>
        </footer>
      </main>
    </div>
  );
}
