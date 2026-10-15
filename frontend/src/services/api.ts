import type { ClassLevel, SubjectName, TextbookPassage } from '../types/studyverse';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://studyverse-backend-90vd.onrender.com').replace(/\/$/, '');

type TutorMode = 'standard' | 'simple' | 'example' | 'why_correct';
interface ApiCitation { board?: string; classLevel?: number; subject?: string; chapter?: string; page?: number; excerpt?: string; }
interface TutorApiResponse { answer: string; citations?: ApiCitation[]; grounded?: boolean; isDemoMode?: boolean; mode?: string; followUpSuggestions?: string[]; }

export async function askTutorAPI(
  query: string, classLevel: ClassLevel, subject: SubjectName, mode: TutorMode, passages: TextbookPassage[],
): Promise<{ answer: string; citations: TextbookPassage[]; grounded: boolean; isDemoMode: boolean; followUps: string[] } | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(`${API_BASE_URL}/api/tutor/ask`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, classLevel, subject, mode }), signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = (await response.json()) as TutorApiResponse;
    const citations = (data.citations || []).map((citation, index) => {
      const match = passages.find((p) => p.chapter === citation.chapter && p.subject === citation.subject && p.pageNumber === citation.page);
      if (match) return match;
      return {
        id: `api-citation-${index}`, board: 'CBSE' as const,
        classLevel: (citation.classLevel || classLevel) as ClassLevel,
        subject: (citation.subject || subject) as SubjectName,
        chapter: citation.chapter || 'NCERT textbook passage', pageNumber: citation.page || 1,
        topicId: 'textbook-reference', content: citation.excerpt || '',
        simpleSummary: citation.excerpt || '', exampleText: '',
      };
    });
    return { answer: data.answer || 'I could not prepare an answer. Please try again.', citations,
      grounded: Boolean(data.grounded), isDemoMode: Boolean(data.isDemoMode), followUps: data.followUpSuggestions || [] };
  } catch { return null; }
  finally { clearTimeout(timeout); }
}
