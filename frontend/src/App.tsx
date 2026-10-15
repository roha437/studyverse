import React, { useState, useEffect } from 'react';
import {
  Student,
  QuizAttempt,
  TopicMastery,
  StudyTask,
  StudySession,
  Achievement,
  UploadedResource,
  SubjectName,
} from './types/studyverse';
import {
  CURRICULUM_TOPICS,
  QUIZ_QUESTIONS,
  TEXTBOOK_PASSAGES,
  INITIAL_ACHIEVEMENTS,
} from './data/curriculumData';
import {
  recomputeTopicMasteryMap,
  buildStudyPlanAndRecommendation,
} from './services/recommendationEngine';
import { StudyVerseLogo, LandingPage } from './components/BrandAndLanding';
import { OnboardingWizard } from './components/OnboardingWizard';
import { QuizRunner, DiagnosticResultsView } from './components/QuizEngine';
import { LearningGapsView, LearnTopicView } from './components/LearningAndGaps';
import {
  AITutorView,
  StudyPlannerView,
  StreaksAchievementsView,
  MyResourcesView,
  AskDoubtDrawer,
} from './components/TutorPlannerResources';
import {
  StudentDashboardView,
  ProgressAnalyticsView,
  ProfileSettingsView,
} from './components/DashboardAndProgress';
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  CheckSquare,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Award,
  FolderUp,
  Settings,
  MessageSquarePlus,
  Menu,
  X,
  Sparkles,
  CheckCircle2,
  Play,
} from 'lucide-react';

const DEFAULT_DEMO_STUDENT: Student = {
  id: 'stu-class8-demo',
  displayName: 'Aarav Sharma',
  classLevel: 8,
  board: 'CBSE',
  selectedSubjects: ['Mathematics', 'Science'],
  selectedWeakSubjects: ['Mathematics'],
  dailyGoalMinutes: 30,
  preferredStudyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  preferredStudyTime: 'Evening (5:30 PM – 7:30 PM)',
  learningGoal: 'Strengthen foundations and master Class 8 Science & Mathematics',
  diagnosticCompleted: true,
  timezone: 'Asia/Kolkata',
};

const DEFAULT_DEMO_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'demo-att-1',
    studentId: 'stu-class8-demo',
    questionId: 'q-diag-math-linear-1',
    topicId: 'math-8-linear-eq',
    subject: 'Mathematics',
    selectedAnswer: 0,
    isCorrect: false,
    reasoningText: 'I subtracted 7 from 8 instead of adding 7 when transposing.',
    reasoningQuality: 'misconception',
    interpretationLabel:
      'Incorrect answer with a misconception: sign transposition gap (requires Class 7 Simple Equations foundation review).',
    confidenceRating: 'Low',
    hintCount: 2,
    timestamp: '2026-10-15T09:10:00Z',
  },
  {
    id: 'demo-att-2',
    studentId: 'stu-class8-demo',
    questionId: 'q-diag-math-alg-1',
    topicId: 'math-8-algebraic-expr',
    subject: 'Mathematics',
    selectedAnswer: 2,
    isCorrect: true,
    reasoningText: 'I picked the option with 12xy in the middle.',
    reasoningQuality: 'weak_or_missing',
    interpretationLabel:
      'Correct answer with weak or missing reasoning: uncertain understanding (potential lucky guess).',
    confidenceRating: 'Low',
    hintCount: 1,
    timestamp: '2026-10-15T09:14:00Z',
  },
  {
    id: 'demo-att-3',
    studentId: 'stu-class8-demo',
    questionId: 'q-diag-sci-pressure-1',
    topicId: 'sci-8-force-pressure',
    subject: 'Science',
    selectedAnswer: 0,
    isCorrect: true,
    reasoningText:
      'Because Pressure = Force / Area, Position X (0.02 m^2) has 1/3 the area of Position Y (0.06 m^2), producing 3x higher pressure (1500 Pa vs 500 Pa).',
    reasoningQuality: 'strong',
    interpretationLabel:
      'Correct answer with strong reasoning: solid evidence of conceptual understanding.',
    confidenceRating: 'High',
    hintCount: 0,
    timestamp: '2026-10-15T09:18:00Z',
  },
  {
    id: 'demo-att-4',
    studentId: 'stu-class8-demo',
    questionId: 'q-diag-sci-chem-1',
    topicId: 'sci-8-chemical-effects',
    subject: 'Science',
    selectedAnswer: 1,
    isCorrect: true,
    reasoningText:
      'Distilled water has no free ions, while dissolved NaCl dissociates into mobile Na+ and Cl- ions that conduct current.',
    reasoningQuality: 'strong',
    interpretationLabel:
      'Correct answer with strong reasoning: solid evidence of conceptual understanding.',
    confidenceRating: 'High',
    hintCount: 0,
    timestamp: '2026-10-15T09:22:00Z',
  },
];

const INITIAL_SESSIONS: StudySession[] = [
  { id: 's-1', date: '2026-10-02', durationMinutes: 30, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-2', date: '2026-10-03', durationMinutes: 35, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-3', date: '2026-10-04', durationMinutes: 15, completedTasks: ['t1'], goalCompleted: false },
  { id: 's-4', date: '2026-10-05', durationMinutes: 30, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-5', date: '2026-10-06', durationMinutes: 30, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-6', date: '2026-10-07', durationMinutes: 40, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-7', date: '2026-10-08', durationMinutes: 30, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-8', date: '2026-10-09', durationMinutes: 30, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-9', date: '2026-10-10', durationMinutes: 35, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-10', date: '2026-10-11', durationMinutes: 30, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-11', date: '2026-10-12', durationMinutes: 30, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-12', date: '2026-10-13', durationMinutes: 30, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-13', date: '2026-10-14', durationMinutes: 30, completedTasks: ['t1'], goalCompleted: true },
  { id: 's-14', date: '2026-10-15', durationMinutes: 20, completedTasks: ['t1'], goalCompleted: false },
];

const INITIAL_RESOURCES: UploadedResource[] = [
  {
    id: 'res-seed-1',
    fileName: 'NCERT_Class8_Math_Ch2_Linear_Equations.pdf',
    fileSizeBytes: 2411724,
    subject: 'Mathematics',
    classLevel: 8,
    uploadProgress: 100,
    validationStatus: 'valid',
    processingStatus: 'indexed_demo',
    statusMessage:
      'Validated PDF (2.30 MB). Indexed 18 textbook chunks with Class 8 Ch 2 page metadata.',
    uploadedAt: '2026-10-14',
    chunksExtracted: 18,
  },
  {
    id: 'res-seed-2',
    fileName: 'NCERT_Class8_Science_Ch8_Force_And_Pressure.pdf',
    fileSizeBytes: 3145728,
    subject: 'Science',
    classLevel: 8,
    uploadProgress: 100,
    validationStatus: 'valid',
    processingStatus: 'indexed_demo',
    statusMessage:
      'Validated PDF (3.00 MB). Indexed 22 textbook chunks with Class 8 Ch 8 page metadata.',
    uploadedAt: '2026-10-14',
    chunksExtracted: 22,
  },
];

export default function App() {
  const [appScreen, setAppScreen] = useState<
    'landing' | 'onboarding' | 'diagnostic_quiz' | 'diagnostic_results' | 'main_app'
  >('landing');

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [doubtDrawerOpen, setDoubtDrawerOpen] = useState<boolean>(false);
  const [doubtContext, setDoubtContext] = useState<{
    subject: SubjectName;
    topicTitle: string;
    chapter: string;
  }>({
    subject: 'Mathematics',
    topicTitle: 'Linear Equations in One Variable',
    chapter: 'Class 8 Ch 2: Linear Equations in One Variable',
  });

  const [student, setStudent] = useState<Student>(DEFAULT_DEMO_STUDENT);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(DEFAULT_DEMO_ATTEMPTS);
  const [masteryMap, setMasteryMap] = useState<Record<string, TopicMastery>>(() =>
    recomputeTopicMasteryMap(DEFAULT_DEMO_STUDENT.id, CURRICULUM_TOPICS, DEFAULT_DEMO_ATTEMPTS, {})
  );

  const initialPlanAndRec = buildStudyPlanAndRecommendation(
    DEFAULT_DEMO_STUDENT,
    CURRICULUM_TOPICS,
    masteryMap,
    null
  );

  const [tasks, setTasks] = useState<StudyTask[]>(initialPlanAndRec.tasks);
  const [recommendation, setRecommendation] = useState(initialPlanAndRec.recommendation);

  const [activeLearnTopicId, setActiveLearnTopicId] = useState<string>('math-8-linear-eq');
  const [returnToTopicId, setReturnToTopicId] = useState<string | null>(null);
  const [targetedQuizTopicId, setTargetedQuizTopicId] = useState<string | null>(null);

  const [currentStreak, setCurrentStreak] = useState<number>(9);
  const [longestStreak, setLongestStreak] = useState<number>(12);
  const [todayMinutesCompleted, setTodayMinutesCompleted] = useState<number>(20);
  const [todayGoalMet, setTodayGoalMet] = useState<boolean>(false);
  const [totalStudyMinutes, setTotalStudyMinutes] = useState<number>(385);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [sessions, setSessions] = useState<StudySession[]>(INITIAL_SESSIONS);
  const [resources, setResources] = useState<UploadedResource[]>(INITIAL_RESOURCES);
  const [isDemoData, setIsDemoData] = useState<boolean>(true);
  const [showJourneyHelper, setShowJourneyHelper] = useState<boolean>(true);

  // Persist key state safely in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'studyverse_state_v1',
        JSON.stringify({
          student,
          attemptsCount: attempts.length,
          currentStreak,
          todayMinutesCompleted,
        })
      );
    } catch {
      // Ignore storage errors in sandboxed iframes
    }
  }, [student, attempts, currentStreak, todayMinutesCompleted]);

  const refreshEngineState = (
    nextStudent: Student,
    nextAttempts: QuizAttempt[],
    prevMastery: Record<string, TopicMastery>,
    prevTopId: string | null
  ) => {
    const newMastery = recomputeTopicMasteryMap(
      nextStudent.id,
      CURRICULUM_TOPICS,
      nextAttempts,
      prevMastery
    );
    const { tasks: newTasks, recommendation: newRec } = buildStudyPlanAndRecommendation(
      nextStudent,
      CURRICULUM_TOPICS,
      newMastery,
      prevTopId
    );
    setMasteryMap(newMastery);
    setTasks(newTasks);
    setRecommendation(newRec);
  };

  const recordStudyMinutes = (addedMinutes: number) => {
    const updatedToday = todayMinutesCompleted + addedMinutes;
    setTodayMinutesCompleted(updatedToday);
    setTotalStudyMinutes((prev) => prev + addedMinutes);

    // Count day streak once when daily goal is reached (prevent duplicate increments)
    if (!todayGoalMet && updatedToday >= student.dailyGoalMinutes) {
      const nextStreak = currentStreak + 1;
      setTodayGoalMet(true);
      setCurrentStreak(nextStreak);
      if (nextStreak > longestStreak) {
        setLongestStreak(nextStreak);
      }
      setSessions((prev) =>
        prev.map((s, idx) =>
          idx === prev.length - 1
            ? { ...s, durationMinutes: updatedToday, goalCompleted: true }
            : s
        )
      );
      // Unlock Bronze Learner at 10 consecutive days!
      if (nextStreak >= 10) {
        setAchievements((prev) =>
          prev.map((a) =>
            a.id === 'ach-bronze'
              ? { ...a, unlocked: true, earnedAt: '2026-10-15' }
              : a
          )
        );
      }
    } else {
      setSessions((prev) =>
        prev.map((s, idx) =>
          idx === prev.length - 1 ? { ...s, durationMinutes: updatedToday } : s
        )
      );
    }
  };

  // Onboarding finish -> Start mandatory combined diagnostic
  const handleCompleteOnboarding = (updatedStudent: Student) => {
    setStudent(updatedStudent);
    setIsDemoData(false);
    setAppScreen('diagnostic_quiz');
  };

  // Finish Diagnostic Quiz
  const handleFinishDiagnostic = (newAttempts: QuizAttempt[]) => {
    const updatedStudent = { ...student, diagnosticCompleted: true };
    setStudent(updatedStudent);
    setAttempts(newAttempts);
    refreshEngineState(updatedStudent, newAttempts, {}, null);
    recordStudyMinutes(10);
    setAppScreen('diagnostic_results');
  };

  // Quick-fill realistic diagnostic so user can test diagnostic results in 1 click if desired
  const handleAutoSimulateDiagnostic = () => {
    handleFinishDiagnostic(DEFAULT_DEMO_ATTEMPTS);
  };

  // Open Earlier-Class Foundation Lesson
  const handleOpenFoundationLesson = (prereqTopicId: string, parentTopicId: string) => {
    setActiveLearnTopicId(prereqTopicId);
    setReturnToTopicId(parentTopicId);
    setTargetedQuizTopicId(null);
    setAppScreen('main_app');
    setActiveTab('learn');
  };

  // Complete Foundation Lesson -> Return to Original Topic
  const handleCompleteFoundationLesson = (
    foundationTopicId: string,
    parentTopicId: string | null
  ) => {
    const targetParent = parentTopicId || 'math-8-linear-eq';
    const updatedMastery: Record<string, TopicMastery> = {
      ...masteryMap,
      [foundationTopicId]: {
        ...(masteryMap[foundationTopicId] || {
          studentId: student.id,
          topicId: foundationTopicId,
          performanceScore: 90,
          evidenceCount: 1,
          masteryConfidence: 'Foundation Completed',
          status: 'strong',
          lastAssessedAt: new Date().toISOString(),
          observedErrors: [],
          prerequisiteGapIds: [],
        }),
        foundationCompleted: true,
        status: 'strong',
      },
      [targetParent]: {
        ...(masteryMap[targetParent] || {
          studentId: student.id,
          topicId: targetParent,
          performanceScore: 50,
          evidenceCount: 1,
          masteryConfidence: 'Foundation Completed',
          status: 'uncertain',
          lastAssessedAt: new Date().toISOString(),
          observedErrors: [],
        }),
        foundationCompleted: true,
        prerequisiteGapIds: [],
      },
    };

    setMasteryMap(updatedMastery);
    const { tasks: newTasks, recommendation: newRec } = buildStudyPlanAndRecommendation(
      student,
      CURRICULUM_TOPICS,
      updatedMastery,
      recommendation.nextTopicId
    );
    setTasks(newTasks);
    setRecommendation(newRec);

    // Unlock Foundation Builder badge
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === 'ach-foundation'
          ? { ...a, unlocked: true, earnedAt: '2026-10-15' }
          : a
      )
    );

    recordStudyMinutes(12);
    setActiveLearnTopicId(targetParent);
    setReturnToTopicId(null);
  };

  // Start Targeted Practice Quiz on a Topic
  const handleStartTargetedQuiz = (topicId: string) => {
    setTargetedQuizTopicId(topicId);
    setAppScreen('main_app');
    setActiveTab('quizzes');
  };

  // Finish Targeted Practice Quiz -> Continuous Recommendation Update!
  const handleFinishTargetedQuiz = (newQuizAttempts: QuizAttempt[]) => {
    const prevTopId = recommendation.nextTopicId;
    const combinedAttempts = [...attempts, ...newQuizAttempts];
    setAttempts(combinedAttempts);
    refreshEngineState(student, combinedAttempts, masteryMap, prevTopId);
    recordStudyMinutes(10);
    setTargetedQuizTopicId(null);
    setActiveTab('dashboard');
  };

  // Toggle Study Task Completion
  const handleToggleTaskComplete = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    const becomingCompleted = target.completionStatus !== 'completed';
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, completionStatus: becomingCompleted ? 'completed' : 'pending' }
          : t
      )
    );
    if (becomingCompleted) {
      recordStudyMinutes(target.estimatedMinutes);
    }
  };

  const handleRescheduleTask = (taskId: string, newDay: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              scheduledDay: newDay,
              completionStatus: newDay === 'Today' ? 'pending' : 'rescheduled',
            }
          : t
      )
    );
  };

  // Filter diagnostic questions based on student's selected subjects
  const diagnosticQuestions = QUIZ_QUESTIONS.filter(
    (q) => q.isDiagnostic && student.selectedSubjects.includes(q.subject)
  );

  // Filter targeted practice questions for the chosen topic
  const activeTargetedQuestions = targetedQuizTopicId
    ? QUIZ_QUESTIONS.filter((q) => q.topicId === targetedQuizTopicId)
    : QUIZ_QUESTIONS.filter((q) => q.topicId === recommendation.nextTopicId);

  if (appScreen === 'landing') {
    return (
      <LandingPage
        onStartOnboarding={() => setAppScreen('onboarding')}
        onLoadPrebuiltDemo={() => {
          setStudent(DEFAULT_DEMO_STUDENT);
          setAttempts(DEFAULT_DEMO_ATTEMPTS);
          const m = recomputeTopicMasteryMap(
            DEFAULT_DEMO_STUDENT.id,
            CURRICULUM_TOPICS,
            DEFAULT_DEMO_ATTEMPTS,
            {}
          );
          const pr = buildStudyPlanAndRecommendation(
            DEFAULT_DEMO_STUDENT,
            CURRICULUM_TOPICS,
            m,
            null
          );
          setMasteryMap(m);
          setTasks(pr.tasks);
          setRecommendation(pr.recommendation);
          setIsDemoData(true);
          setAppScreen('main_app');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  if (appScreen === 'onboarding') {
    return (
      <OnboardingWizard
        initialStudent={student}
        onCompleteOnboarding={handleCompleteOnboarding}
        onCancelToLanding={() => setAppScreen('landing')}
      />
    );
  }

  if (appScreen === 'diagnostic_quiz') {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-8 flex items-center justify-between">
          <StudyVerseLogo size="sm" />
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Step 6: Mandatory Combined Diagnostic
          </span>
        </header>
        <QuizRunner
          mode="diagnostic"
          questions={
            diagnosticQuestions.length > 0 ? diagnosticQuestions : QUIZ_QUESTIONS.slice(0, 4)
          }
          studentId={student.id}
          onFinishQuiz={handleFinishDiagnostic}
          onAutoSimulateDiagnostic={handleAutoSimulateDiagnostic}
        />
      </div>
    );
  }

  if (appScreen === 'diagnostic_results') {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-8 flex items-center justify-between">
          <StudyVerseLogo size="sm" />
          <button
            type="button"
            onClick={() => {
              setAppScreen('main_app');
              setActiveTab('dashboard');
            }}
            className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs"
          >
            Continue to Dashboard →
          </button>
        </header>
        <DiagnosticResultsView
          attempts={attempts}
          topics={CURRICULUM_TOPICS}
          masteryMap={masteryMap}
          onOpenFoundationLesson={handleOpenFoundationLesson}
          onGoToDashboard={() => {
            setAppScreen('main_app');
            setActiveTab('dashboard');
          }}
          onGoToLearningGaps={() => {
            setAppScreen('main_app');
            setActiveTab('gaps');
          }}
        />
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'tutor', label: 'AI Tutor', icon: Brain },
    { id: 'quizzes', label: 'Quizzes', icon: CheckSquare },
    { id: 'gaps', label: 'My Learning Gaps', icon: AlertTriangle },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'resources', label: 'My Resources', icon: FolderUp },
    { id: 'settings', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200 shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-slate-100">
          <StudyVerseLogo size="sm" />
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition ${
                  active
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Persistent Ask a Doubt Action in Sidebar */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <button
            type="button"
            onClick={() => setDoubtDrawerOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-900 hover:from-sky-500 hover:to-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Ask a Doubt
          </button>
          <button
            type="button"
            onClick={() => setAppScreen('landing')}
            className="w-full py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 text-center"
          >
            ← Back to Landing Page
          </button>
        </div>
      </aside>

      {/* Mobile Top Header & Drawer */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between">
        <StudyVerseLogo size="sm" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDoubtDrawerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center gap-1"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            Doubt
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 text-slate-700"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-3 grid grid-cols-2 gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  active ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Interactive 16-Step Demonstration Walkthrough Bar */}
        {showJourneyHelper && (
          <div className="bg-slate-900 text-white px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30">
                16-Step Demo Walkthrough
              </span>
              <button
                type="button"
                onClick={() => setAppScreen('onboarding')}
                className="hover:underline text-slate-200"
              >
                1–5. Onboarding
              </button>
              <span>→</span>
              <button
                type="button"
                onClick={() => setAppScreen('diagnostic_quiz')}
                className="hover:underline text-slate-200"
              >
                6–8. Diagnostic &amp; Hints
              </button>
              <span>→</span>
              <button
                type="button"
                onClick={() => setActiveTab('gaps')}
                className="hover:underline text-amber-300 font-semibold"
              >
                9–10. Gaps &amp; Class 7 Prereq
              </button>
              <span>→</span>
              <button
                type="button"
                onClick={() =>
                  handleOpenFoundationLesson('math-7-simple-eq', 'math-8-linear-eq')
                }
                className="hover:underline text-emerald-300 font-semibold"
              >
                11–12. Foundation Lesson
              </button>
              <span>→</span>
              <button
                type="button"
                onClick={() => handleStartTargetedQuiz('math-8-linear-eq')}
                className="hover:underline text-sky-300 font-semibold"
              >
                13–15. Practice Quiz &amp; Rec Shift
              </button>
              <span>→</span>
              <button
                type="button"
                onClick={() => setActiveTab('planner')}
                className="hover:underline text-violet-300 font-semibold"
              >
                16. Complete Task &amp; Streak
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowJourneyHelper(false)}
              className="text-slate-400 hover:text-white text-[11px]"
            >
              Hide Bar ✕
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <StudentDashboardView
              student={student}
              topics={CURRICULUM_TOPICS}
              masteryMap={masteryMap}
              attempts={attempts}
              tasks={tasks}
              recommendation={recommendation}
              currentStreak={currentStreak}
              totalStudyMinutes={totalStudyMinutes}
              todayMinutesCompleted={todayMinutesCompleted}
              isDemoData={isDemoData}
              onNavigateTab={setActiveTab}
              onStartTopicLesson={(tid) => {
                setActiveLearnTopicId(tid);
                setActiveTab('learn');
              }}
              onOpenFoundationLesson={handleOpenFoundationLesson}
              onStartTargetedQuiz={handleStartTargetedQuiz}
              onToggleTaskComplete={handleToggleTaskComplete}
              onOpenDoubtDrawer={() => setDoubtDrawerOpen(true)}
            />
          )}

          {activeTab === 'learn' && (
            <LearnTopicView
              topics={CURRICULUM_TOPICS}
              activeTopicId={activeLearnTopicId}
              returnToTopicId={returnToTopicId}
              masteryMap={masteryMap}
              onSelectTopic={(tid) => setActiveLearnTopicId(tid)}
              onOpenFoundationLesson={handleOpenFoundationLesson}
              onCompleteFoundationLesson={handleCompleteFoundationLesson}
              onStartTargetedQuiz={handleStartTargetedQuiz}
              onOpenDoubtWithContext={(subject, topicTitle, chapter) => {
                setDoubtContext({ subject, topicTitle, chapter });
                setDoubtDrawerOpen(true);
              }}
            />
          )}

          {activeTab === 'tutor' && (
            <AITutorView
              student={student}
              topics={CURRICULUM_TOPICS}
              passages={TEXTBOOK_PASSAGES}
              onStartTargetedQuiz={handleStartTargetedQuiz}
            />
          )}

          {activeTab === 'quizzes' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    Adaptive Assessment Center
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Targeted Topic Quizzes &amp; Diagnostic Retake
                  </h2>
                  <p className="text-xs text-slate-600">
                    Select any topic below to take a targeted practice quiz with 3-stage hints and reasoning verification.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CURRICULUM_TOPICS.filter((t) => !t.isFoundationTopic).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTargetedQuizTopicId(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        (targetedQuizTopicId || recommendation.nextTopicId) === t.id
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.title}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAppScreen('diagnostic_quiz')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-50 text-violet-900 border border-violet-200 hover:bg-violet-100"
                  >
                    Retake Full Diagnostic
                  </button>
                </div>
              </div>

              <QuizRunner
                key={targetedQuizTopicId || recommendation.nextTopicId}
                mode="targeted"
                questions={
                  activeTargetedQuestions.length > 0
                    ? activeTargetedQuestions
                    : QUIZ_QUESTIONS.slice(0, 2)
                }
                studentId={student.id}
                onFinishQuiz={handleFinishTargetedQuiz}
              />
            </div>
          )}

          {activeTab === 'gaps' && (
            <LearningGapsView
              topics={CURRICULUM_TOPICS}
              masteryMap={masteryMap}
              attempts={attempts}
              onOpenFoundationLesson={handleOpenFoundationLesson}
              onStartTopicLesson={(tid) => {
                setActiveLearnTopicId(tid);
                setActiveTab('learn');
              }}
              onStartTargetedQuiz={handleStartTargetedQuiz}
            />
          )}

          {activeTab === 'planner' && (
            <StudyPlannerView
              student={student}
              tasks={tasks}
              todayMinutesCompleted={todayMinutesCompleted}
              onToggleTaskComplete={handleToggleTaskComplete}
              onRescheduleTask={handleRescheduleTask}
              onUpdateDailyGoalMinutes={(mins) => {
                const updated = { ...student, dailyGoalMinutes: mins };
                setStudent(updated);
                refreshEngineState(updated, attempts, masteryMap, recommendation.nextTopicId);
              }}
              onNavigateToTaskTopic={(topicId, taskType) => {
                if (taskType === 'targeted_practice' || taskType === 'reassessment_quiz') {
                  handleStartTargetedQuiz(topicId);
                } else {
                  setActiveLearnTopicId(topicId);
                  setActiveTab('learn');
                }
              }}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressAnalyticsView
              student={student}
              topics={CURRICULUM_TOPICS}
              masteryMap={masteryMap}
              attempts={attempts}
            />
          )}

          {activeTab === 'achievements' && (
            <StreaksAchievementsView
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              todayMinutesCompleted={todayMinutesCompleted}
              dailyGoalMinutes={student.dailyGoalMinutes}
              todayGoalMet={todayGoalMet}
              achievements={achievements}
              sessions={sessions}
            />
          )}

          {activeTab === 'resources' && (
            <MyResourcesView
              resources={resources}
              onAddResource={(res) => setResources((prev) => [res, ...prev])}
            />
          )}

          {activeTab === 'settings' && (
            <ProfileSettingsView
              student={student}
              onUpdateStudent={(updated) => {
                setStudent(updated);
                refreshEngineState(updated, attempts, masteryMap, recommendation.nextTopicId);
              }}
              onResetToOnboarding={() => setAppScreen('onboarding')}
              onReloadClass8Demo={() => {
                setStudent(DEFAULT_DEMO_STUDENT);
                setAttempts(DEFAULT_DEMO_ATTEMPTS);
                refreshEngineState(DEFAULT_DEMO_STUDENT, DEFAULT_DEMO_ATTEMPTS, {}, null);
                setIsDemoData(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Persistent Floating Ask a Doubt Trigger (Bottom Right) */}
      <button
        type="button"
        onClick={() => setDoubtDrawerOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs shadow-xl border-2 border-sky-400/50 transition"
      >
        <MessageSquarePlus className="w-4 h-4 text-sky-300" />
        <span>Ask a Doubt</span>
      </button>

      {/* Doubt-Solving Slide-Over Drawer */}
      <AskDoubtDrawer
        isOpen={doubtDrawerOpen}
        onClose={() => setDoubtDrawerOpen(false)}
        defaultSubject={doubtContext.subject}
        defaultTopicTitle={doubtContext.topicTitle}
        defaultChapter={doubtContext.chapter}
        classLevel={student.classLevel}
        passages={TEXTBOOK_PASSAGES}
      />
    </div>
  );
}
