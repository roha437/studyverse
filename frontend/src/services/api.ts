import type { ClassLevel, SubjectName, TextbookPassage, Student, QuizAttempt, QuizQuestion } from '../types/studyverse';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://studyverse-backend-90vd.onrender.com').replace(/\/$/, '');

async function postJSON<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    // Keep the app usable offline; UI calculations remain available locally.
    return null;
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function saveOnboarding(student: Student): Promise<boolean> {
  const result = await postJSON<{ student: Record<string, unknown> }>('/api/onboarding', {
    studentId: student.id,
    displayName: student.displayName,
    classLevel: student.classLevel,
    board: student.board,
    selectedSubjects: student.selectedSubjects,
    selectedWeakSubjects: student.selectedWeakSubjects,
    dailyGoalMinutes: student.dailyGoalMinutes,
    preferredStudyDays: student.preferredStudyDays,
    preferredStudyTime: student.preferredStudyTime,
    learningGoal: student.learningGoal,
  });
  return Boolean(result?.student);
}

export async function submitQuizAttempts(
  studentId: string,
  attempts: QuizAttempt[],
  questions: QuizQuestion[],
): Promise<boolean> {
  if (!attempts.length) return true;
  const byId = new Map(questions.map((question) => [question.id, question]));
  const items = attempts.map((attempt) => {
    const question = byId.get(attempt.questionId);
    return {
      questionId: attempt.questionId,
      topicId: attempt.topicId,
      subject: attempt.subject,
      selectedAnswer: attempt.selectedAnswer,
      isCorrect: attempt.isCorrect,
      reasoningText: attempt.reasoningText,
      expectedKeywords: question?.expectedReasoningKeywords || [],
      misconceptionKeywords: question?.misconceptionKeywords || [],
      confidenceRating: attempt.confidenceRating,
      hintCount: attempt.hintCount,
    };
  });
  const result = await postJSON<{ evaluatedAttempts: unknown[] }>('/api/quiz/submit', { studentId, items });
  return Boolean(result?.evaluatedAttempts);
}

type TutorMode = 'standard' | 'simple' | 'example' | 'why_correct';
interface ApiCitation {
  board?: string;
  classLevel?: number;
  subject?: string;
  chapter?: string;
  page?: number;
  excerpt?: string;
}
interface TutorApiResponse {
  answer: string;
  citations?: ApiCitation[];
  grounded?: boolean;
  isDemoMode?: boolean;
  mode?: string;
  followUpSuggestions?: string[];
}

export async function askTutorAPI(
  query: string,
  classLevel: ClassLevel,
  subject: SubjectName,
  mode: TutorMode,
  passages: TextbookPassage[],
): Promise<{ answer: string; citations: TextbookPassage[]; grounded: boolean; isDemoMode: boolean; followUps: string[] } | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(`${API_BASE_URL}/api/tutor/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, classLevel, subject, mode }),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = (await response.json()) as TutorApiResponse;
    const citations = (data.citations || []).map((citation, index) => {
      const match = passages.find((p) => p.chapter === citation.chapter && p.subject === citation.subject && p.pageNumber === citation.page);
      if (match) return match;
      return {
        id: `api-citation-${index}`,
        board: 'CBSE' as const,
        classLevel: (citation.classLevel || classLevel) as ClassLevel,
        subject: (citation.subject || subject) as SubjectName,
        chapter: citation.chapter || 'Textbook passage',
        pageNumber: citation.page || 1,
        topicId: 'textbook-reference',
        content: citation.excerpt || '',
        simpleSummary: citation.excerpt || '',
        exampleText: '',
      };
    });
    return {
      answer: data.answer || 'I could not prepare an answer. Please try again.',
      citations,
      grounded: Boolean(data.grounded),
      // This backend uses deterministic textbook retrieval, not an external LLM.
      isDemoMode: true,
      followUps: data.followUpSuggestions || [],
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
