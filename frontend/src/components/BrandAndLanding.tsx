import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Brain,
  Target,
  Compass,
  Calendar,
  TrendingUp,
  Flame,
  CheckCircle2,
  ArrowRight,
  Layers,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

export const StudyVerseLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dims = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`${dims} rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-sky-500 flex items-center justify-center shadow-md shadow-blue-900/20 relative overflow-hidden`}
      >
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-white" fill="none">
          {/* Open Book Base */}
          <path
            d="M8 14C8 12.8954 8.89543 12 10 12H17C18.6569 12 20 13.3431 20 15V29C20 27.8954 18.6569 27 17 27H10C8.89543 27 8 26.1046 8 25V14Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 14C32 12.8954 31.1046 12 30 12H23C21.3431 12 20 13.3431 20 15V29C20 27.8954 21.3431 27 23 27H30C31.1046 27 32 26.1046 32 25V14Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Orbital Knowledge Ring & Node */}
          <ellipse
            cx="20"
            cy="15"
            rx="14"
            ry="5.5"
            transform="rotate(-18 20 15)"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeDasharray="3 2"
          />
          <circle cx="31" cy="11" r="2.6" fill="#a78bfa" />
          <circle cx="20" cy="8.5" r="2" fill="#38bdf8" />
        </svg>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-tight text-slate-900 text-lg leading-none">
            Study<span className="text-sky-600">Verse</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
            CBSE 6–10
          </span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
          Learn Smarter. Improve Faster.
        </p>
      </div>
    </div>
  );
};

interface LandingPageProps {
  onStartOnboarding: () => void;
  onLoadPrebuiltDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onLoadPrebuiltDemo,
}) => {
  const [activeCyclePhase, setActiveCyclePhase] = useState<number>(0);

  const cycleSteps = [
    {
      phase: '1. Diagnose & Verify Reasoning',
      steps: 'Steps 1–8',
      desc: 'Select class, subjects, weak-subject preferences, and daily study time. Complete a combined diagnostic quiz with progressive hints and lucky-guess reasoning checks.',
      badge: 'Evidence Collection',
    },
    {
      phase: '2. Detect Gaps & Earlier-Class Prerequisites',
      steps: 'Steps 9–11',
      desc: 'Identify weak topics vs. uncertain understanding. When a Class 8 struggle stems from a Class 6 or 7 concept, StudyVerse recommends a targeted foundation lesson first.',
      badge: 'Root-Cause Analysis',
    },
    {
      phase: '3. Plan, Learn with NCERT RAG & Practice',
      steps: 'Steps 12–14',
      desc: 'Follow a daily time-boxed study plan, study from NCERT-grounded explanations, ask doubts anytime, and take targeted topic quizzes.',
      badge: 'Guided Action',
    },
    {
      phase: '4. Reassess & Adapt Continuously',
      steps: 'Steps 15–17',
      desc: 'After every quiz, StudyVerse updates topic mastery, recalculates your next priority recommendation, and tracks your daily goal streak and milestones.',
      badge: 'Continuous Loop',
    },
  ];

  const features = [
    {
      icon: Target,
      title: 'Smart Diagnostic Quizzes',
      desc: 'Evaluates both your multiple-choice answer and your written reasoning so lucky guesses are never mistaken for true mastery.',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      icon: Compass,
      title: 'Explainable Weakness Detection',
      desc: 'Every recommendation shows what topic needs work, what evidence supports it, which misconception occurred, and how progress will be reassessed.',
      color: 'text-violet-700 bg-violet-50 border-violet-200',
    },
    {
      icon: Layers,
      title: 'Prerequisite-Aware Learning',
      desc: 'Struggling with Class 8 Linear Equations? StudyVerse bridges missing Class 6 Fractions or Class 7 Simple Equations foundations first.',
      color: 'text-sky-700 bg-sky-50 border-sky-200',
    },
    {
      icon: Brain,
      title: 'Textbook-Grounded AI Tutor (RAG)',
      desc: 'Ask questions or doubts and get clear explanations, worked examples, and actual CBSE/NCERT chapter and page references.',
      color: 'text-teal-700 bg-teal-50 border-teal-200',
    },
    {
      icon: Calendar,
      title: 'Adaptive Study Planner',
      desc: 'Fits foundational review, targeted practice, mistake review, and reassessment neatly into your 20, 30, 45, or 60-minute daily schedule.',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
    {
      icon: Flame,
      title: 'Healthy Learning Streaks',
      desc: 'Build sustainable study habits with daily goal tracking and Bronze (10d), Silver (50d), and Gold (100d) Scholar milestones—with zero guilt or shaming.',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <StudyVerseLogo />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLoadPrebuiltDemo}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Explore Interactive Class 8 Demo
            </button>
            <button
              type="button"
              onClick={onStartOnboarding}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-sm transition"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-white via-slate-50 to-blue-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/10 text-blue-900 text-xs font-semibold border border-blue-900/15">
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>CBSE / NCERT Personalized Learning Platform • Classes 6–10</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Know What to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-sky-600 to-violet-600">Study Next.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                StudyVerse understands your learning progress, helps you strengthen your basics, and builds a personalized plan for what to learn next.
              </p>

              {/* Central Product Question Banner */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-1">
                  The Core Question StudyVerse Answers Every Day
                </p>
                <p className="text-sm font-medium text-slate-800 italic">
                  &ldquo;What should this student study next, why should they study it, and what evidence shows that they understand the current topic?&rdquo;
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onStartOnboarding}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-blue-900 hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition"
                >
                  Start Learning (Step-by-Step Onboarding)
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#features-showcase"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition"
                >
                  Explore Features
                </a>
                <button
                  type="button"
                  onClick={onLoadPrebuiltDemo}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition"
                >
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Jump to Populated Class 8 Dashboard
                </button>
              </div>
            </div>

            {/* Hero Visual & Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="relative h-48 sm:h-56 bg-slate-100 overflow-hidden">
                  <img
                    src="user_uploaded_files/ttl=63d/tool_generated/watermarked_img_332921002952794027.jpg"
                    alt="StudyVerse Orbital Knowledge Illustration"
                    className="w-full h-full object-cover max-w-full"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-sky-300 font-bold">Live Diagnostic Preview:</span> Class 8 Math &amp; Science
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30">
                      NCERT Aligned
                    </span>
                  </div>
                </div>

                {/* Mini Dashboard Preview inside Hero */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
                        Recommended Next Topic
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        Ch 2: Linear Equations in One Variable
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      Prerequisite Gap Detected
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-1.5">
                    <div className="font-semibold text-blue-950 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                      Why this recommendation?
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Recent diagnostic attempt showed a sign transposition error. StudyVerse recommends a 12-min{' '}
                      <strong className="text-blue-900">Class 7 Simple Equations</strong> foundation review before targeted Class 8 practice.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                      <div className="text-xs text-slate-500">Daily Goal</div>
                      <div className="text-sm font-bold text-slate-900">30 mins</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                      <div className="text-xs text-slate-500">Reasoning Check</div>
                      <div className="text-sm font-bold text-emerald-700">Active</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                      <div className="text-xs text-slate-500">Study Streak</div>
                      <div className="text-sm font-bold text-amber-600">9 Days 🔥</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 17-Step Learning Cycle Section */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              How StudyVerse Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              One Continuous, Evidence-Based Learning Loop
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Unlike standalone chatbots or static quiz banks, StudyVerse connects diagnosis, earlier-class foundations, textbook learning, and adaptive planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {cycleSteps.map((item, idx) => {
              const active = activeCyclePhase === idx;
              return (
                <button
                  key={item.phase}
                  type="button"
                  onClick={() => setActiveCyclePhase(idx)}
                  className={`text-left p-5 rounded-2xl border transition-all ${
                    active
                      ? 'bg-blue-900 text-white border-blue-900 shadow-lg shadow-blue-900/15'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        active ? 'bg-sky-400/20 text-sky-200' : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {item.steps}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        active ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-1.5">{item.phase}</h3>
                  <p className={`text-xs leading-relaxed ${active ? 'text-slate-200' : 'text-slate-600'}`}>
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features-showcase" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Designed Around Real Student Understanding
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Every feature works together to identify learning gaps honestly and guide you step-by-step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${feat.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-900">
                  <span>Included in Class 6–10 Workflow</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-300">
              <ShieldCheck className="w-4 h-4" />
              Ready to Experience the Full 16-Step Journey?
            </div>
            <h3 className="text-2xl font-extrabold">
              Begin Your Personalized Diagnostic or Explore Demo Mode
            </h3>
            <p className="text-sm text-blue-100">
              Select Class 8, CBSE, Mathematics &amp; Science, set a 30-minute daily goal, and see how StudyVerse adapts to your answers and reasoning in real time.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onStartOnboarding}
              className="px-6 py-3 rounded-xl bg-white text-blue-900 font-bold text-sm hover:bg-blue-50 transition shadow"
            >
              Start Step-by-Step Onboarding
            </button>
            <button
              type="button"
              onClick={onLoadPrebuiltDemo}
              className="px-5 py-3 rounded-xl bg-sky-500/20 text-white border border-sky-400/40 font-semibold text-sm hover:bg-sky-500/30 transition"
            >
              Open Pre-Loaded Class 8 Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
