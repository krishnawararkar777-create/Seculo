import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import { ChevronRight, MessageCircle, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Onboarding from './pages/Onboarding';

// --- Components ---

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const useCasesRow1 = [
    "Translate in real time", "Organize your inbox", "Answer support tickets", "Summarize long documents", "Notify before a meeting",
    "Schedule across time zones", "Do your taxes", "Track expenses and receipts", "Compare insurance quotes", "Manage subscriptions",
    "Find discount codes", "Price-drop alerts", "Compare product specs"
  ];

  const useCasesRow2 = [
    "Negotiate deals", "Run payroll calculations", "Manage invoices",
    "Generate invoices", "Create presentations from bullet points", "Book travel and hotels", "Find recipes from ingredients", "Plan meals",
    "Screen cold outreach", "Draft job descriptions", "Run standup summaries", "Track OKRs and KPIs", "Monitor brand mentions"
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#155dfd]/30">
      {/* Top Banner */}
      <div className="w-full bg-[#155dfd] py-2.5 text-center text-xs font-medium text-white tracking-wide">
        Open Beta — Deploy your personal AI assistant in under a minute.
      </div>

      {/* Navigation */}
      <nav className="w-full bg-[#0A0A0A] border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold font-serif text-white tracking-tight">Seculo</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="mailto:support@seculo.com" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Contact Support
            </a>
            <button
              onClick={handleGetStarted}
              className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-[#155dfd] hover:text-white transition-all active:scale-95 shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[#0A0A0A] bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.03] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-serif tracking-tight text-white mb-2 leading-[1.1]">
            Deploy OpenClaw
          </h1>
          <h2 className="text-6xl md:text-8xl font-serif tracking-tight text-gray-500 mb-8 leading-[1.1]">
            In Under 1 Minute
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            Your own 24/7 AI assistant on Telegram, Discord, or WhatsApp. Pick a model, choose a channel, and deploy with Seculo — no server setup, no code, no configuration.
          </p>

          <div className="flex flex-col items-center gap-5">
            <button
              onClick={handleGetStarted}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-[#155dfd] text-white text-lg font-semibold rounded-xl hover:bg-[#104bc2] transition-all active:scale-95 shadow-lg shadow-[#155dfd]/25"
            >
              Start Deploying Now
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-500 font-medium">
              Set up in under a minute. Cancel anytime. <a href="#" className="text-[#155dfd] hover:underline">Moneyback guarantee.</a>
            </p>
          </div>
        </motion.div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-y border-white/10 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em] mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 text-white">
            <span className="text-2xl font-bold font-sans tracking-tighter">Google</span>
            <span className="text-2xl font-bold font-sans tracking-tight">Meta</span>
            <span className="text-2xl font-bold font-sans tracking-tighter">OpenAI</span>
            <span className="text-2xl font-bold font-serif tracking-widest">ANTHROPIC</span>
            <span className="text-2xl font-bold font-sans tracking-tighter">stripe</span>
            <span className="text-2xl font-bold font-sans tracking-tighter">▲ Vercel</span>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-32 px-6 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-16">
            Traditional Method vs Seculo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Traditional */}
            <div className="bg-[#111111] p-10 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-800"></div>
              <h3 className="text-2xl font-serif text-gray-500 mb-8">Traditional</h3>
              <ul className="space-y-5 text-base text-gray-400 mb-10">
                <li className="flex justify-between border-b border-white/5 pb-3"><span>Purchasing a VM</span> <span className="font-mono text-gray-500">15 min</span></li>
                <li className="flex justify-between border-b border-white/5 pb-3"><span>Creating SSH keys</span> <span className="font-mono text-gray-500">10 min</span></li>
                <li className="flex justify-between border-b border-white/5 pb-3"><span>Installing dependencies</span> <span className="font-mono text-gray-500">10 min</span></li>
                <li className="flex justify-between border-b border-white/5 pb-3"><span>Configuring environment</span> <span className="font-mono text-gray-500">10 min</span></li>
                <li className="flex justify-between border-b border-white/5 pb-3"><span>Setting up the bot</span> <span className="font-mono text-gray-500">10 min</span></li>
                <li className="flex justify-between border-b border-white/5 pb-3"><span>Debugging webhooks</span> <span className="font-mono text-gray-500">5 min</span></li>
              </ul>
              <div className="flex justify-between items-center font-bold text-gray-500 text-xl mb-4">
                <span>Total</span>
                <span className="font-mono">60 min</span>
              </div>
              <p className="text-sm text-gray-500 italic">
                If you're non-technical, multiply these times by 10.
              </p>
            </div>
            
            {/* Seculo */}
            <div className="bg-[#111111] p-10 rounded-2xl border border-[#155dfd]/30 shadow-xl shadow-[#155dfd]/10 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#155dfd]"></div>
              <h3 className="text-2xl font-serif text-white mb-8">Seculo</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-8xl font-serif tracking-tighter text-[#155dfd]">&lt;1</span>
                <span className="text-2xl font-medium text-gray-400">minute</span>
              </div>
              <p className="text-lg text-white font-medium leading-relaxed">
                Choose your model, pick a channel, and deploy. We handle infrastructure, keys, and webhooks automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-[#111111] border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Loved by builders everywhere
          </h2>
          <p className="text-lg text-gray-400 mb-16 font-medium">
            See what people are saying about OpenClaw
          </p>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 text-left">
            {[
              { name: "Jonah", handle: "@jonahships_", text: "Setup OpenClaw yesterday. All I have to say is, wow. The fact that claw can just keep building upon itself just by talking to it in discord is crazy. The future is already here.", avatar: "1" },
              { name: "Dave Morin", handle: "@davemorin", text: "First time I have felt like I am living in the future since the launch of ChatGPT.", avatar: "2" },
              { name: "Aryeh Dubois", handle: "@AryehDubois", text: "Very impressed how many hard things Claw gets right. Persistent memory, persona onboarding, comms integration, heartbeats. The end result is AWESOME.", avatar: "3" },
              { name: "Lyc", handle: "@lycfyi", text: "After years of AI hype, I thought nothing could faze me. Then I installed @openclaw. From nervous 'hi what can you do?' to full throttle - design, code review, taxes, PM, content pipelines... AI as teammate, not tool. The endgame of digital employees is here.", avatar: "4" },
              { name: "Nathan Clark", handle: "@nathanclark_", text: "A smart model with eyes and hands at a desk with keyboard and mouse. You message it like a coworker and it does everything a person could do with that Mac mini.", avatar: "5" },
              { name: "Nat Eliason", handle: "@nateliason", text: "Yeah this was 1,000% worth it. Autonomously running tests on my app and capturing errors through a sentry webhook then resolving them and opening PRs... The future is here.", avatar: "6" },
              { name: "Abhi Katiyar", handle: "@abhi_katiyar", text: "When you experience @openclaw it gives the same kick as when we first saw the power of ChatGPT, DeepSeek, and Claude Code. A fundamental shift is happening.", avatar: "7" },
              { name: "Nick Vasiles", handle: "@nickvasiles", text: "24/7 assistant with access to its own computer. What if there were ten, or a hundred, or a thousand?? All running 24/7 in the cloud with access to your files, Gmail, calendar, everything about you. That's the future, and we're living it today.", avatar: "8" },
              { name: "Christine Tyip", handle: "@christinetyip", text: "Just shipped my first personal AI assistant. On WhatsApp. Builds my second brain while I chat. Memory moves across agents. Personal AI is getting real.", avatar: "9" }
            ].map((testimonial, i) => (
              <div key={i} className="break-inside-avoid p-8 bg-[#1A1A1A] border border-white/5 rounded-2xl hover:border-white/10 transition-colors duration-300">
                <p className="text-base text-gray-300 mb-8 leading-relaxed font-medium">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                    <img src={`https://i.pravatar.cc/150?u=${testimonial.avatar}`} alt={testimonial.name} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.handle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases - Horizontal Scrolling */}
      <section className="py-32 bg-[#0A0A0A] overflow-hidden border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            What can OpenClaw do for you?
          </h2>
          <p className="text-lg text-gray-400 font-medium">
            One assistant, thousands of use cases
          </p>
        </div>

        <div className="flex flex-col gap-6 relative">
          {/* Fading edges for the scrolling effect */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>

          {/* Row 1 */}
          <div className="flex w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] gap-6 px-6">
            {[...useCasesRow1, ...useCasesRow1].map((useCase, i) => (
              <div key={i} className="flex-shrink-0 px-6 py-4 bg-[#111111] border border-white/10 rounded-xl text-gray-300 font-medium hover:bg-[#1A1A1A] hover:border-[#155dfd]/50 transition-colors cursor-default whitespace-nowrap">
                {useCase}
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex w-max animate-[marquee-reverse_45s_linear_infinite] hover:[animation-play-state:paused] gap-6 px-6">
            {[...useCasesRow2, ...useCasesRow2].map((useCase, i) => (
              <div key={i} className="flex-shrink-0 px-6 py-4 bg-[#111111] border border-white/10 rounded-xl text-gray-300 font-medium hover:bg-[#1A1A1A] hover:border-[#155dfd]/50 transition-colors cursor-default whitespace-nowrap">
                {useCase}
              </div>
            ))}
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center mt-12">
          <p className="text-sm text-gray-500 italic">
            PS. You can add as many use cases as you want via natural language
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6 bg-[#0A0A0A] text-center relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(21,93,253,0.15)_0%,transparent_70%)]"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Start Deploying Now
          </h2>
          <p className="text-xl text-gray-400 mb-12 font-medium">
            Pick a model, choose a channel, and have your AI assistant running in under a minute.
          </p>
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleGetStarted}
              className="group flex items-center justify-center gap-2 px-10 py-5 bg-[#155dfd] text-white text-xl font-semibold rounded-xl hover:bg-[#104bc2] transition-all active:scale-95 shadow-xl shadow-[#155dfd]/20"
            >
              Deploy Now
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <span className="text-lg font-bold font-serif text-white/50 tracking-tight">Seculo</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-[#155dfd] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#155dfd] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#155dfd] transition-colors">Moneyback Guarantee</a>
            <a href="mailto:support@seculo.com" className="hover:text-[#155dfd] transition-colors">support@seculo.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
          }
        });
        if (error) throw error;
        alert('Check your email for the login link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = '/onboarding';
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <span className="text-3xl font-bold font-serif text-white tracking-tight">Seculo</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111111] py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-white/10">
          <form className="space-y-6" onSubmit={handleEmailAuth}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-white/10 bg-[#1A1A1A] px-3 py-2 placeholder-gray-500 text-white focus:border-[#155dfd] focus:outline-none focus:ring-[#155dfd] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-white/10 bg-[#1A1A1A] px-3 py-2 placeholder-gray-500 text-white focus:border-[#155dfd] focus:outline-none focus:ring-[#155dfd] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-[#155dfd] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#104bc2] focus:outline-none focus:ring-2 focus:ring-[#155dfd] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Processing...' : isSignUp ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#111111] px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-white/10 bg-[#1A1A1A] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-[#155dfd] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-medium text-[#155dfd] hover:text-[#104bc2] transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ session }: { session: Session }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <header className="flex items-center justify-between mb-12 bg-[#111111] p-6 rounded-xl border border-white/10 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold font-serif text-white tracking-tight">Seculo</span>
            <div className="h-6 w-px bg-white/10 mx-2" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Console</h1>
              <p className="text-[#155dfd] text-sm font-medium">{session.user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-[#1A1A1A] border border-white/10 text-gray-300 rounded-md hover:bg-[#222222] transition-all text-sm font-bold active:scale-95"
          >
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111111] border border-white/10 p-8 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Account Status</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#155dfd] rounded-full animate-pulse" />
              <p className="text-xl font-bold">Active</p>
            </div>
          </div>
          <div className="bg-[#111111] border border-white/10 p-8 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Last Login</h3>
            <p className="text-xl font-bold">{new Date(session.user.last_sign_in_at || '').toLocaleDateString()}</p>
          </div>
          <div className="bg-[#111111] border border-white/10 p-8 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Auth Provider</h3>
            <p className="text-xl font-bold capitalize">{session.user.app_metadata.provider}</p>
          </div>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-white/10 flex items-center justify-between bg-[#0A0A0A]/50">
            <h2 className="text-xl font-bold text-white">User Profile</h2>
            <span className="px-3 py-1 bg-[#155dfd]/10 text-[#155dfd] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#155dfd]/20">
              Authenticated
            </span>
          </div>
          <div className="p-8">
            <pre className="bg-[#0A0A0A] p-6 rounded-lg overflow-x-auto text-xs font-mono text-[#155dfd]/80 border border-white/5">
              {JSON.stringify(session.user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-[#155dfd] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={session ? <Navigate to="/onboarding" replace /> : <Landing />} 
        />
        <Route 
          path="/auth" 
          element={session ? <Navigate to="/onboarding" replace /> : <AuthPage />} 
        />
        <Route 
          path="/onboarding" 
          element={session ? <Onboarding /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard session={session} /> : <Navigate to="/auth" replace />} 
        />
      </Routes>
    </Router>
  );
}
