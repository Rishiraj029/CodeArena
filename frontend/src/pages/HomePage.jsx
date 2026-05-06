import { SignedOut, SignedIn, SignInButton, SignUpButton, UserButton, SignOutButton } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Code, Flame, Trophy, ArrowRight, Play, CheckCircle, Sparkles, Sword } from 'lucide-react';

export default function HomePage() {
  const [solvedCount, setSolvedCount] = useState(50236);
  const [onlineCount, setOnlineCount] = useState(1243);

  useEffect(() => {
    const t = setInterval(() => {
      setSolvedCount(prev => prev + Math.floor(Math.random() * 4) + 1);
      setOnlineCount(() => 1240 + Math.floor(Math.random() * 30));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00ff88]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00ff88] rounded-xl flex items-center justify-center relative">
              <Sword className="w-5 h-5 text-black" strokeWidth={3} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-[#0a0a0f]" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight">CodeArena</span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
                <span className="text-[11px] text-[#00ff88]/80">{onlineCount.toLocaleString()} online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-semibold text-gray-300 hover:text-white cursor-pointer transition-colors">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88] text-sm font-bold hover:bg-[#00ff88] hover:text-black transition-all duration-300 cursor-pointer hover:scale-105">
                  Start Competing <Sword className="w-4 h-4" />
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <a href="/problems" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00ff88] text-black text-sm font-bold hover:scale-105 transition-transform">
                Go To Arena <ArrowRight className="w-4 h-4" />
              </a>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-8">
        {/* Badge */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-sm font-semibold">
            <Flame className="w-4 h-4" /> {solvedCount.toLocaleString()} problems solved today
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              Battle. Code.<br />
              <span className="text-[#00ff88] bg-gradient-to-r from-[#00ff88] via-emerald-400 to-[#00ff88] bg-clip-text text-transparent animate-gradient">Conquer.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
              Step into the <span className="text-[#00ff88] font-semibold">CodeArena</span> where developers sharpen their skills through competitive coding challenges. Master algorithms, ace interviews, and climb the global leaderboard.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#00ff88] text-black text-base font-bold hover:scale-105 transition-transform shadow-lg shadow-[#00ff88]/25 cursor-pointer">
                    <Play className="w-4 h-4 fill-black" /> Enter The Arena <ArrowRight className="w-4 h-4" />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white/20 text-white text-base font-bold hover:border-white/40 hover:scale-105 transition-all cursor-pointer">
                    Sign In <Sword className="w-4 h-4" />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <a href="/problems" className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#00ff88] text-black text-base font-bold hover:scale-105 transition-transform shadow-lg shadow-[#00ff88]/25">
                  <Play className="w-4 h-4 fill-black" /> Go To Arena <ArrowRight className="w-4 h-4" />
                </a>
              </SignedIn>
            </div>

            {/* Stats */}
            <div className="flex gap-12 mb-10">
              {[['3,247+', 'Challenges'], ['125K+', 'Warriors'], ['96.3%', 'Success']].map(([val, label]) => (
                <div key={label}>
                  <div className="text-2xl font-black text-[#00ff88]">{val}</div>
                  <div className="text-sm text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            {/* Code Snippet */}
            <div className="bg-[#0d0d16] border border-white/10 rounded-2xl p-5 max-w-sm overflow-hidden">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-500 font-mono">challenge.py</span>
              </div>
              <div className="font-mono text-sm leading-relaxed overflow-x-auto">
                <div><span className="text-blue-400">def</span> <span className="text-[#00ff88]">solve_challenge</span>():</div>
                <div className="pl-6"><span className="text-gray-500"># Your code here</span></div>
                <div className="pl-6"><span className="text-blue-400">return</span> <span className="text-orange-400">"Success"</span></div>
              </div>
            </div>
          </div>

          {/* Right - Image + Floating Cards */}
          <div className="relative hidden lg:block">
            <div className="group relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 cursor-pointer">
              <img
                src="/ComputerImage.jpg"
                alt="Developer coding"
                className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0a0a0f]/30" />
            </div>

            {/* 42 Day Streak Card */}
            <div className="absolute -top-8 -right-6 animate-float z-20 drop-shadow-2xl" style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
              <div className="bg-[#1a1a24] border border-[#00ff88]/40 rounded-2xl px-4 py-4 flex items-center gap-4 shadow-xl shadow-[#00ff88]/10">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-base font-bold flex items-center gap-1.5">42 Day Streak <Sparkles className="w-4 h-4 text-[#00ff88]" /></div>
                  <div className="text-sm text-gray-400">Don't break it!</div>
                </div>
              </div>
            </div>

            {/* Global Rank Card */}
            <div className="absolute top-[40%] -right-5 animate-float-delayed z-20 drop-shadow-2xl" style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
              <div className="bg-[#111a15] border border-[#00ff88]/40 rounded-2xl px-4 py-3 shadow-xl shadow-[#00ff88]/10 min-w-[170px]">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-sm font-bold">Global Rank</span>
                </div>
                {[['#1', 'Alex_Dev', '2.4k', 'text-yellow-400'], ['#2', 'Sarah_C', '2.1k', 'text-gray-300'], ['#3', 'You', '1.8k', 'text-[#00ff88]']].map(([rank, name, xp, clr]) => (
                  <div key={name} className={`flex items-center justify-between text-xs py-1 ${name === 'You' ? 'text-[#00ff88] font-bold' : ''}`}>
                    <span className={`w-6 font-bold ${clr}`}>{rank}</span>
                    <span className={`flex-1 ${name === 'You' ? 'text-[#00ff88]' : 'text-gray-300'}`}>{name}</span>
                    <span className="text-gray-400">{xp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Victory Card */}
            <div className="absolute -bottom-6 left-[-4%] animate-float-slow z-20 drop-shadow-2xl" style={{ filter: 'drop-shadow(0 20px 30px rgba(0,255,136,0.25))' }}>
              <div className="bg-[#00ff88] border-2 border-[#00ff88] rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl shadow-[#00ff88]/30">
                <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="text-sm font-bold text-black">Victory!</div>
                  <div className="text-xs text-black/70">+250 XP Earned</div>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-[6px] text-black">●</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Champions Speak */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black mb-3">Champions Speak</h2>
          <p className="text-gray-500">See how CodeArena warriors landed their dream roles</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah Chen', role: 'Software Engineer @ Google', quote: "CodeArena's challenges prepared me perfectly for my Google interviews. The difficulty progression is spot-on!", solved: 523, img: '/client1.jpg' },
            { name: 'Marcus Rodriguez', role: 'Senior Dev @ Amazon', quote: 'The mock interview feature is a game-changer. Felt like the real thing. Got my offer within 3 months!', solved: 892, img: '/client2.jpg' },
            { name: 'Priya Sharma', role: 'Tech Lead @ Meta', quote: "From struggling with arrays to leading a team, CodeArena's learning path transformed my career trajectory.", solved: 1247, img: '/client3.jpg' },
          ].map((t) => (
            <div key={t.name} className="bg-[#0d0d16] border border-white/10 rounded-2xl p-6 hover:border-[#00ff88]/30 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-5">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-[#00ff88]/20 p-0.5">
                    <img src={t.img} alt={t.name} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#00ff88] rounded-full border-2 border-[#0d0d16]" />
                </div>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{t.quote}</p>
              <div className="flex items-center gap-2 text-[#00ff88] text-sm font-semibold">
                <Trophy className="w-4 h-4" />
                {t.solved.toLocaleString()} problems solved
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="relative rounded-3xl border border-[#00ff88]/20 bg-[#0d0d16] p-12 lg:p-16 text-center overflow-hidden" style={{ boxShadow: '0 0 60px rgba(0,255,136,0.06), inset 0 1px 0 rgba(0,255,136,0.1)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#00ff88]/3 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" /> Premium Free for 30 Days
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Your Arena <span className="text-[#00ff88]">Awaits</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Join 125,000+ developers crushing interviews and landing dream roles
            </p>
            <div className="flex flex-row items-center justify-center gap-6 flex-wrap">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="flex items-center gap-2 px-10 py-4 rounded-full bg-[#00ff88] text-black text-lg font-bold hover:scale-105 transition-transform shadow-xl shadow-[#00ff88]/25 cursor-pointer">
                    <Sword className="w-5 h-5" /> Enter The Arena Free <ArrowRight className="w-5 h-5" />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="text-gray-400 hover:text-[#00ff88] text-sm font-medium cursor-pointer transition-colors flex items-center gap-1">
                    Already a warrior? Sign In <ArrowRight className="w-3 h-3" />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <a href="/problems" className="flex items-center gap-2 px-10 py-4 rounded-full bg-[#00ff88] text-black text-lg font-bold hover:scale-105 transition-transform shadow-xl shadow-[#00ff88]/25">
                  <Sword className="w-5 h-5" /> Enter The Arena <ArrowRight className="w-5 h-5" />
                </a>
              </SignedIn>
            </div>
            <div className="flex justify-center gap-8 mt-6 text-gray-500 text-sm">
              {['No credit card', 'Cancel anytime', 'Start in 60s'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00ff88]/60" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#08080d]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#00ff88] rounded-lg flex items-center justify-center">
              <Sword className="w-3.5 h-3.5 text-black" strokeWidth={3} />
            </div>
            <span className="text-sm font-bold">CodeArena</span>
          </div>
          <span className="text-xs text-gray-600">© 2026 CodeArena. Built for warriors.</span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Flame className="w-3.5 h-3.5 text-[#00ff88]" />
            {solvedCount.toLocaleString()} conquered today
          </div>
        </div>
      </footer>
    </div>
  );
}