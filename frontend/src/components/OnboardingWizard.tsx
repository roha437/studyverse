import React, { useState } from 'react';
import {
  Student,
  ClassLevel,
  BoardType,
  SubjectName,
} from '../types/studyverse';
import { StudyVerseLogo } from './BrandAndLanding';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  AlertCircle,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';

interface OnboardingWizardProps {
  initialStudent: Student;
  onCompleteOnboarding: (updatedStudent: Student) => void;
  onCancelToLanding: () => void;
}

const ALL_CLASSES: ClassLevel[] = [6, 7, 8, 9, 10];
const ALL_SUBJECTS: SubjectName[] = ['Mathematics', 'Science', 'English', 'Social Science'];
const STUDY_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = [
  'Morning (6:30 AM – 8:00 AM)',
  'Afternoon (3:30 PM – 5:00 PM)',
  'Evening (5:30 PM – 7:30 PM)',
  'Night (8:00 PM – 9:30 PM)',
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialStudent,
  onCompleteOnboarding,
  onCancelToLanding,
}) => {
  const [step, setStep] = useState<number>(1);
  const [showWeakConfirmation, setShowWeakConfirmation] = useState<boolean>(false);

  const [displayName, setDisplayName] = useState<string>(initialStudent.displayName || 'Aarav Sharma');
  const [classLevel, setClassLevel] = useState<ClassLevel>(initialStudent.classLevel || 8);
  const [board, setBoard] = useState<BoardType>('CBSE');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectName[]>(
    initialStudent.selectedSubjects.length > 0
      ? initialStudent.selectedSubjects
      : ['Mathematics', 'Science']
  );
  const [selectedWeakSubjects, setSelectedWeakSubjects] = useState<SubjectName[]>(
    initialStudent.selectedWeakSubjects
  );
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(
    initialStudent.dailyGoalMinutes || 30
  );
  const [customMinutesMode, setCustomMinutesMode] = useState<boolean>(false);
  const [preferredStudyDays, setPreferredStudyDays] = useState<string[]>(
    initialStudent.preferredStudyDays.length > 0
      ? initialStudent.preferredStudyDays
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  );
  const [preferredStudyTime, setPreferredStudyTime] = useState<string>(
    initialStudent.preferredStudyTime || 'Evening (5:30 PM – 7:30 PM)'
  );
  const [learningGoal, setLearningGoal] = useState<string>(
    initialStudent.learningGoal || 'Strengthen foundations, fix weak topics, and score high in school exams'
  );

  const toggleSubject = (subj: SubjectName) => {
    if (selectedSubjects.includes(subj)) {
      if (selectedSubjects.length === 1) return; // Keep at least 1 subject
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subj));
      setSelectedWeakSubjects(selectedWeakSubjects.filter((s) => s !== subj));
    } else {
      setSelectedSubjects([...selectedSubjects, subj]);
    }
  };

  const toggleWeakSubject = (subj: SubjectName) => {
    if (selectedWeakSubjects.includes(subj)) {
      setSelectedWeakSubjects(selectedWeakSubjects.filter((s) => s !== subj));
    } else {
      setSelectedWeakSubjects([...selectedWeakSubjects, subj]);
    }
  };

  const toggleStudyDay = (day: string) => {
    if (preferredStudyDays.includes(day)) {
      if (preferredStudyDays.length === 1) return;
      setPreferredStudyDays(preferredStudyDays.filter((d) => d !== day));
    } else {
      setPreferredStudyDays([...preferredStudyDays, day]);
    }
  };

  const handleFinalizeToDiagnostic = () => {
    onCompleteOnboarding({
      ...initialStudent,
      displayName: displayName.trim() || 'Student',
      classLevel,
      board,
      selectedSubjects,
      selectedWeakSubjects,
      dailyGoalMinutes,
      preferredStudyDays,
      preferredStudyTime,
      learningGoal,
      diagnosticCompleted: false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-8 flex items-center justify-between">
        <StudyVerseLogo size="sm" />
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>Onboarding Step {step} of 6</span>
          </div>
          <button
            type="button"
            onClick={onCancelToLanding}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-6 gap-2">
            {[
              '1. Class',
              '2. Board',
              '3. Subjects',
              '4. Weak Areas',
              '5. Study Time',
              '6. Diagnostic',
            ].map((label, idx) => {
              const sNum = idx + 1;
              const isDone = step > sNum;
              const isCurrent = step === sNum;
              return (
                <div key={label} className="space-y-1.5">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isDone
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-blue-900'
                        : 'bg-slate-200'
                    }`}
                  />
                  <p
                    className={`text-[11px] font-semibold truncate ${
                      isCurrent
                        ? 'text-blue-900'
                        : isDone
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
          {/* STEP 1: SELECT CLASS */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  Step 1 of 6 • Academic Profile
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Welcome! Let&rsquo;s set up your class profile
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  StudyVerse tailors textbook explanations, questions, and earlier-class prerequisite bridges to your grade level.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Your Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Your Class
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {ALL_CLASSES.map((c) => {
                    const selected = classLevel === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setClassLevel(c)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          selected
                            ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="text-lg font-extrabold">Class {c}</div>
                        <div
                          className={`text-[10px] mt-1 font-semibold ${
                            selected ? 'text-sky-200' : 'text-slate-500'
                          }`}
                        >
                          {c === 8 ? 'Full Demo Ready' : 'NCERT Curriculum'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-800 transition"
                >
                  Continue to Education Board
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT BOARD */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  Step 2 of 6 • Curriculum Alignment
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Select Your Education Board
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  StudyVerse uses official CBSE / NCERT chapters and prerequisite mappings for initial deployment.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setBoard('CBSE')}
                  className="w-full p-5 rounded-2xl border-2 border-blue-900 bg-blue-50/50 text-left flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-blue-950">
                        CBSE (NCERT Curriculum)
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                        Active &amp; Supported
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Complete chapter-wise topic graphs, NCERT textbook RAG passages, and Class 6–8 foundation links.
                    </p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-blue-900 shrink-0" />
                </button>

                {[
                  {
                    name: 'ICSE / CISCE',
                    note: 'Planned for future release — curriculum mapping in progress',
                  },
                  {
                    name: 'State Boards (AP, Telangana, Maharashtra, Karnataka, Tamil Nadu)',
                    note: 'Planned for future release — state textbook alignment in progress',
                  },
                ].map((b) => (
                  <div
                    key={b.name}
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-left flex items-center justify-between opacity-75"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-700">{b.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{b.note}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700">
                      Future Option
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-800 transition"
                >
                  Continue to Subjects
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT SUBJECTS */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  Step 3 of 6 • Subject Selection
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Which subjects would you like to study?
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Select one or more subjects. Your combined diagnostic quiz will allocate questions across all selected subjects.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {ALL_SUBJECTS.map((subj) => {
                  const isSelected = selectedSubjects.includes(subj);
                  const subtitle =
                    subj === 'Mathematics'
                      ? 'Linear Equations, Algebraic Identities, Fractions'
                      : subj === 'Science'
                      ? 'Force & Pressure, Chemical Effects of Current'
                      : subj === 'English'
                      ? 'Active & Passive Voice, Reading & Grammar'
                      : 'The Indian Constitution, Civics & History';
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-blue-900 bg-blue-50/60 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1 pr-2">
                        <div className="text-base font-bold text-slate-900">{subj}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{subtitle}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          isSelected ? 'bg-blue-900 text-white' : 'border border-slate-300'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWeakConfirmation(false);
                    setStep(4);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-800 transition"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SELECT WEAK SUBJECTS OR DEDICATED CONFIRMATION SCREEN */}
          {step === 4 && !showWeakConfirmation && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    Step 4 of 6 • Optional Self-Reflection
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Do any subjects feel difficult right now?
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Select any subjects you feel less confident in, or click <strong>Skip</strong>. StudyVerse treats this as a helpful priority preference while still assessing your actual performance independently in the diagnostic quiz.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWeakSubjects([]);
                    setShowWeakConfirmation(false);
                    setStep(5);
                  }}
                  className="shrink-0 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition"
                >
                  Skip This Step →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSubjects.map((subj) => {
                  const isWeak = selectedWeakSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleWeakSubject(subj)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                        isWeak
                          ? 'border-violet-600 bg-violet-50/70'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900">{subj}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {isWeak ? 'Marked for extra focus & priority revision' : 'Click to prioritize'}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isWeak
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isWeak ? 'Selected' : 'Optional'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWeakSubjects([]);
                      setShowWeakConfirmation(false);
                      setStep(5);
                    }}
                    className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition"
                  >
                    Skip (No Specific Weak Subject)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedWeakSubjects.length > 0) {
                        setShowWeakConfirmation(true);
                      } else {
                        setStep(5);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-800 transition"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DEDICATED WEAK SUBJECT CONFIRMATION SCREEN (Workflow Step 5) */}
          {step === 4 && showWeakConfirmation && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 text-white space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Personalized Focus Confirmation
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  &ldquo;Okay, then let&rsquo;s focus on those subjects more.&rdquo;
                </h2>
                <p className="text-sm text-blue-100 leading-relaxed">
                  You selected{' '}
                  <strong className="text-white underline decoration-sky-400">
                    {selectedWeakSubjects.join(' & ')}
                  </strong>{' '}
                  as areas where you want extra support. Here is how StudyVerse will use this preference:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedWeakSubjects.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-xl bg-white/15 border border-white/25 text-sm font-bold text-white"
                    >
                      🎯 Priority Subject: {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Prioritized Study Plan &amp; Revision:</strong> When two topics have similar scores, StudyVerse will schedule{' '}
                    {selectedWeakSubjects.join(', ')} first in your daily planner.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Independent Diagnostic Verification:</strong> Self-reported weaknesses are treated as helpful preferences, not permanent labels. Your diagnostic quiz will still evaluate all selected subjects objectively.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWeakConfirmation(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change Selection
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWeakConfirmation(false);
                    setStep(5);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-800 transition"
                >
                  Configure Daily Study Time
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIGURE STUDY TIME & GOALS */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  Step 5 of 6 • Schedule &amp; Daily Goals
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Configure Your Available Study Time
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  StudyVerse fits your foundation lessons, practice quizzes, and revision into your realistic daily schedule without overloading you.
                </p>
              </div>

              {/* Daily Duration Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Daily Study Duration Goal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { label: '20 minutes', mins: 20 },
                    { label: '30 minutes', mins: 30 },
                    { label: '45 minutes', mins: 45 },
                    { label: '1 hour', mins: 60 },
                  ].map((opt) => {
                    const active = !customMinutesMode && dailyGoalMinutes === opt.mins;
                    return (
                      <button
                        key={opt.mins}
                        type="button"
                        onClick={() => {
                          setCustomMinutesMode(false);
                          setDailyGoalMinutes(opt.mins);
                        }}
                        className={`p-3 rounded-xl border text-center transition ${
                          active
                            ? 'bg-blue-900 text-white border-blue-900 font-bold shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 font-semibold'
                        }`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1 opacity-80" />
                        <div className="text-xs">{opt.label}</div>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setCustomMinutesMode(true)}
                    className={`p-3 rounded-xl border text-center transition ${
                      customMinutesMode
                        ? 'bg-blue-900 text-white border-blue-900 font-bold shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 font-semibold'
                    }`}
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1 opacity-80" />
                    <div className="text-xs">Custom</div>
                  </button>
                </div>

                {customMinutesMode && (
                  <div className="pt-2 flex items-center gap-3">
                    <input
                      type="range"
                      min={15}
                      max={120}
                      step={5}
                      value={dailyGoalMinutes}
                      onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                      className="flex-1 accent-blue-900"
                    />
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-900 font-bold text-sm border border-blue-200">
                      {dailyGoalMinutes} mins/day
                    </span>
                  </div>
                )}
              </div>

              {/* Preferred Study Days */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Preferred Study Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {STUDY_DAYS.map((day) => {
                    const active = preferredStudyDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleStudyDay(day)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                          active
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Time & Personal Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredStudyTime}
                    onChange={(e) => setPreferredStudyTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Primary Learning Goal
                  </label>
                  <input
                    type="text"
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-800 transition"
                >
                  Continue to Diagnostic Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: MANDATORY COMBINED DIAGNOSTIC LAUNCH */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Step 6 of 6 • Mandatory Initial Assessment
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Ready for Your Combined Diagnostic Quiz
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Before generating your personalized study plan, StudyVerse runs a short combined diagnostic across your selected subjects ({selectedSubjects.join(', ')}).
                </p>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  What Makes This Diagnostic Different?
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-900">1.</span>
                    <span>
                      <strong>Progressive Hints (Hints 1–3):</strong> Stuck on a question? Use guided hints that point you toward the concept without spoiling the answer.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-900">2.</span>
                    <span>
                      <strong>Lucky-Guess Detection:</strong> When you select a correct answer, StudyVerse asks <em>&ldquo;Can you explain why this answer is correct?&rdquo;</em> to separate genuine understanding from lucky guesses.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-900">3.</span>
                    <span>
                      <strong>Prerequisite Discovery:</strong> If a Class {classLevel} mistake stems from an earlier Class 6 or Class 7 concept, StudyVerse automatically unlocks a foundation bridge lesson.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500">Class &amp; Board</div>
                  <div className="text-xs font-bold text-slate-900">
                    Class {classLevel} • {board}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500">Subjects</div>
                  <div className="text-xs font-bold text-slate-900">
                    {selectedSubjects.length} Selected
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500">Priority Focus</div>
                  <div className="text-xs font-bold text-violet-700">
                    {selectedWeakSubjects.length > 0
                      ? selectedWeakSubjects.join(', ')
                      : 'None (Skipped)'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500">Daily Goal</div>
                  <div className="text-xs font-bold text-emerald-700">
                    {dailyGoalMinutes} mins/day
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeToDiagnostic}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition"
                >
                  <BookOpen className="w-4 h-4" />
                  Start Mandatory Combined Diagnostic Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
