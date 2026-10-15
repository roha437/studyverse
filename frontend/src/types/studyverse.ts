export type ClassLevel = 6 | 7 | 8 | 9 | 10;
export type BoardType = 'CBSE' | 'ICSE' | 'State Board';
export type SubjectName = 'Mathematics' | 'Science' | 'English' | 'Social Science';
export type ConfidenceRating = 'Low' | 'Medium' | 'High';
export type ReasoningQuality =
  | 'strong'
  | 'weak_or_missing'
  | 'partial_understanding'
  | 'misconception'
  | 'not_provided';
export type MasteryStatus = 'strong' | 'uncertain' | 'weak' | 'unassessed';
export type TaskType =
  | 'prerequisite_foundation'
  | 'concept_review'
  | 'targeted_practice'
  | 'mistake_review'
  | 'reassessment_quiz';

export interface Student {
  id: string;
  displayName: string;
  classLevel: ClassLevel;
  board: BoardType;
  selectedSubjects: SubjectName[];
  selectedWeakSubjects: SubjectName[];
  dailyGoalMinutes: number;
  preferredStudyDays: string[];
  preferredStudyTime: string;
  learningGoal: string;
  diagnosticCompleted: boolean;
  timezone: string;
}

export interface Topic {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: SubjectName;
  chapter: string;
  prerequisiteTopicIds: string[];
  learningObjectives: string[];
  estimatedMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isFoundationTopic?: boolean;
  whyPrerequisiteMatters?: string;
  lessonSummary: string;
  keyFormulasOrRules: string[];
  workedExample: {
    problem: string;
    steps: string[];
    conclusion: string;
  };
  ncertReference: {
    bookTitle: string;
    chapterNumber: number;
    pageRange: string;
  };
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  subject: SubjectName;
  classLevel: ClassLevel;
  chapter: string;
  topicTitle: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  hints: [string, string, string]; // Progressive Hints 1, 2, 3
  expectedReasoningKeywords: string[];
  misconceptionKeywords: string[];
  sampleStrongReasoning: string;
  sampleWeakReasoning: string;
  explanation: {
    whyCorrect: string;
    whyWrongOptionsFail: string;
    coreConceptOrFormula: string;
    simpleExample: string;
  };
  isDiagnostic?: boolean;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  questionId: string;
  topicId: string;
  subject: SubjectName;
  selectedAnswer: number;
  isCorrect: boolean;
  reasoningText: string;
  reasoningQuality: ReasoningQuality;
  interpretationLabel: string;
  confidenceRating: ConfidenceRating;
  hintCount: number;
  timestamp: string;
}

export interface TopicMastery {
  studentId: string;
  topicId: string;
  performanceScore: number;
  evidenceCount: number;
  masteryConfidence: string;
  status: MasteryStatus;
  lastAssessedAt: string;
  observedErrors: string[];
  prerequisiteGapIds: string[];
  foundationCompleted: boolean;
}

export interface StudyTask {
  id: string;
  topicId: string;
  title: string;
  subject: SubjectName;
  taskType: TaskType;
  estimatedMinutes: number;
  priority: 'High' | 'Medium' | 'Normal';
  completionStatus: 'pending' | 'completed' | 'rescheduled';
  recommendationReason: string;
  scheduledDay: string;
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  completedTasks: string[];
  goalCompleted: boolean;
}

export interface Achievement {
  id: string;
  milestone: string;
  earnedAt: string | null;
  badgeType: 'bronze' | 'silver' | 'gold' | 'starter';
  requiredDays: number;
  description: string;
  unlocked: boolean;
}

export interface TextbookPassage {
  id: string;
  board: BoardType;
  classLevel: ClassLevel;
  subject: SubjectName;
  chapter: string;
  pageNumber: number;
  topicId: string;
  content: string;
  simpleSummary: string;
  exampleText: string;
}

export interface UploadedResource {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  subject: SubjectName;
  classLevel: ClassLevel;
  uploadProgress: number;
  validationStatus: 'valid' | 'invalid_type' | 'exceeds_size';
  processingStatus: 'indexed_demo' | 'pending_backend' | 'rejected';
  statusMessage: string;
  uploadedAt: string;
  chunksExtracted: number;
}

export interface RecommendationSummary {
  nextTopicId: string;
  nextTopicTitle: string;
  subject: SubjectName;
  chapter: string;
  status: MasteryStatus;
  score: number;
  confidence: string;
  whyStudyNext: string;
  evidenceSummary: string;
  prerequisiteTopicId: string | null;
  changeNotice: string | null;
}
