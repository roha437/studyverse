import React, { useState } from 'react';
import {
  Student,
  Topic,
  TopicMastery,
  QuizAttempt,
  StudyTask,
  RecommendationSummary,
  SubjectName,
  ClassLevel,
} from '../types/studyverse';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Flame,
  Clock,
  Target,
  Sparkles,
  BookOpen,
  Play,
  HelpCircle,
  TrendingUp,
  Upload,
  CheckCircle2,
  Layers,
  AlertTriangle,
  ArrowRight,
  MessageSquarePlus,
  RefreshCw,
} from 'lucide-react';

interface StudentDashboardViewProps {
  student: Student;
  topics: Topic[];
  masteryMap: Record<string, TopicMastery>;
  attempts: QuizAttempt[];
  tasks: StudyTask[];
  recommendation: RecommendationSummary;
  currentStreak: number;
  totalStudyMinutes: number;
  todayMinutesCompleted: number;
  isDemoData: boolean;
  onNavigateTab: (tab: string) => void;
  onStartTopicLesson: (topicId: string) => void;
  onOpenFoundationLesson: (prereqId: string, parentTopicId: string) => void;
  onStartTargetedQuiz: (topicId: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onOpenDoubtDrawer: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  student,
  topics,
  masteryMap,
  attempts,
  tasks,
  recommendation,
  currentStreak,
  totalStudyMinutes,
  todayMinutesCompleted,
  isDemoData,
  onNavigateTab,
  onStartTopicLesson,
  onOpenFoundationLesson,
  onStartTargetedQuiz,
  onToggleTaskComplete,
  onOpenDoubtDrawer,
}) => {
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  const coreTopics = topics.filter(
    (t) => !t.isFoundationTopic && student.selectedSubjects.includes(t.subject)
  );

  // Subject-wise chart data
  const subjectChartData = student.selectedSubjects.map((subj) => {
    const subjTopics = coreTopics.filter((t) => t.subject === subj);
    const scores = subjTopics.map((t) => masteryMap[t.id]?.performanceScore ?? 0);
    const avg =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    return {
      subject: subj,
      score: avg,
      target: 85,
    };
  });

  const topicChartData = coreTopics.map((t) => ({
    name: t.title.length > 18 ? t.title.slice(0, 18) + '…' : t.title,
    fullTitle: t.title,
    score: masteryMap[t.id]?.performanceScore ?? 0,
    subject: t.subject,
  }));

  const weakTopics = coreTopics.filter((t) => masteryMap[t.id]?.status === 'weak');
  const uncertainTopics = coreTopics.filter((t) => masteryMap[t.id]?.status === 'uncertain');
  const prereqTopic = recommendation.prerequisiteTopicId
    ? topics.find((t) => t.id === recommendation.prerequisiteTopicId)
    : null;

  const goalPct = Math.min(
    100,
    Math.round((todayMinutesCompleted / Math.max(1, student.dailyGoalMinutes)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Continuous Recommendation Shift Alert Banner */}
      {recommendation.changeNotice && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-200 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-100">
                Continuous Recommendation Engine Updated
              </div>
              <p className="text-sm font-bold mt-0.5">{recommendation.changeNotice}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onStartTopicLesson(recommendation.nextTopicId)}
            className="shrink-0 px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition"
          >
            Study New Priority →
          </button>
        </div>
      )}

      {/* Top Student Greeting & Quick Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-xs">
                Class {student.classLevel} • {student.board}
              </span>
              {student.selectedSubjects.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs"
                >
                  {s}
                </span>
              ))}
              {isDemoData && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300">
                  Coherent Class 8 Demo Data Active
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pt-1">
              Welcome back, {student.displayName}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Goal: <strong>{student.learningGoal}</strong>
              {student.selectedWeakSubjects.length > 0 && (
                <>
                  {' '}
                  • Priority Focus:{' '}
                  <strong className="text-violet-700">
                    {student.selectedWeakSubjects.join(', ')}
                  </strong>
                </>
              )}
            </p>
          </div>

          {/* 5 Required Primary Dashboard Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onStartTopicLesson(recommendation.nextTopicId)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Continue Learning
            </button>
            <button
              type="button"
              onClick={() => onStartTargetedQuiz(recommendation.nextTopicId)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
            >
              <Play className="w-3.5 h-3.5" />
              Take Quiz
            </button>
            <button
              type="button"
              onClick={onOpenDoubtDrawer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-900 border border-violet-200 font-bold text-xs transition"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-violet-600" />
              Ask a Doubt
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('progress')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              View Progress
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('resources')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Resources
            </button>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Today&rsquo;s Study Goal</span>
              <Clock className="w-4 h-4 text-blue-900" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {todayMinutesCompleted} / {student.dailyGoalMinutes} mins
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${goalPct}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Current Streak</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {currentStreak} Days 🔥
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              Next badge at 10 days (Bronze)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Total Study Time</span>
              <TrendingUp className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {totalStudyMinutes} mins
            </div>
            <div className="text-[11px] text-slate-500">
              Across {attempts.length} quiz observations
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Learning Gaps Active</span>
              <Target className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {weakTopics.length} Weak • {uncertainTopics.length} Uncertain
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('gaps')}
              className="text-[11px] font-bold text-blue-900 hover:underline"
            >
              Inspect Evidence →
            </button>
          </div>
        </div>
      </div>

      {/* CENTRAL QUESTION & RECOMMENDED NEXT TOPIC HERO CARD */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 text-xs font-bold border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            What Should You Study Next? (Evidence-Driven Priority #1)
          </div>
          <button
            type="button"
            onClick={() => setShowWhyModal(!showWhyModal)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold text-white border border-white/20 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-300" />
            {showWhyModal ? 'Hide Explanation' : 'Why this recommendation?'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">
              {recommendation.subject} • {recommendation.chapter}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {recommendation.nextTopicTitle}
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              {recommendation.whyStudyNext}
            </p>
            <p className="text-xs text-sky-200">
              <strong>Current Evidence:</strong> {recommendation.evidenceSummary} (Mastery Score:{' '}
              {recommendation.score}% • {recommendation.confidence})
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-2.5">
            {prereqTopic && (
              <button
                type="button"
                onClick={() =>
                  onOpenFoundationLesson(prereqTopic.id, recommendation.nextTopicId)
                }
                className="w-full px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow transition"
              >
                <Layers className="w-4 h-4" />
                Start Class {prereqTopic.classLevel} Foundation Bridge ({prereqTopic.estimatedMinutes}m)
              </button>
            )}
            <button
              type="button"
              onClick={() => onStartTopicLesson(recommendation.nextTopicId)}
              className="w-full px-4 py-3 rounded-xl bg-white hover:bg-blue-50 text-blue-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow transition"
            >
              <BookOpen className="w-4 h-4" />
              Open {recommendation.nextTopicTitle} Lesson
            </button>
            <button
              type="button"
              onClick={() => onStartTargetedQuiz(recommendation.nextTopicId)}
              className="w-full px-4 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-white border border-sky-400/40 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Play className="w-3.5 h-3.5" />
              Take Targeted Reassessment Quiz
            </button>
          </div>
        </div>

        {/* Expandable "Why this recommendation?" Evidence Drawer */}
        {showWhyModal && (
          <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-xs space-y-2 mt-2">
            <div className="font-extrabold text-sky-200 uppercase tracking-wider">
              Explainable AI Recommendation Breakdown:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="font-bold text-white">1. What to study next:</span>
                <p className="text-blue-100 mt-0.5">
                  {prereqTopic
                    ? `First review Class ${prereqTopic.classLevel} "${prereqTopic.title}", then practice Class 8 "${recommendation.nextTopicTitle}".`
                    : `Focus on "${recommendation.nextTopicTitle}" (${recommendation.chapter}).`}
                </p>
              </div>
              <div>
                <span className="font-bold text-white">2. Why study it now:</span>
                <p className="text-blue-100 mt-0.5">{recommendation.whyStudyNext}</p>
              </div>
              <div>
                <span className="font-bold text-white">3. Supporting evidence:</span>
                <p className="text-blue-100 mt-0.5">{recommendation.evidenceSummary}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts & Today's Study Plan Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject & Topic Mastery Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Topic-Wise Mastery Overview (%)
              </h3>
              <p className="text-xs text-slate-500">
                Combines answer accuracy and written reasoning verification
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Target: 80%+
            </span>
          </div>

          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicChartData} margin={{ top: 10, right: 16, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip />
                <Bar dataKey="score" name="Mastery Score (%)" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Adaptive Study Plan */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Today&rsquo;s Study Plan ({student.dailyGoalMinutes}m)
                </h3>
                <p className="text-xs text-slate-500">
                  Check off tasks to build your daily goal &amp; streak
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('planner')}
                className="text-xs font-bold text-blue-900 hover:underline"
              >
                Full Planner →
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => {
                const done = task.completionStatus === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      done
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className={`text-xs font-bold truncate ${
                          done ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {task.estimatedMinutes} mins • {task.priority} Priority
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleTaskComplete(task.id)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        done
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white hover:bg-blue-50 text-blue-900 border border-slate-300'
                      }`}
                    >
                      {done ? 'Done ✓' : 'Complete'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Quiz Results */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Latest Quiz Observations ({attempts.length})
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {attempts
                .slice(-3)
                .reverse()
                .map((att) => {
                  const t = topics.find((x) => x.id === att.topicId);
                  return (
                    <div
                      key={att.id}
                      className="text-xs flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70"
                    >
                      <span className="font-semibold text-slate-800 truncate pr-2">
                        {t?.title || att.topicId}
                      </span>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded font-bold text-[10px] ${
                          att.isCorrect && att.reasoningQuality === 'strong'
                            ? 'bg-emerald-100 text-emerald-800'
                            : att.isCorrect
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {att.isCorrect
                          ? att.reasoningQuality === 'strong'
                            ? 'Correct + Strong Reasoning'
                            : 'Correct (Uncertain Reasoning)'
                          : 'Needs Review'}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProgressAnalyticsViewProps {
  student: Student;
  topics: Topic[];
  masteryMap: Record<string, TopicMastery>;
  attempts: QuizAttempt[];
}

export const ProgressAnalyticsView: React.FC<ProgressAnalyticsViewProps> = ({
  student,
  topics,
  masteryMap,
  attempts,
}) => {
  const coreTopics = topics.filter((t) => !t.isFoundationTopic);
  const subjectData = student.selectedSubjects.map((subj) => {
    const relevant = coreTopics.filter((t) => t.subject === subj);
    const avg =
      relevant.length > 0
        ? Math.round(
            relevant.reduce((acc, t) => acc + (masteryMap[t.id]?.performanceScore ?? 0), 0) /
              relevant.length
          )
        : 0;
    return { subject: subj, mastery: avg };
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
          Evidence &amp; Mastery Analytics
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Subject &amp; Reasoning Progress Report
        </h2>
        <div className="relative h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 12, fill: '#334155' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#334155' }} />
              <Tooltip />
              <Bar dataKey="mastery" name="Subject Mastery (%)" fill="#0284c7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attempt Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">
          Complete Diagnostic &amp; Practice Reasoning Log ({attempts.length})
        </h3>
        <div className="space-y-3">
          {attempts
            .slice()
            .reverse()
            .map((a) => {
              const t = topics.find((x) => x.id === a.topicId);
              return (
                <div
                  key={a.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">
                      {t?.title || a.topicId} ({a.subject})
                    </div>
                    <p className="text-slate-600">{a.interpretationLabel}</p>
                    {a.reasoningText && (
                      <p className="text-slate-500 italic">
                        Reasoning: &ldquo;{a.reasoningText}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200 font-semibold">
                      Confidence: {a.confidenceRating}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200 font-semibold">
                      Hints: {a.hintCount}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

interface ProfileSettingsViewProps {
  student: Student;
  onUpdateStudent: (updated: Student) => void;
  onResetToOnboarding: () => void;
  onReloadClass8Demo: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  student,
  onUpdateStudent,
  onResetToOnboarding,
  onReloadClass8Demo,
}) => {
  const [name, setName] = useState(student.displayName);
  const [cls, setCls] = useState<ClassLevel>(student.classLevel);
  const [mins, setMins] = useState<number>(student.dailyGoalMinutes);
  const [goal, setGoal] = useState<string>(student.learningGoal);
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent({
      ...student,
      displayName: name.trim() || 'Student',
      classLevel: cls,
      dailyGoalMinutes: mins,
      learningGoal: goal,
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5"
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Student Preferences &amp; Schedule Configuration
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Profile &amp; Learning Settings
          </h2>
        </div>

        {savedBanner && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
            ✓ Settings saved! Your adaptive study plan and daily goal have been updated.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Class (6–10)</label>
            <select
              value={cls}
              onChange={(e) => setCls(Number(e.target.value) as ClassLevel)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
            >
              {[6, 7, 8, 9, 10].map((c) => (
                <option key={c} value={c}>
                  Class {c} (CBSE)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Daily Study Duration Goal (Mins)
            </label>
            <input
              type="number"
              min={15}
              max={180}
              step={5}
              value={mins}
              onChange={(e) => setMins(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Learning Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onResetToOnboarding}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
            >
              Restart Onboarding Wizard
            </button>
            <button
              type="button"
              onClick={onReloadClass8Demo}
              className="px-4 py-2 rounded-xl bg-sky-50 text-sky-900 border border-sky-200 font-bold text-xs hover:bg-sky-100"
            >
              Reset to Default Class 8 Demo State
            </button>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
