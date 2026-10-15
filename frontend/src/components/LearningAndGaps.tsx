import React, { useState } from 'react';
import {
  Topic,
  TopicMastery,
  QuizAttempt,
} from '../types/studyverse';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Layers,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Play,
  ShieldAlert,
  MessageSquarePlus,
} from 'lucide-react';

interface LearningGapsViewProps {
  topics: Topic[];
  masteryMap: Record<string, TopicMastery>;
  attempts: QuizAttempt[];
  onOpenFoundationLesson: (prereqTopicId: string, returnTopicId: string) => void;
  onStartTopicLesson: (topicId: string) => void;
  onStartTargetedQuiz: (topicId: string) => void;
}

export const LearningGapsView: React.FC<LearningGapsViewProps> = ({
  topics,
  masteryMap,
  attempts,
  onOpenFoundationLesson,
  onStartTopicLesson,
  onStartTargetedQuiz,
}) => {
  const topicLookup: Record<string, Topic> = {};
  topics.forEach((t) => {
    topicLookup[t.id] = t;
  });

  const coreTopics = topics.filter((t) => !t.isFoundationTopic);
  const weakList = coreTopics.filter((t) => masteryMap[t.id]?.status === 'weak');
  const uncertainList = coreTopics.filter((t) => masteryMap[t.id]?.status === 'uncertain');
  const strongList = coreTopics.filter((t) => masteryMap[t.id]?.status === 'strong');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
            Explainable Weakness Detection
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            My Learning Gaps &amp; Mastery Evidence
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            StudyVerse never labels a topic weak without showing the exact evidence, reasoning quality, prerequisite links, and reassessment path.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200">
            {weakList.length} Weak
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
            {uncertainList.length} Uncertain
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            {strongList.length} Strong
          </span>
        </div>
      </div>

      {/* 6-Question Explainable Weakness & Uncertain Mastery Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">
          Priority Attention &amp; Uncertain Mastery Cards (6-Point Evidence Breakdown)
        </h3>

        {[...weakList, ...uncertainList].length === 0 ? (
          <div className="p-8 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-emerald-950">
              All Assessed Core Topics Show Strong Understanding!
            </h4>
            <p className="text-xs text-emerald-800">
              Take another targeted quiz or explore new chapters in the Learn tab to keep challenging yourself.
            </p>
          </div>
        ) : (
          [...weakList, ...uncertainList].map((topic) => {
            const m = masteryMap[topic.id];
            const isWeak = m.status === 'weak';
            const prereqId = m.prerequisiteGapIds[0];
            const prereq = prereqId ? topicLookup[prereqId] : null;
            const topicAttempts = attempts.filter((a) => a.topicId === topic.id);
            const latestAtt = topicAttempts[topicAttempts.length - 1];

            return (
              <div
                key={topic.id}
                className={`rounded-2xl border-2 p-6 bg-white shadow-sm space-y-5 ${
                  isWeak ? 'border-rose-200' : 'border-amber-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                          isWeak
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {isWeak ? 'Weak Topic Identified' : 'Uncertain Understanding (Verify Reasoning)'}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {topic.subject} • {topic.chapter}
                      </span>
                    </div>
                    <h4 className="text-xl font-extrabold text-slate-900 mt-1">
                      Why is &ldquo;{topic.title}&rdquo; recommended?
                    </h4>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-slate-900">
                      {m.performanceScore}%
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500">
                      {m.masteryConfidence}
                    </div>
                  </div>
                </div>

                {/* 6 Required Explainable Questions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-extrabold text-slate-900">
                      1. What topic needs attention?
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      <strong>{topic.title}</strong> ({topic.chapter}, Class {topic.classLevel}{' '}
                      {topic.subject}).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-extrabold text-slate-900">
                      2. What evidence supports this finding?
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Based on {m.evidenceCount} quiz observation(s) ({m.masteryConfidence}). Latest confidence:{' '}
                      <strong>{latestAtt?.confidenceRating || 'Medium'}</strong>, Hints used:{' '}
                      <strong>{latestAtt?.hintCount ?? 0}</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-extrabold text-slate-900">
                      3. Which errors or misconceptions were observed?
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {m.observedErrors.length > 0
                        ? m.observedErrors.join(' ')
                        : 'Selected the right answer but reasoning did not cite the core rule or formula.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                    <div className="font-extrabold text-amber-950">
                      4. Is a prerequisite missing?
                    </div>
                    <p className="text-amber-900 leading-relaxed">
                      {prereq ? (
                        <>
                          Yes — relies on <strong>Class {prereq.classLevel}: {prereq.title}</strong> ({prereq.chapter}).
                        </>
                      ) : m.foundationCompleted ? (
                        'Earlier-class foundation lesson completed! Ready for Class 8 practice.'
                      ) : (
                        'No earlier-class prerequisite gap flagged; focus on Class 8 concept application.'
                      )}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
                    <div className="font-extrabold text-blue-950">
                      5. What should the student do next?
                    </div>
                    <p className="text-blue-900 leading-relaxed">
                      {prereq
                        ? `Complete the ${prereq.estimatedMinutes}-minute Class ${prereq.classLevel} Foundation Bridge on "${prereq.title}", then return to ${topic.title}.`
                        : `Review the NCERT worked example for ${topic.title} and complete a 2-question targeted quiz.`}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                    <div className="font-extrabold text-emerald-950">
                      6. How will the system reassess progress?
                    </div>
                    <p className="text-emerald-900 leading-relaxed">
                      A targeted practice quiz will evaluate both your multiple-choice accuracy and your written explanation before updating mastery.
                    </p>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500">
                    {m.evidenceCount === 1 && (
                      <span>
                        ℹ️ <strong>Uncertainty Note:</strong> Assessed from 1 question sample so far; complete a practice quiz to confirm.
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {prereq && (
                      <button
                        type="button"
                        onClick={() => onOpenFoundationLesson(prereq.id, topic.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition"
                      >
                        <Layers className="w-4 h-4" />
                        Start Class {prereq.classLevel} Foundation Lesson ({prereq.estimatedMinutes}m)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onStartTopicLesson(topic.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                    >
                      <BookOpen className="w-4 h-4" />
                      Study Class {topic.classLevel} Lesson
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartTargetedQuiz(topic.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Take Targeted Reassessment Quiz
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Strong Topics Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Demonstrated Strengths ({strongList.length})
        </h3>
        {strongList.length === 0 ? (
          <p className="text-xs text-slate-500">
            Complete diagnostic or targeted practice quizzes with clear reasoning to build verified strengths.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strongList.map((topic) => {
              const m = masteryMap[topic.id];
              return (
                <div
                  key={topic.id}
                  className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800">
                      {topic.subject} • {topic.chapter}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900">{topic.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Verified across {m.evidenceCount} observation(s) • Score: {m.performanceScore}%
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartTargetedQuiz(topic.id)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition"
                  >
                    Practice Again
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

interface LearnTopicViewProps {
  topics: Topic[];
  activeTopicId: string;
  returnToTopicId: string | null;
  masteryMap: Record<string, TopicMastery>;
  onSelectTopic: (topicId: string) => void;
  onOpenFoundationLesson: (prereqTopicId: string, returnTopicId: string) => void;
  onCompleteFoundationLesson: (foundationTopicId: string, parentTopicId: string | null) => void;
  onStartTargetedQuiz: (topicId: string) => void;
  onOpenDoubtWithContext: (subject: Topic['subject'], topicTitle: string, chapter: string) => void;
}

export const LearnTopicView: React.FC<LearnTopicViewProps> = ({
  topics,
  activeTopicId,
  returnToTopicId,
  masteryMap,
  onSelectTopic,
  onOpenFoundationLesson,
  onCompleteFoundationLesson,
  onStartTargetedQuiz,
  onOpenDoubtWithContext,
}) => {
  const [quickCheckSelected, setQuickCheckSelected] = useState<number | null>(null);
  const [skippedRemedial, setSkippedRemedial] = useState<boolean>(false);

  const topicLookup: Record<string, Topic> = {};
  topics.forEach((t) => {
    topicLookup[t.id] = t;
  });

  const currentTopic = topicLookup[activeTopicId] || topics[0];
  const currentMastery = masteryMap[currentTopic.id];
  const parentTopic = returnToTopicId ? topicLookup[returnToTopicId] : null;

  // Check if current topic has an active prerequisite gap
  const activePrereqId =
    !skippedRemedial &&
    currentMastery?.prerequisiteGapIds &&
    currentMastery.prerequisiteGapIds.length > 0
      ? currentMastery.prerequisiteGapIds[0]
      : null;
  const activePrereqTopic = activePrereqId ? topicLookup[activePrereqId] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Topic & Prerequisite Graph Selector */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Class 8 Core Topics (NCERT)
          </h3>
          <div className="space-y-2">
            {topics
              .filter((t) => !t.isFoundationTopic)
              .map((t) => {
                const m = masteryMap[t.id];
                const isSelected = t.id === currentTopic.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setQuickCheckSelected(null);
                      setSkippedRemedial(false);
                      onSelectTopic(t.id);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className={`text-[10px] font-bold uppercase ${
                          isSelected ? 'text-sky-200' : 'text-slate-500'
                        }`}
                      >
                        {t.subject} • Class {t.classLevel}
                      </div>
                      <div className="text-xs font-bold truncate">{t.title}</div>
                    </div>
                    {m && m.evidenceCount > 0 && (
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : m.status === 'strong'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'uncertain'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {m.performanceScore}%
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Earlier-Class Prerequisite Bridge Topics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              Class 6 &amp; 7 Foundation Bridges
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Explore foundational lessons from earlier classes linked to Class 8 chapters:
          </p>
          <div className="space-y-2">
            {topics
              .filter((t) => t.isFoundationTopic)
              .map((t) => {
                const isSelected = t.id === currentTopic.id;
                const done = masteryMap[t.id]?.foundationCompleted;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setQuickCheckSelected(null);
                      onSelectTopic(t.id);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-amber-50/50 hover:bg-amber-50 text-slate-800 border-amber-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className={`text-[10px] font-bold uppercase ${
                          isSelected ? 'text-amber-100' : 'text-amber-800'
                        }`}
                      >
                        Class {t.classLevel} Prerequisite • {t.subject}
                      </div>
                      <div className="text-xs font-bold truncate">{t.title}</div>
                    </div>
                    {done && (
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-white' : 'text-emerald-600'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Right Active Lesson Content */}
      <div className="lg:col-span-8 space-y-6">
        {/* PREREQUISITE GAP BANNER WHEN VIEWING A WEAK CLASS 8 TOPIC */}
        {activePrereqTopic && (
          <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs font-extrabold flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Prerequisite-Aware Learning Recommendation
              </span>
              <span className="text-xs font-bold text-amber-900">
                Estimated Time: {activePrereqTopic.estimatedMinutes} minutes
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900">
                &ldquo;Let&rsquo;s strengthen your basics first.&rdquo;
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Before diving deeper into <strong>{currentTopic.title}</strong>, StudyVerse detected a gap in the foundational concept{' '}
                <strong className="text-amber-950">
                  {activePrereqTopic.title} ({activePrereqTopic.chapter})
                </strong>
                .
              </p>
              <p className="text-xs text-slate-600">
                <strong>Why it matters:</strong> {activePrereqTopic.whyPrerequisiteMatters}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onOpenFoundationLesson(activePrereqTopic.id, currentTopic.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition"
              >
                Start Foundation Lesson (Class {activePrereqTopic.classLevel})
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSkippedRemedial(true)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition"
              >
                I Already Know This — Continue Current Topic
              </button>
            </div>
          </div>
        )}

        {/* IF VIEWING A CLASS 6/7 FOUNDATION LESSON, SHOW RETURN TO ORIGINAL TOPIC HEADER */}
        {currentTopic.isFoundationTopic && (
          <div className="rounded-2xl bg-amber-600 text-white p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-100">
                Earlier-Class Foundation Bridge • Class {currentTopic.classLevel} {currentTopic.subject}
              </span>
              <h3 className="text-lg font-extrabold">
                Strengthening Basics: {currentTopic.title}
              </h3>
              <p className="text-xs text-amber-100">
                {parentTopic
                  ? `Completing this foundation lesson unlocks confident mastery in Class ${parentTopic.classLevel}: ${parentTopic.title}.`
                  : currentTopic.whyPrerequisiteMatters}
              </p>
            </div>
            {parentTopic && (
              <button
                type="button"
                onClick={() => onSelectTopic(parentTopic.id)}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-amber-900 font-bold text-xs hover:bg-amber-50 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to {parentTopic.title}
              </button>
            )}
          </div>
        )}

        {/* Main Textbook Lesson Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 font-bold text-xs border border-blue-200">
                  Class {currentTopic.classLevel} • {currentTopic.subject}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {currentTopic.ncertReference.bookTitle} ({currentTopic.ncertReference.pageRange})
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1.5">
                {currentTopic.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{currentTopic.chapter}</p>
            </div>

            <button
              type="button"
              onClick={() =>
                onOpenDoubtWithContext(
                  currentTopic.subject,
                  currentTopic.title,
                  currentTopic.chapter
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-bold text-xs transition"
            >
              <MessageSquarePlus className="w-4 h-4 text-sky-600" />
              Ask a Doubt on This Chapter
            </button>
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Learning Objectives
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentTopic.learningObjectives.map((obj) => (
                <div
                  key={obj}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core NCERT Concept Summary */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900">
              Textbook Concept Explanation
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {currentTopic.lessonSummary}
            </p>
          </div>

          {/* Key Rules / Formulas */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900">
              Key Rules, Principles &amp; Formulas
            </h4>
            <div className="space-y-2">
              {currentTopic.keyFormulasOrRules.map((rule) => (
                <div
                  key={rule}
                  className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 font-mono text-xs text-blue-950 font-semibold"
                >
                  {rule}
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Worked Example */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Worked NCERT Example
            </div>
            <div className="text-sm font-bold">{currentTopic.workedExample.problem}</div>
            <ol className="space-y-1.5 text-xs text-slate-200 list-decimal list-inside">
              {currentTopic.workedExample.steps.map((s) => (
                <li key={s} className="leading-relaxed">
                  {s}
                </li>
              ))}
            </ol>
            <div className="pt-2 border-t border-slate-700 text-xs text-emerald-300 font-semibold">
              Takeaway: {currentTopic.workedExample.conclusion}
            </div>
          </div>

          {/* Interactive Foundation Concept Check & Completion Action */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            {currentTopic.isFoundationTopic ? (
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-emerald-950">
                    Ready to Apply This Foundation?
                  </div>
                  <p className="text-xs text-emerald-800">
                    Mark this Class {currentTopic.classLevel} foundation lesson complete to resolve your prerequisite gap and return to your Class 8 topic.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onCompleteFoundationLesson(
                      currentTopic.id,
                      parentTopic ? parentTopic.id : 'math-8-linear-eq'
                    )
                  }
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Foundation Lesson &amp; Return to Original Topic
                </button>
              </div>
            ) : (
              <>
                <div className="text-xs text-slate-600">
                  Finished reviewing <strong>{currentTopic.title}</strong>? Take a targeted quiz to update your mastery and study plan.
                </div>
                <button
                  type="button"
                  onClick={() => onStartTargetedQuiz(currentTopic.id)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition"
                >
                  <Play className="w-4 h-4" />
                  Take Targeted Practice Quiz on {currentTopic.title}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
