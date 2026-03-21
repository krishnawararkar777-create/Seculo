import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkUserAndRedirect = async (session) => {
    try {
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
    } catch (err) {
      navigate('/onboarding');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (authError) throw authError;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await checkUserAndRedirect(session);
      } else {
        alert('Check your email for the confirmation link!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#2a2a3a]">
        <div className="flex justify-between items-center px-8 h-16 max-w-7xl mx-auto">
          <button onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter text-white font-['Plus_Jakarta_Sans'] cursor-pointer bg-transparent border-none">
            Seculo
          </button>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md bg-[#131318] rounded-xl p-8 border border-[#2a2a3a]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-[#bbcbb9] text-sm">Join Seculo today</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-[#bbcbb9] mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 bg-[#1b1b20] border border-[#3c4a3d]/30 rounded-lg px-4 text-white focus:outline-none focus:border-[#25D366] transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#bbcbb9] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-[#1b1b20] border border-[#3c4a3d]/30 rounded-lg px-4 text-white focus:outline-none focus:border-[#25D366] transition-colors"
                placeholder="name@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#bbcbb9] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-[#1b1b20] border border-[#3c4a3d]/30 rounded-lg px-4 text-white focus:outline-none focus:border-[#25D366] transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#25D366] text-black font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-xs text-[#bbcbb9]">No credit card required</p>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-[#3c4a3d]/30"></div>
            <span className="text-xs text-[#bbcbb9] uppercase tracking-widest">Or</span>
            <div className="h-px flex-1 bg-[#3c4a3d]/30"></div>
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full h-12 bg-[#1f1f25] border border-[#3c4a3d]/30 rounded-lg flex items-center justify-center gap-3 text-white hover:bg-[#2a292f] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-medium">Sign up with Google</span>
          </button>

          <p className="text-center text-sm text-[#bbcbb9] mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-[#25D366] font-bold hover:underline cursor-pointer bg-transparent border-none">
              Sign in
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
