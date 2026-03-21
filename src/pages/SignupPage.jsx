import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) throw error;
      alert('Check your email for the confirmation link!');
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
    <div className="min-h-screen bg-[#0a0a0f] font-['Inter'] text-[#e4e1e9] flex flex-col items-center justify-center relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .obsidian-card {
          background-color: #131318;
          border: 0.5px solid #2a2a3a;
        }
        .glass-flare {
          background: radial-gradient(circle at 50% 50%, rgba(79, 240, 127, 0.08) 0%, transparent 70%);
        }
      `}</style>

      {/* Ambient Lighting Background */}
      <div className="absolute top-0 left-0 w-full h-full glass-flare pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#005dc3]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#4ff07f]/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Content */}
      <main className="w-full max-w-lg px-6 relative z-10 py-12">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer bg-transparent border-none">
            <div className="w-10 h-10 bg-[#4ff07f] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[#003915]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl tracking-tighter text-white">Seculo</span>
          </button>
        </div>

        {/* Registration Card */}
        <div className="obsidian-card rounded-xl p-8 md:p-10 shadow-2xl">
          <header className="mb-8 text-center">
            <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-white tracking-tight mb-2">Create Account</h1>
            <p className="text-[#bbcbb9] font-medium">Join the next generation of security.</p>
          </header>

          <form onSubmit={handleSignUp} className="space-y-5">
            {error && (
              <div className="bg-[#93000a]/20 border border-[#ffb4ab]/50 text-[#ffb4ab] text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label className="block text-[#bbcbb9] text-sm font-medium mb-2 ml-1">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#bbcbb9] text-[20px]">person</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#3c4a3d]/30 rounded-lg py-3.5 pl-12 pr-4 text-[#e4e1e9] focus:outline-none focus:border-[#4ff07f] focus:ring-1 focus:ring-[#4ff07f] transition-all placeholder:text-[#bbcbb9]/40"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[#bbcbb9] text-sm font-medium mb-2 ml-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#bbcbb9] text-[20px]">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#3c4a3d]/30 rounded-lg py-3.5 pl-12 pr-4 text-[#e4e1e9] focus:outline-none focus:border-[#4ff07f] focus:ring-1 focus:ring-[#4ff07f] transition-all placeholder:text-[#bbcbb9]/40"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[#bbcbb9] text-sm font-medium mb-2 ml-1">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#bbcbb9] text-[20px]">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#3c4a3d]/30 rounded-lg py-3.5 pl-12 pr-4 text-[#e4e1e9] focus:outline-none focus:border-[#4ff07f] focus:ring-1 focus:ring-[#4ff07f] transition-all placeholder:text-[#bbcbb9]/40"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Primary CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4ff07f] text-[#003915] font-['Plus_Jakarta_Sans'] font-bold text-[20px] py-4 rounded-lg shadow-[0_0_20px_rgba(79,240,127,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              <p className="text-center text-[#bbcbb9] text-xs mt-3">No credit card required</p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-[#3c4a3d]/20"></div>
              <span className="text-[#bbcbb9] text-xs font-bold uppercase tracking-widest">or</span>
              <div className="h-[1px] flex-1 bg-[#3c4a3d]/20"></div>
            </div>

            {/* Secondary Option (Google) */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-[#2a292f] border border-[#3c4a3d]/20 flex items-center justify-center gap-3 py-3.5 rounded-lg hover:bg-[#35343a] transition-colors group disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="text-[#e4e1e9] font-medium group-hover:text-white transition-colors">Sign up with Google</span>
            </button>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-[#bbcbb9] text-sm">
              Already have an account? 
              <button onClick={() => navigate('/login')} className="text-[#4ff07f] font-bold ml-1 hover:underline underline-offset-4 decoration-[#4ff07f]/40 cursor-pointer bg-transparent border-none">
                Sign in
              </button>
            </p>
          </footer>
        </div>

        {/* Secondary Subtext Footer */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-2 opacity-50">
          <span className="text-xs text-[#bbcbb9]">© 2024 Seculo Obsidian Edition</span>
          <a className="text-xs text-[#bbcbb9] hover:text-white transition-colors cursor-pointer" href="#">Privacy Policy</a>
          <a className="text-xs text-[#bbcbb9] hover:text-white transition-colors cursor-pointer" href="#">Terms of Service</a>
        </div>
      </main>

      {/* Visual Accents */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4 items-end opacity-20 hidden lg:flex">
        <div className="h-[1px] w-32 bg-[#4ff07f]"></div>
        <span className="font-['Plus_Jakarta_Sans'] font-black text-6xl tracking-tighter text-[#869584] select-none">SECULO</span>
      </div>
    </div>
  );
}
