import React, { useState } from 'react';
import {
  QuizQuestion,
  QuizAttempt,
  ConfidenceRating,
  Topic,
  TopicMastery,
} from '../types/studyverse';
import { evaluateResponseReasoning } from '../services/recommendationEngine';
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Award,
  Layers,
} from 'lucide-react';

interface QuizRunnerProps {
  mode: 'diagnostic' | 'targeted';
  questions: QuizQuestion[];
  studentId: string;
  onFinishQuiz: (attempts: QuizAttempt[]) => void;
  onAutoSimulateDiagnostic?: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  mode,
  questions,
  studentId,
  onFinishQuiz,
  onAutoSimulateDiagnostic,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceRating>('Medium');
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [reasoningText, setReasoningText] = useState<string>('');
  const [phase, setPhase] = useState<'answering' | 'reasoning_prompt' | 'feedback'>('answering');
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  const [collectedAttempts, setCollectedAttempts] = useState<QuizAttempt[]>([]);

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return null;
  }

  const handleRevealNextHint = () => {
    if (revealedHints < 3) {
      setRevealedHints(revealedHints + 1);
    }
  };

  const handleInitialSubmit = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;

    // For correct answers (or any diagnostic question), prompt reasoning to detect lucky guesses
    if (phase === 'answering' && isCorrect) {
      setPhase('reasoning_prompt');
      return;
    }

    finalizeQuestionAttempt(reasoningText);
  };

  const finalizeQuestionAttempt = (finalReasoning: string) => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    const evalResult = evaluateResponseReasoning(
      isCorrect,
      finalReasoning,
      currentQuestion.expectedReasoningKeywords,
      currentQuestion.misconceptionKeywords,
      revealedHints
    );

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}-${currentIndex}`,
      studentId,
      questionId: currentQuestion.id,
      topicId: currentQuestion.topicId,
      subject: currentQuestion.subject,
      selectedAnswer: selectedOption,
      isCorrect,
      reasoningText: finalReasoning.trim(),
      reasoningQuality: evalResult.quality,
      interpretationLabel: evalResult.interpretationLabel,
      confidenceRating: confidence,
      hintCount: revealedHints,
      timestamp: new Date().toISOString(),
    };

    setCurrentAttempt(attempt);
    setPhase('feedback');
  };

  const handleNextQuestion = () => {
    if (!currentAttempt) return;
    const updated = [...collectedAttempts, currentAttempt];
    setCollectedAttempts(updated);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setConfidence('Medium');
      setRevealedHints(0);
      setReasoningText('');
      setCurrentAttempt(null);
      setPhase('answering');
    } else {
      onFinishQuiz(updated);
    }
  };

  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              {mode === 'diagnostic'
                ? 'Mandatory Combined Diagnostic Quiz'
                : 'Targeted Topic Practice & Reassessment Quiz'}
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Question {currentIndex + 1} of {questions.length}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {mode === 'diagnostic' && onAutoSimulateDiagnostic && currentIndex === 0 && phase === 'answering' && (
              <button
                type="button"
                onClick={onAutoSimulateDiagnostic}
                className="px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 text-xs font-bold transition flex items-center gap-1.5"
                title="Instantly populates realistic Class 8 demo answers (1 weak with prerequisite gap, 1 lucky guess, 2 strong) to inspect results immediately"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                Quick-Fill Realistic Demo Diagnostic
              </button>
            )}
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 font-bold text-xs border border-blue-200">
              {currentQuestion.subject} • Class {currentQuestion.classLevel}
            </span>
          </div>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-900 to-sky-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            <strong>Chapter:</strong> {currentQuestion.chapter}
          </span>
          <span>
            <strong>Topic:</strong> {currentQuestion.topicTitle}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentQuestion.questionText}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOpt = idx === currentQuestion.correctOptionIndex;
            const locked = phase !== 'answering';

            let styleClass =
              'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
            if (phase === 'feedback') {
              if (isCorrectOpt) {
                styleClass = 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold';
              } else if (isSelected && !isCorrectOpt) {
                styleClass = 'border-rose-500 bg-rose-50/80 text-rose-950';
              }
            } else if (isSelected) {
              styleClass = 'border-blue-900 bg-blue-50/70 text-blue-950 font-semibold shadow-sm';
            }

            return (
              <button
                key={opt}
                type="button"
                disabled={locked}
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center justify-between gap-3 ${styleClass}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                      isSelected
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm sm:text-base">{opt}</span>
                </div>
                {phase === 'feedback' && isCorrectOpt && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {phase === 'feedback' && isSelected && !isCorrectOpt && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Confidence Selector & Progressive Hint Button */}
        {phase === 'answering' && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Confidence:</span>
              {(['Low', 'Medium', 'High'] as ConfidenceRating[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setConfidence(level)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                    confidence === level
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRevealNextHint}
              disabled={revealedHints >= 3}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                revealedHints >= 3
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              {revealedHints === 0
                ? 'Need a Hint? (1/3)'
                : revealedHints < 3
                ? `Show Next Hint (${revealedHints + 1}/3)`
                : 'All 3 Hints Shown'}
            </button>
          </div>
        )}

        {/* Progressive Hints Display */}
        {revealedHints > 0 && (
          <div className="space-y-2 bg-amber-50/70 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                Progressive Guided Hints ({revealedHints} of 3 used)
              </span>
              <span className="text-[11px] text-amber-700">
                Using hints guides your thinking and is not treated as automatic weakness.
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              {currentQuestion.hints.slice(0, revealedHints).map((hText) => (
                <div
                  key={hText}
                  className="text-xs text-slate-800 bg-white/90 p-2.5 rounded-lg border border-amber-200/80"
                >
                  {hText}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional reasoning box even when answering, or mandatory Lucky-Guess check after a correct selection */}
        {phase === 'answering' && selectedOption !== null && selectedOption !== currentQuestion.correctOptionIndex && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              Optional: Share your steps or reasoning (helps detect partial understanding even if your final choice is off)
            </label>
            <textarea
              rows={2}
              value={reasoningText}
              onChange={(e) => setReasoningText(e.target.value)}
              placeholder="Write how you approached this problem..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        )}

        {/* LUCKY-GUESS DETECTION PROMPT AFTER CORRECT SELECTION */}
        {phase === 'reasoning_prompt' && (
          <div className="p-5 rounded-2xl bg-blue-50/90 border-2 border-blue-900 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Option {String.fromCharCode(65 + (selectedOption ?? 0))} Selected • Let&rsquo;s Verify Mastery
                </span>
                <h4 className="text-base font-extrabold text-blue-950 mt-1.5">
                  &ldquo;Can you explain why this answer is correct?&rdquo;
                </h4>
                <p className="text-xs text-slate-700 mt-0.5">
                  StudyVerse checks your reasoning so a lucky guess isn&rsquo;t mistaken for deep mastery. Explain the rule, formula, or step you used in 1–2 sentences:
                </p>
              </div>
            </div>

            <textarea
              rows={3}
              value={reasoningText}
              onChange={(e) => setReasoningText(e.target.value)}
              placeholder="Explain the concept, formula, or steps that make this option correct..."
              className="w-full px-4 py-2.5 rounded-xl border border-blue-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            />

            {/* Quick-Fill Demo Helpers for Fast Testing */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Quick Demo Fill:</span>
              <button
                type="button"
                onClick={() => setReasoningText(currentQuestion.sampleStrongReasoning)}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold transition"
              >
                + Fill Strong Conceptual Explanation
              </button>
              <button
                type="button"
                onClick={() => setReasoningText(currentQuestion.sampleWeakReasoning)}
                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold transition"
              >
                + Fill Lucky Guess / Vague Explanation
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => finalizeQuestionAttempt(reasoningText)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-800 transition"
              >
                Evaluate Answer &amp; Reasoning
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* COMPLETE TEACHING EXPLANATION (Shown after submission) */}
        {phase === 'feedback' && currentAttempt && (
          <div className="space-y-4 pt-2 border-t border-slate-200">
            {/* Evaluation Badge */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                currentAttempt.isCorrect && currentAttempt.reasoningQuality === 'strong'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : currentAttempt.isCorrect && currentAttempt.reasoningQuality === 'weak_or_missing'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="space-y-1">
                <div className="text-xs font-extrabold uppercase tracking-wider">
                   Independent Answer &amp; Reasoning Assessment
                </div>
                <div className="text-sm font-bold">{currentAttempt.interpretationLabel}</div>
                {currentAttempt.reasoningText && (
                  <p className="text-xs opacity-85 italic">
                    Your reasoning: &ldquo;{currentAttempt.reasoningText}&rdquo;
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/80 border border-current/20">
                  Confidence: {currentAttempt.confidenceRating} • Hints: {currentAttempt.hintCount}
                </span>
              </div>
            </div>

            {/* Complete Teaching Explanation Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs sm:text-sm">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-blue-900" />
                Complete Concept &amp; Answer Explanation
              </h4>

              <div className="space-y-1">
                <span className="font-bold text-emerald-800">Why the Correct Answer is Right:</span>
                <p className="text-slate-700 leading-relaxed">
                  {currentQuestion.explanation.whyCorrect}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-rose-800">Why Other Options Fail (Common Misconceptions):</span>
                <p className="text-slate-700 leading-relaxed">
                  {currentQuestion.explanation.whyWrongOptionsFail}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                <span className="font-bold">Relevant NCERT Rule / Formula: </span>
                <span className="font-mono">{currentQuestion.explanation.coreConceptOrFormula}</span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800">Simple Worked Example:</span>
                <p className="text-slate-700">{currentQuestion.explanation.simpleExample}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-800 transition shadow"
              >
                {currentIndex + 1 < questions.length
                  ? 'Next Question'
                  : mode === 'diagnostic'
                  ? 'View Diagnostic Results & Weakness Analysis'
                  : 'Complete Practice & Update Recommendations'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Submit Answer Button during answering phase */}
        {phase === 'answering' && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleInitialSubmit}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition ${
                selectedOption === null
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-900 text-white hover:bg-blue-800 shadow-md'
              }`}
            >
              Submit Answer
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface DiagnosticResultsProps {
  attempts: QuizAttempt[];
  topics: Topic[];
  masteryMap: Record<string, TopicMastery>;
  onOpenFoundationLesson: (prereqTopicId: string, returnTopicId: string) => void;
  onGoToDashboard: () => void;
  onGoToLearningGaps: () => void;
}

export const DiagnosticResultsView: React.FC<DiagnosticResultsProps> = ({
  attempts,
  topics,
  masteryMap,
  onOpenFoundationLesson,
  onGoToDashboard,
  onGoToLearningGaps,
}) => {
  const topicMap: Record<string, Topic> = {};
  topics.forEach((t) => {
    topicMap[t.id] = t;
  });

  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const overallAccuracy = attempts.length > 0 ? Math.round((correctCount / attempts.length) * 100) : 0;

  // Group by subject
  const subjectStats: Record<string, { total: number; correct: number; avgMastery: number }> = {};
  attempts.forEach((a) => {
    if (!subjectStats[a.subject]) {
      subjectStats[a.subject] = { total: 0, correct: 0, avgMastery: 0 };
    }
    subjectStats[a.subject].total += 1;
    if (a.isCorrect) subjectStats[a.subject].correct += 1;
  });

  const assessedTopics = Object.values(masteryMap).filter((m) => m.evidenceCount > 0);
  const weakTopics = assessedTopics.filter((m) => m.status === 'weak');
  const uncertainTopics = assessedTopics.filter((m) => m.status === 'uncertain');
  const strongTopics = assessedTopics.filter((m) => m.status === 'strong');

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 border border-sky-400/30 text-xs font-bold">
            Preliminary Diagnostic Assessment • Evidence-Based Report
          </span>
          <span className="text-xs text-blue-200">
            Note: Results from small question samples are labeled as preliminary and refine as you practice.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-white/10 rounded-xl p-4 border border-white/15">
            <div className="text-xs text-blue-200">MCQ Accuracy</div>
            <div className="text-3xl font-extrabold mt-1">{overallAccuracy}%</div>
            <div className="text-[11px] text-sky-200 mt-1">
              {correctCount} of {attempts.length} correct
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/15">
            <div className="text-xs text-blue-200">Demonstrated Strengths</div>
            <div className="text-3xl font-extrabold text-emerald-300 mt-1">
              {strongTopics.length}
            </div>
            <div className="text-[11px] text-blue-200 mt-1">Correct + Strong Reasoning</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/15">
            <div className="text-xs text-blue-200">Uncertain Mastery</div>
            <div className="text-3xl font-extrabold text-amber-300 mt-1">
              {uncertainTopics.length}
            </div>
            <div className="text-[11px] text-blue-200 mt-1">Lucky Guess / Weak Reasoning</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/15">
            <div className="text-xs text-blue-200">Weak Topics &amp; Gaps</div>
            <div className="text-3xl font-extrabold text-rose-300 mt-1">
              {weakTopics.length}
            </div>
            <div className="text-[11px] text-blue-200 mt-1">Needs Prerequisite Bridge</div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(subjectStats).map(([subj, st]) => {
          const pct = Math.round((st.correct / st.total) * 100);
          return (
            <div
              key={subj}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Subject Performance
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">{subj}</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {st.correct} of {st.total} questions answered correctly
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-blue-900">{pct}%</div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  Preliminary Sample
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Topic-by-Topic Evidence & Prerequisite Recommendations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Topic-Wise Performance, Evidence &amp; Prerequisite Gaps
            </h3>
            <p className="text-xs text-slate-600">
              See why each topic was classified as Strong, Uncertain, or Weak based on your answer and reasoning.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {assessedTopics.map((m) => {
            const t = topicMap[m.topicId];
            if (!t) return null;
            const prereq =
              m.prerequisiteGapIds.length > 0 ? topicMap[m.prerequisiteGapIds[0]] : null;

            return (
              <div
                key={m.topicId}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-sky-700">
                      {t.subject} • {t.chapter}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">{t.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {m.masteryConfidence}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        m.status === 'strong'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'uncertain'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {m.status === 'strong'
                        ? `Demonstrated Strength (${m.performanceScore}%)`
                        : m.status === 'uncertain'
                        ? `Uncertain Understanding (${m.performanceScore}%)`
                        : `Weak Topic (${m.performanceScore}%)`}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700">
                  <strong>Supporting Evidence: </strong>
                  {m.observedErrors.length > 0
                    ? m.observedErrors.join(' ')
                    : 'Answered correctly and explained the underlying concept clearly.'}
                </p>

                {prereq && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-amber-700" />
                        &ldquo;Let&rsquo;s strengthen your basics first.&rdquo; — Prerequisite Gap Identified
                      </div>
                      <p className="text-xs text-amber-900">
                        <strong>Missing Foundation:</strong> {prereq.title} ({prereq.chapter} •{' '}
                        {prereq.estimatedMinutes} mins). {prereq.whyPrerequisiteMatters}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenFoundationLesson(prereq.id, t.id)}
                      className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition"
                    >
                      Start Class {prereq.classLevel} Foundation Lesson →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onGoToLearningGaps}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition"
          >
            Inspect Detailed Learning Gaps
          </button>
          <button
            type="button"
            onClick={onGoToDashboard}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-800 shadow-md transition"
          >
            Open Personalized Dashboard &amp; Study Plan
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
