import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('whatsapp_number')
          .eq('id', session.user.id)
          .single();
        
        if (userData?.whatsapp_number) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e1e9] font-['Inter'] flex flex-col selection:bg-[#4ff07f] selection:text-[#003915]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .glass-card {
          background: rgba(31, 31, 37, 0.6);
          backdrop-filter: blur(20px);
          border: 0.5px solid rgba(42, 42, 58, 0.5);
        }
        .ambient-glow {
          background: radial-gradient(circle at 50% 50%, rgba(0, 93, 195, 0.08) 0%, transparent 70%);
        }
      `}</style>

      {/* Background Ambient Light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] ambient-glow opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] ambient-glow opacity-30"></div>
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50">
        <div className="flex justify-between items-center px-8 h-20 w-full max-w-7xl mx-auto">
          <button onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter text-white font-['Plus_Jakarta_Sans'] cursor-pointer bg-transparent border-none">
            Seculo
          </button>
          <div className="hidden md:flex gap-8">
            <a className="text-[#bbcbb9] hover:text-[#4ff07f] transition-colors duration-300 font-bold cursor-pointer" href="#">Support</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-24 relative z-10">
        <div className="w-full max-w-[480px] glass-card rounded-xl p-8 md:p-12 flex flex-col gap-8 shadow-2xl">
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-[#bbcbb9] text-sm">Enter your credentials to access the Obsidian Edition.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="flex flex-col gap-6">
            {error && (
              <div className="bg-[#93000a]/20 border border-[#ffb4ab]/50 text-[#ffb4ab] text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="font-['Inter'] text-sm text-[#bbcbb9] font-medium">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-[#111118] border-none rounded-lg px-4 text-[#e4e1e9] focus:ring-1 focus:ring-[#4ff07f] transition-all placeholder:text-[#39383e] outline-none"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-['Inter'] text-sm text-[#bbcbb9] font-medium">Password</label>
                <a className="text-[#4ff07f] text-xs font-semibold hover:underline cursor-pointer">Forgot Password?</a>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-[#111118] border-none rounded-lg px-4 text-[#e4e1e9] focus:ring-1 focus:ring-[#4ff07f] transition-all placeholder:text-[#39383e] outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-[#4ff07f] text-[#003915] font-['Plus_Jakarta_Sans'] text-[20px] font-bold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center shadow-[0_0_20px_rgba(79,240,127,0.2)] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-grow bg-[#3c4a3d] opacity-30"></div>
            <span className="text-xs text-[#bbcbb9] uppercase tracking-widest font-bold">Or continue with</span>
            <div className="h-px flex-grow bg-[#3c4a3d] opacity-30"></div>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full h-14 bg-[#1f1f25] border border-[#3c4a3d]/15 rounded-lg flex items-center justify-center gap-3 text-[#e4e1e9] hover:bg-[#2a292f] transition-colors group disabled:opacity-50 cursor-pointer"
          >
            <img
              alt="Google Logo"
              className="w-5 h-5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp6aoNJe_sO4TO0zLrMf-5_Q2FlCPgG2y0eLaYZYfd4g9e6_6sTKA-Tzkex9e2Jh8_l3Vrk5bYj1JmJLZoL7L4eIFC0l2_Ac4YMdfoSIWLI9-yMB8XlCRzqEdhaw7O0e-N49u1XbH2XbMacm7m785YrWWWAJRWWOCLqjUj327Ohe0P-S3gluTiKNJheEdSSXBGQ-GkamtiburkSyCFeFEMAQK0ORs6FUJPbSIozORXOCh8AeCTI107ox0LdiBD0Ntu81KFOcyZ5gGS"
            />
            <span className="font-semibold text-sm">Sign in with Google</span>
          </button>

          {/* Footer Link */}
          <div className="text-center">
            <p className="text-[#bbcbb9] text-sm">
              Don't have an account? 
              <button onClick={() => navigate('/signup')} className="text-[#4ff07f] font-bold hover:underline ml-1 cursor-pointer bg-transparent border-none">
                Create an account
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Branding Element */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 opacity-[0.02] pointer-events-none select-none z-0">
        <span className="font-['Plus_Jakarta_Sans'] text-[20vw] font-black tracking-tighter leading-none">SECULO</span>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-[#3c4a3d]/15 bg-[#0e0e13] relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto gap-4 font-['Inter'] text-sm tracking-normal">
          <span className="text-[#bbcbb9] opacity-80">© 2024 Seculo Obsidian Edition. Powered by AI.</span>
          <div className="flex gap-6">
            <a className="text-[#bbcbb9] hover:text-white transition-all opacity-80 hover:opacity-100 cursor-pointer" href="#">Privacy</a>
            <a className="text-[#bbcbb9] hover:text-white transition-all opacity-80 hover:opacity-100 cursor-pointer" href="#">Terms</a>
            <a className="text-[#bbcbb9] hover:text-white transition-all opacity-80 hover:opacity-100 cursor-pointer" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
