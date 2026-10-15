import React, { useState } from 'react';
import {
  Student,
  Topic,
  StudyTask,
  StudySession,
  Achievement,
  TextbookPassage,
  UploadedResource,
  SubjectName,
  ClassLevel,
} from '../types/studyverse';
import { queryTextbookRAG } from '../services/recommendationEngine';
import {
  Brain,
  BookOpen,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  Calendar,
  Flame,
  Award,
  Upload,
  FileText,
  AlertCircle,
  X,
  Play,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

interface ChatTurn {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  citations?: TextbookPassage[];
  grounded?: boolean;
  followUps?: string[];
}

interface AITutorViewProps {
  student: Student;
  topics: Topic[];
  passages: TextbookPassage[];
  onStartTargetedQuiz: (topicId: string) => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  student,
  topics,
  passages,
  onStartTargetedQuiz,
}) => {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(student.classLevel);
  const [selectedSubject, setSelectedSubject] = useState<SubjectName>('Mathematics');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('math-8-linear-eq');
  const [inputQuery, setInputQuery] = useState<string>('');
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      id: 'init-1',
      role: 'tutor',
      text: 'Hello! I am your StudyVerse NCERT Textbook Tutor (Demo Mode • Deterministic RAG). Select a class, subject, and chapter, then ask any conceptual question, request a simpler explanation, or ask for a worked example.',
      citations: [passages[0]],
      grounded: true,
      followUps: [
        'How do I solve linear equations with variables on both sides?',
        'Why does (a - b)^2 have a middle term -2ab?',
        'How does contact area affect pressure in Pascals?',
      ],
    },
  ]);

  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  const handleSendQuery = (
    queryText: string,
    mode: 'standard' | 'simple' | 'example' | 'why_correct' = 'standard'
  ) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    const userMsg: ChatTurn = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const ragResult = queryTextbookRAG(
      trimmed,
      passages,
      selectedSubject,
      selectedClass,
      mode
    );

    const tutorMsg: ChatTurn = {
      id: `t-${Date.now() + 1}`,
      role: 'tutor',
      text: ragResult.answer,
      citations: ragResult.citations,
      grounded: ragResult.grounded,
      followUps: ragResult.followUpSuggestions,
    };

    setMessages((prev) => [...prev, userMsg, tutorMsg]);
    setInputQuery('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left RAG Controls & Pipeline Info */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
              <Brain className="w-4 h-4" />
              NCERT Textbook RAG Tutor
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
              Demo RAG Active
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Class Level</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(Number(e.target.value) as ClassLevel)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
              >
                {[6, 7, 8, 9, 10].map((c) => (
                  <option key={c} value={c}>
                    Class {c} (CBSE / NCERT)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  const s = e.target.value as SubjectName;
                  setSelectedSubject(s);
                  const firstMatch = topics.find((t) => t.subject === s && !t.isFoundationTopic);
                  if (firstMatch) setSelectedTopicId(firstMatch.id);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
              >
                {(['Mathematics', 'Science', 'English', 'Social Science'] as SubjectName[]).map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Chapter / Topic</label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
              >
                {topics
                  .filter((t) => t.subject === selectedSubject)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      Class {t.classLevel}: {t.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Quick Tutor Actions */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase">
              One-Click Grounded Prompts
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSendQuery(`Explain ${currentTopic.title} simply`, 'simple')
                }
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs font-semibold text-slate-800 transition"
              >
                ✨ Request Simple Explanation ({currentTopic.title})
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendQuery(`Show a step-by-step worked example for ${currentTopic.title}`, 'example')
                }
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs font-semibold text-slate-800 transition"
              >
                📘 Request Worked NCERT Example
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendQuery(`Why is the core rule in ${currentTopic.title} valid?`, 'why_correct')
                }
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs font-semibold text-slate-800 transition"
              >
                🔍 Ask Why an Answer / Formula is Correct
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendQuery('Explain quantum chromodynamics and relativistic tensors', 'standard')
                }
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left text-xs font-semibold text-amber-950 transition"
              >
                🛡️ Test Insufficient-Evidence Guardrail (Out-of-Syllabus)
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onStartTargetedQuiz(currentTopic.id)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition"
            >
              <Play className="w-3.5 h-3.5" />
              Open Practice Quiz on {currentTopic.title}
            </button>
          </div>
        </div>
      </div>

      {/* Right Chat & Source Citations Area */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[620px]">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Interactive Textbook RAG Conversation
            </h3>
            <p className="text-xs text-slate-500">
              Grounded in CBSE/NCERT textbook chunks with chapter &amp; page citations
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {passages.length} NCERT Chunks Indexed
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm space-y-3 ${
                  m.role === 'user'
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{m.text}</div>

                {/* Retrieved NCERT Source Citations */}
                {m.role === 'tutor' && m.citations && m.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700">
                      Retrieved NCERT Textbook Sources:
                    </div>
                    {m.citations.map((cit) => (
                      <div
                        key={cit.id}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700"
                      >
                        <div className="font-bold text-slate-900">
                          {cit.board} • Class {cit.classLevel} {cit.subject} • {cit.chapter} (Page {cit.pageNumber})
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                          &ldquo;{cit.content}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {m.role === 'tutor' && m.grounded === false && (
                  <div className="p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-xs text-amber-950 font-semibold">
                    ⚠️ Citation Guardrail Triggered: No matching passage found in the CBSE Class 6–10 corpus. StudyVerse refuses to fabricate citations.
                  </div>
                )}

                {/* Follow-up suggestions */}
                {m.role === 'tutor' && m.followUps && m.followUps.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {m.followUps.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => handleSendQuery(f)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-semibold transition"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(inputQuery);
          }}
          className="p-4 border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask about ${currentTopic.title} or any NCERT concept...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm transition"
          >
            <Send className="w-4 h-4" />
            Ask
          </button>
        </form>
      </div>
    </div>
  );
};

interface StudyPlannerViewProps {
  student: Student;
  tasks: StudyTask[];
  todayMinutesCompleted: number;
  onToggleTaskComplete: (taskId: string) => void;
  onRescheduleTask: (taskId: string, newDay: string) => void;
  onUpdateDailyGoalMinutes: (minutes: number) => void;
  onNavigateToTaskTopic: (topicId: string, taskType: StudyTask['taskType']) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  student,
  tasks,
  todayMinutesCompleted,
  onToggleTaskComplete,
  onRescheduleTask,
  onUpdateDailyGoalMinutes,
  onNavigateToTaskTopic,
}) => {
  const totalPlannedMinutes = tasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);
  const progressPct = Math.min(
    100,
    Math.round((todayMinutesCompleted / Math.max(1, student.dailyGoalMinutes)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Top Schedule Summary & Duration Adjuster */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Adaptive Daily &amp; Weekly Study Planner
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Your Time-Boxed Learning Plan ({student.dailyGoalMinutes} Mins/Day)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Generated from your topic performance, reasoning evidence, prerequisite gaps, and preferred study window ({student.preferredStudyTime}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Daily Goal:</span>
            {[20, 30, 45, 60].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onUpdateDailyGoalMinutes(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  student.dailyGoalMinutes === m
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Daily Goal Progress Bar */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700">
              Today&rsquo;s Study Progress: {todayMinutesCompleted} / {student.dailyGoalMinutes} mins completed
            </span>
            <span className="text-emerald-700">{progressPct}% of Daily Goal</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-900 via-sky-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Total allocated task time today: <strong>{totalPlannedMinutes} mins</strong> (automatically scaled to fit your {student.dailyGoalMinutes}-minute daily budget).
          </p>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const isDone = task.completionStatus === 'completed';
          return (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      task.priority === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : task.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                    ⏱️ {task.estimatedMinutes} mins
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                    📅 {task.scheduledDay}
                  </span>
                </div>

                <h3
                  className={`text-base font-extrabold ${
                    isDone ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Why recommended:</strong> {task.recommendationReason}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <select
                  value={task.scheduledDay}
                  onChange={(e) => onRescheduleTask(task.id, e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  aria-label="Reschedule task day"
                >
                  <option value="Today">Schedule: Today</option>
                  <option value="Tomorrow">Reschedule: Tomorrow</option>
                  <option value="This Weekend">Reschedule: Weekend</option>
                </select>

                <button
                  type="button"
                  onClick={() => onNavigateToTaskTopic(task.topicId, task.taskType)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                >
                  Open Activity
                </button>

                <button
                  type="button"
                  onClick={() => onToggleTaskComplete(task.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-900 hover:bg-blue-800 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isDone ? 'Completed (+Mins)' : 'Mark Complete'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface StreaksAchievementsViewProps {
  currentStreak: number;
  longestStreak: number;
  todayMinutesCompleted: number;
  dailyGoalMinutes: number;
  todayGoalMet: boolean;
  achievements: Achievement[];
  sessions: StudySession[];
}

export const StreaksAchievementsView: React.FC<StreaksAchievementsViewProps> = ({
  currentStreak,
  longestStreak,
  todayMinutesCompleted,
  dailyGoalMinutes,
  todayGoalMet,
  achievements,
  sessions,
}) => {
  const nextMilestone =
    currentStreak < 10
      ? { title: 'Bronze Learner', target: 10 }
      : currentStreak < 50
      ? { title: 'Silver Scholar', target: 50 }
      : { title: 'Gold Scholar', target: 100 };

  return (
    <div className="space-y-6">
      {/* Top Streak Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-violet-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
            <Flame className="w-4 h-4" />
            Healthy, Encouraging Study Habits
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            {currentStreak} Day Study Streak 🔥
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            {todayGoalMet
              ? "Awesome work! You completed today's daily study goal and locked in your streak for today."
              : `Complete ${Math.max(
                  0,
                  dailyGoalMinutes - todayMinutesCompleted
                )} more minutes of study tasks today to reach your ${dailyGoalMinutes}-minute daily goal!`}
          </p>
          <p className="text-[11px] text-sky-200">
            Missed a day? No worries and zero guilt—every new study session builds lasting knowledge.
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 border border-white/15 text-center">
          <div className="text-xs text-blue-200">Longest Streak</div>
          <div className="text-3xl font-extrabold text-amber-300 mt-1">{longestStreak} Days</div>
          <div className="text-[11px] text-blue-200 mt-1">Timezone: Asia/Kolkata</div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 border border-white/15 text-center">
          <div className="text-xs text-blue-200">Next Milestone</div>
          <div className="text-lg font-extrabold text-emerald-300 mt-1">
            {nextMilestone.title}
          </div>
          <div className="text-xs text-white mt-1">
            {currentStreak} / {nextMilestone.target} consecutive days
          </div>
        </div>
      </div>

      {/* 14-Day Activity Calendar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">
          Recent 14-Day Study Activity Calendar
        </h3>
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`p-2.5 rounded-xl border text-center ${
                s.goalCompleted
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-bold">{s.date.slice(5)}</div>
              <div className="text-xs font-extrabold mt-1">
                {s.goalCompleted ? '🔥' : '·'}
              </div>
              <div className="text-[10px] mt-0.5">{s.durationMinutes}m</div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Badges */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">
          Milestone Rewards &amp; Badges (10d Bronze • 50d Silver • 100d Gold)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border-2 transition ${
                ach.unlocked
                  ? 'border-emerald-400 bg-emerald-50/40'
                  : 'border-slate-200 bg-slate-50 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Award
                  className={`w-7 h-7 ${
                    ach.badgeType === 'gold'
                      ? 'text-amber-500'
                      : ach.badgeType === 'silver'
                      ? 'text-slate-500'
                      : ach.badgeType === 'bronze'
                      ? 'text-amber-700'
                      : 'text-emerald-600'
                  }`}
                />
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    ach.unlocked
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {ach.unlocked ? `Unlocked ${ach.earnedAt || ''}` : `${ach.requiredDays} Days Required`}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">{ach.milestone}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface MyResourcesViewProps {
  resources: UploadedResource[];
  onAddResource: (res: UploadedResource) => void;
}

export const MyResourcesView: React.FC<MyResourcesViewProps> = ({
  resources,
  onAddResource,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectName>('Science');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(8);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    const maxBytes = 25 * 1024 * 1024;
    const isUnderLimit = file.size <= maxBytes;

    const newRes: UploadedResource = {
      id: `res-${Date.now()}`,
      fileName: file.name,
      fileSizeBytes: file.size,
      subject: selectedSubject,
      classLevel: selectedClass,
      uploadProgress: 100,
      validationStatus: !isPdf
        ? 'invalid_type'
        : !isUnderLimit
        ? 'exceeds_size'
        : 'valid',
      processingStatus:
        isPdf && isUnderLimit ? 'indexed_demo' : 'rejected',
      statusMessage: !isPdf
        ? 'Rejected: Only .pdf textbook or study note files are permitted.'
        : !isUnderLimit
        ? 'Rejected: File exceeds the 25 MB maximum upload size.'
        : 'Validated PDF structure. Demo Mode: Metadata registered (connect FastAPI backend for full PyMuPDF vector indexing).',
      uploadedAt: new Date().toISOString().slice(0, 10),
      chunksExtracted: isPdf && isUnderLimit ? Math.max(4, Math.round(file.size / 18000)) : 0,
    };

    onAddResource(newRes);
    e.target.value = '';
  };

  const simulateSampleUpload = (valid: boolean) => {
    const newRes: UploadedResource = valid
      ? {
          id: `res-${Date.now()}`,
          fileName: `NCERT_Class_${selectedClass}_${selectedSubject}_Chapter_Notes.pdf`,
          fileSizeBytes: 1843200,
          subject: selectedSubject,
          classLevel: selectedClass,
          uploadProgress: 100,
          validationStatus: 'valid',
          processingStatus: 'indexed_demo',
          statusMessage:
            'Validated PDF (1.76 MB). Demo Mode: Sample text chunks & metadata preserved for RAG retrieval.',
          uploadedAt: new Date().toISOString().slice(0, 10),
          chunksExtracted: 14,
        }
      : {
          id: `res-${Date.now()}`,
          fileName: 'Unsupported_Image_Archive.exe',
          fileSizeBytes: 512000,
          subject: selectedSubject,
          classLevel: selectedClass,
          uploadProgress: 100,
          validationStatus: 'invalid_type',
          processingStatus: 'rejected',
          statusMessage:
            'Validation Failed: Only permitted .pdf study resources are accepted (max 25 MB).',
          uploadedAt: new Date().toISOString().slice(0, 10),
          chunksExtracted: 0,
        };
    onAddResource(newRes);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Personal Study Library &amp; RAG Ingestion
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            My Resources (PDF Textbook &amp; Notes Upload)
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Upload permitted CBSE/NCERT PDF chapters or school notes (max 25 MB). StudyVerse validates file type and size before preparing chunks and metadata for the AI Tutor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(Number(e.target.value) as ClassLevel)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
            >
              {[6, 7, 8, 9, 10].map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subject Tag
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as SubjectName)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
            >
              {(['Mathematics', 'Science', 'English', 'Social Science'] as SubjectName[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex items-end">
            <label className="w-full cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition">
              <Upload className="w-4 h-4" />
              <span>Select Local PDF File</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-semibold">Quick Demo Upload Tests:</span>
          <button
            type="button"
            onClick={() => simulateSampleUpload(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold transition"
          >
            + Simulate Valid NCERT Chapter PDF Upload
          </button>
          <button
            type="button"
            onClick={() => simulateSampleUpload(false)}
            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-bold transition"
          >
            + Test Invalid File Type Validation Error
          </button>
        </div>
      </div>

      {/* Uploaded Resource List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">
          Uploaded Resources &amp; Processing Status ({resources.length})
        </h3>
        <div className="space-y-3">
          {resources.map((res) => (
            <div
              key={res.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                res.validationStatus === 'valid'
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-rose-50/70 border-rose-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-900" />
                  <span className="text-sm font-bold text-slate-900">{res.fileName}</span>
                  <span className="text-xs text-slate-500">
                    ({(res.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                    Class {res.classLevel} • {res.subject}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{res.statusMessage}</p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    res.validationStatus === 'valid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {res.validationStatus === 'valid'
                    ? `Demo Indexed (${res.chunksExtracted} chunks)`
                    : 'Rejected'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface AskDoubtDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject: SubjectName;
  defaultTopicTitle: string;
  defaultChapter: string;
  classLevel: ClassLevel;
  passages: TextbookPassage[];
}

export const AskDoubtDrawer: React.FC<AskDoubtDrawerProps> = ({
  isOpen,
  onClose,
  defaultSubject,
  defaultTopicTitle,
  defaultChapter,
  classLevel,
  passages,
}) => {
  const [subject, setSubject] = useState<SubjectName>(defaultSubject);
  const [question, setQuestion] = useState<string>('');
  const [history, setHistory] = useState<
    Array<{ q: string; a: string; citations: TextbookPassage[]; suggestions: string[] }>
  >([]);

  if (!isOpen) return null;

  const submitDoubt = (qText: string, mode: 'standard' | 'simple' | 'example' = 'standard') => {
    const clean = qText.trim();
    if (!clean) return;
    const res = queryTextbookRAG(clean, passages, subject, classLevel, mode);
    setHistory((prev) => [
      ...prev,
      {
        q: clean,
        a: res.answer,
        citations: res.citations,
        suggestions: res.followUpSuggestions,
      },
    ]);
    setQuestion('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col">
        <div className="p-5 bg-blue-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
              Instant Doubt-Solving Assistant
            </span>
            <h3 className="text-lg font-extrabold">Ask a Doubt Anytime</h3>
            <p className="text-xs text-blue-100">
              Connected to {defaultChapter} • Asking doubts never lowers your mastery score!
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            aria-label="Close doubt panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-slate-700">Active Context:</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectName)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 font-semibold bg-white"
            >
              {(['Mathematics', 'Science', 'English', 'Social Science'] as SubjectName[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => submitDoubt(`Can you explain ${defaultTopicTitle} more simply?`, 'simple')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-900 border border-slate-200 font-semibold"
            >
              Can you explain this more simply?
            </button>
            <button
              type="button"
              onClick={() => submitDoubt(`Can you show me an example for ${defaultTopicTitle}?`, 'example')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-900 border border-slate-200 font-semibold"
            >
              Can you show me an example?
            </button>
            <button
              type="button"
              onClick={() => submitDoubt(`Can you give me a practice question on ${defaultTopicTitle}?`, 'example')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-900 border border-slate-200 font-semibold"
            >
              Can you give me a practice question?
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-slate-500 text-xs">
              <HelpCircle className="w-8 h-8 text-sky-600 mx-auto" />
              <p className="font-semibold text-slate-700">
                Stuck on a formula, sign rule, or science concept in {defaultTopicTitle}?
              </p>
              <p>Type your question below or click one of the quick prompts above.</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="bg-blue-900 text-white p-3 rounded-2xl rounded-tr-none text-xs font-semibold ml-8">
                  {item.q}
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl rounded-tl-none text-xs text-slate-800 space-y-2 mr-4">
                  <div className="whitespace-pre-line leading-relaxed">{item.a}</div>
                  {item.citations.length > 0 && (
                    <div className="text-[11px] text-sky-800 font-semibold pt-1 border-t border-slate-200">
                      📖 Source: {item.citations[0].chapter} (p. {item.citations[0].pageNumber})
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.suggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => submitDoubt(sug)}
                        className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 text-[11px] font-semibold"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitDoubt(question);
          }}
          className="p-4 border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your doubt here..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs"
          >
            Ask Doubt
          </button>
        </form>
      </div>
    </div>
  );
};
