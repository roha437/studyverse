"""
StudyVerse Data Models & Domain Structures
Separates domain schemas from database persistence and AI/recommendation logic.
"""
from dataclasses import dataclass, field, asdict
from typing import List, Optional, Literal

ReasoningQuality = Literal[
    "strong",
    "weak_or_missing",
    "partial_understanding",
    "misconception",
    "not_provided"
]

ConfidenceRating = Literal["Low", "Medium", "High"]

MasteryStatus = Literal[
    "strong",
    "uncertain",
    "weak",
    "unassessed"
]

TaskType = Literal[
    "prerequisite_foundation",
    "concept_review",
    "targeted_practice",
    "mistake_review",
    "reassessment_quiz"
]


@dataclass
class Student:
    id: str
    displayName: str
    classLevel: int  # 6 to 10
    board: str  # "CBSE"
    selectedSubjects: List[str]
    selectedWeakSubjects: List[str]
    dailyGoalMinutes: int
    preferredStudyDays: List[str]
    preferredStudyTime: str
    learningGoal: str = "Strengthen foundations and master NCERT concepts"
    diagnosticCompleted: bool = False
    timezone: str = "Asia/Kolkata"

    def to_dict(self):
        return asdict(self)


@dataclass
class Topic:
    id: str
    title: str
    classLevel: int
    subject: str
    chapter: str
    prerequisiteTopicIds: List[str]
    learningObjectives: List[str]
    estimatedMinutes: int = 20
    difficulty: str = "Medium"
    isFoundationTopic: bool = False

    def to_dict(self):
        return asdict(self)


@dataclass
class QuizAttempt:
    id: str
    studentId: str
    questionId: str
    topicId: str
    subject: str
    selectedAnswer: int
    isCorrect: bool
    reasoningText: str
    reasoningQuality: ReasoningQuality
    confidenceRating: ConfidenceRating
    hintCount: int
    timestamp: str
    interpretationLabel: str = ""

    def to_dict(self):
        return asdict(self)


@dataclass
class TopicMastery:
    studentId: str
    topicId: str
    performanceScore: float  # 0 to 100
    evidenceCount: int
    masteryConfidence: str  # "Preliminary", "Moderate", "High"
    status: MasteryStatus
    lastAssessedAt: str
    observedErrors: List[str] = field(default_factory=list)
    prerequisiteGapIds: List[str] = field(default_factory=list)
    foundationCompleted: bool = False

    def to_dict(self):
        return asdict(self)


@dataclass
class StudyTask:
    id: str
    topicId: str
    title: str
    subject: str
    taskType: TaskType
    estimatedMinutes: int
    priority: str  # "High", "Medium", "Normal"
    completionStatus: Literal["pending", "completed", "rescheduled"]
    recommendationReason: str
    scheduledDay: str = "Today"

    def to_dict(self):
        return asdict(self)


@dataclass
class StudySession:
    id: str
    date: str  # YYYY-MM-DD
    durationMinutes: int
    completedTasks: List[str]
    goalCompleted: bool

    def to_dict(self):
        return asdict(self)


@dataclass
class Achievement:
    id: str
    milestone: str
    earnedAt: Optional[str]
    badgeType: Literal["bronze", "silver", "gold", "starter"]
    requiredDays: int
    description: str
    unlocked: bool = False

    def to_dict(self):
        return asdict(self)
