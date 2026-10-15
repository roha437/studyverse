import {
  Student,
  Topic,
  QuizAttempt,
  TopicMastery,
  StudyTask,
  RecommendationSummary,
  ReasoningQuality,
  TextbookPassage,
  SubjectName,
  ClassLevel,
} from '../types/studyverse';

export function evaluateResponseReasoning(
  isCorrect: boolean,
  reasoningText: string,
  expectedKeywords: string[],
  misconceptionKeywords: string[],
  hintCount: number
): {
  quality: ReasoningQuality;
  interpretationLabel: string;
  effectiveScore: number;
} {
  const clean = (reasoningText || '').trim().toLowerCase();
  const words = clean.split(/\s+/).filter(Boolean);
  const matchedKeywords = expectedKeywords.filter((kw) => clean.includes(kw.toLowerCase()));
  const matchedMisconceptions = misconceptionKeywords.filter((kw) => clean.includes(kw.toLowerCase()));

  if (isCorrect) {
    if (
      words.length >= 5 &&
      (matchedKeywords.length >= 1 || words.length >= 9) &&
      matchedMisconceptions.length === 0
    ) {
      const effectiveScore = hintCount >= 2 ? 92 : 100;
      return {
        quality: 'strong',
        interpretationLabel:
          'Correct answer with strong reasoning: solid evidence of conceptual understanding.',
        effectiveScore,
      };
    }
    return {
      quality: 'weak_or_missing',
      interpretationLabel:
        'Correct answer with weak or missing reasoning: uncertain understanding (potential lucky guess).',
      effectiveScore: 58,
    };
  } else {
    if (words.length >= 5 && matchedKeywords.length >= 1) {
      return {
        quality: 'partial_understanding',
        interpretationLabel:
          'Incorrect answer with meaningful partial reasoning: possible partial understanding or arithmetic slip.',
        effectiveScore: 42,
      };
    }
    return {
      quality: 'misconception',
      interpretationLabel:
        'Incorrect answer with a misconception: potential learning gap requiring foundational review.',
      effectiveScore: 20,
    };
  }
}

export function recomputeTopicMasteryMap(
  studentId: string,
  topics: Topic[],
  attempts: QuizAttempt[],
  previousMastery: Record<string, TopicMastery>
): Record<string, TopicMastery> {
  const result: Record<string, TopicMastery> = {};

  for (const topic of topics) {
    const topicAttempts = attempts.filter((a) => a.topicId === topic.id);
    const prev = previousMastery[topic.id];
    const foundationCompleted = prev?.foundationCompleted ?? false;

    if (topicAttempts.length === 0) {
      result[topic.id] = {
        studentId,
        topicId: topic.id,
        performanceScore: foundationCompleted ? 78 : 0,
        evidenceCount: 0,
        masteryConfidence: foundationCompleted
          ? 'Foundation Completed (1 lesson)'
          : 'Unassessed (0 questions)',
        status: foundationCompleted ? 'strong' : 'unassessed',
        lastAssessedAt: prev?.lastAssessedAt || '',
        observedErrors: [],
        prerequisiteGapIds: [],
        foundationCompleted,
      };
      continue;
    }

    let weightedSum = 0;
    let totalWeight = 0;
    const errors: string[] = [];

    topicAttempts.forEach((att, idx) => {
      const weight = 1 + idx * 0.4;
      let score = 20;
      if (att.isCorrect && att.reasoningQuality === 'strong') {
        score = att.hintCount >= 2 ? 92 : 100;
      } else if (att.isCorrect && att.reasoningQuality === 'weak_or_missing') {
        score = 58;
        errors.push(
          'Selected correct multiple-choice option but provided weak/incomplete reasoning (possible lucky guess).'
        );
      } else if (!att.isCorrect && att.reasoningQuality === 'partial_understanding') {
        score = 42;
        errors.push('Demonstrated partial method awareness but made a sign or calculation error.');
      } else {
        score = 20;
        errors.push(`Difficulty applying core principle in ${topic.title}.`);
      }
      weightedSum += score * weight;
      totalWeight += weight;
    });

    let finalScore = Math.round(weightedSum / totalWeight);
    if (foundationCompleted && finalScore < 85) {
      finalScore = Math.min(88, finalScore + 12);
    }

    const count = topicAttempts.length;
    const confidence =
      count === 1
        ? 'Preliminary (1 question sample)'
        : count === 2
        ? 'Moderate (2 question samples)'
        : `Established (${count} question samples)`;

    const latest = topicAttempts[topicAttempts.length - 1];
    let status: TopicMastery['status'] = 'strong';
    if (finalScore < 55) {
      status = 'weak';
    } else if (
      finalScore < 78 ||
      (latest.isCorrect && latest.reasoningQuality === 'weak_or_missing' && count < 3)
    ) {
      status = 'uncertain';
    } else {
      status = 'strong';
    }

    const prereqGapIds: string[] = [];
    if ((status === 'weak' || status === 'uncertain') && !foundationCompleted) {
      for (const pid of topic.prerequisiteTopicIds) {
        const pm = previousMastery[pid];
        if (!pm || !pm.foundationCompleted) {
          prereqGapIds.push(pid);
        }
      }
    }

    result[topic.id] = {
      studentId,
      topicId: topic.id,
      performanceScore: finalScore,
      evidenceCount: count,
      masteryConfidence: confidence,
      status,
      lastAssessedAt: latest.timestamp,
      observedErrors: Array.from(new Set(errors)).slice(0, 3),
      prerequisiteGapIds: prereqGapIds,
      foundationCompleted,
    };
  }

  return result;
}

export function buildStudyPlanAndRecommendation(
  student: Student,
  topics: Topic[],
  masteryMap: Record<string, TopicMastery>,
  previousTopTopicId: string | null
): {
  tasks: StudyTask[];
  recommendation: RecommendationSummary;
} {
  const topicLookup: Record<string, Topic> = {};
  topics.forEach((t) => {
    topicLookup[t.id] = t;
  });

  const activeTopics = topics.filter(
    (t) => !t.isFoundationTopic && student.selectedSubjects.includes(t.subject)
  );

  const scored = activeTopics.map((topic) => {
    const m = masteryMap[topic.id] || {
      studentId: student.id,
      topicId: topic.id,
      performanceScore: 0,
      evidenceCount: 0,
      masteryConfidence: 'Unassessed',
      status: 'unassessed' as const,
      lastAssessedAt: '',
      observedErrors: [],
      prerequisiteGapIds: topic.prerequisiteTopicIds,
      foundationCompleted: false,
    };

    const tierOffset =
      m.status === 'weak'
        ? 0
        : m.status === 'uncertain'
        ? 100
        : m.status === 'unassessed'
        ? 200
        : 300;
    const weakSubjBonus = student.selectedWeakSubjects.includes(topic.subject) ? -8 : 0;
    return {
      urgency: tierOffset + m.performanceScore + weakSubjBonus,
      topic,
      mastery: m,
    };
  });

  scored.sort((a, b) => a.urgency - b.urgency);
  const top = scored[0] || {
    topic: topics.find((t) => !t.isFoundationTopic) || topics[0],
    mastery: masteryMap['math-8-linear-eq'],
  };
  const second = scored[1] || top;

  const prereqId =
    top.mastery.prerequisiteGapIds && top.mastery.prerequisiteGapIds.length > 0
      ? top.mastery.prerequisiteGapIds[0]
      : null;
  const prereqTopic = prereqId ? topicLookup[prereqId] : null;

  let changeNotice: string | null = null;
  if (previousTopTopicId && previousTopTopicId !== top.topic.id) {
    const prevT = topicLookup[previousTopTopicId];
    const prevM = masteryMap[previousTopTopicId];
    if (prevT && prevM) {
      changeNotice = `Your recommendation changed because your latest quiz showed improvement in ${prevT.title} (mastery rose to ${prevM.performanceScore}% — ${prevM.status.toUpperCase()}). ${top.topic.title} is now your next priority.`;
    }
  }

  const budget = Math.max(15, student.dailyGoalMinutes);
  const t1 = Math.max(5, Math.round(budget * (10 / 30)));
  const t2 = Math.max(5, Math.round(budget * (10 / 30)));
  const t3 = Math.max(5, Math.round(budget * (5 / 30)));
  const t4 = Math.max(5, budget - (t1 + t2 + t3));

  const tasks: StudyTask[] = [
    prereqTopic
      ? {
          id: `task-prereq-${prereqTopic.id}`,
          topicId: prereqTopic.id,
          title: `Review Prerequisite: ${prereqTopic.title} (Class ${prereqTopic.classLevel})`,
          subject: top.topic.subject,
          taskType: 'prerequisite_foundation',
          estimatedMinutes: t1,
          priority: 'High',
          completionStatus: 'pending',
          recommendationReason: `Strengthens the Class ${prereqTopic.classLevel} foundation (${prereqTopic.chapter}) needed before mastering ${top.topic.title}.`,
          scheduledDay: 'Today',
        }
      : {
          id: `task-concept-${top.topic.id}`,
          topicId: top.topic.id,
          title: `Concept Review: ${top.topic.title}`,
          subject: top.topic.subject,
          taskType: 'concept_review',
          estimatedMinutes: t1,
          priority: 'High',
          completionStatus: 'pending',
          recommendationReason: `Addresses ${top.mastery.status} mastery (${top.mastery.performanceScore}%) in ${top.topic.chapter}.`,
          scheduledDay: 'Today',
        },
    {
      id: `task-practice-${top.topic.id}`,
      topicId: top.topic.id,
      title: `Targeted Practice Quiz: ${top.topic.title}`,
      subject: top.topic.subject,
      taskType: 'targeted_practice',
      estimatedMinutes: t2,
      priority: 'High',
      completionStatus: 'pending',
      recommendationReason: `Verifies both answer accuracy and written reasoning on ${top.topic.title}.`,
      scheduledDay: 'Today',
    },
    {
      id: `task-mistakes-${top.topic.id}`,
      topicId: top.topic.id,
      title: `Review Mistakes & Explanations: ${top.topic.title}`,
      subject: top.topic.subject,
      taskType: 'mistake_review',
      estimatedMinutes: t3,
      priority: 'Medium',
      completionStatus: 'pending',
      recommendationReason:
        top.mastery.observedErrors[0] ||
        'Reviews step-by-step NCERT derivations and eliminates lucky-guess uncertainty.',
      scheduledDay: 'Today',
    },
    {
      id: `task-reassess-${second.topic.id}`,
      topicId: second.topic.id,
      title: `Reassess Understanding: ${second.topic.title}`,
      subject: second.topic.subject,
      taskType: 'reassessment_quiz',
      estimatedMinutes: t4,
      priority: 'Normal',
      completionStatus: 'pending',
      recommendationReason: `Checks retention on your secondary focus area (${second.topic.subject}: ${second.topic.title}).`,
      scheduledDay: 'Today',
    },
  ];

  const recommendation: RecommendationSummary = {
    nextTopicId: top.topic.id,
    nextTopicTitle: top.topic.title,
    subject: top.topic.subject,
    chapter: top.topic.chapter,
    status: top.mastery.status,
    score: top.mastery.performanceScore,
    confidence: top.mastery.masteryConfidence,
    whyStudyNext:
      top.mastery.status === 'weak'
        ? `Your recent responses in ${top.topic.title} (${top.mastery.performanceScore}% score) indicate a foundational gap${
            prereqTopic ? ` linked to Class ${prereqTopic.classLevel} (${prereqTopic.title})` : ''
          }.`
        : top.mastery.status === 'uncertain'
        ? `You answered correctly in ${top.topic.title} (${top.mastery.performanceScore}%), but your reasoning explanation showed uncertainty—let's turn a lucky guess into solid mastery.`
        : `Continue advancing your mastery in ${top.topic.title} (${top.mastery.performanceScore}%).`,
    evidenceSummary:
      top.mastery.observedErrors.length > 0
        ? top.mastery.observedErrors.join(' ')
        : `Based on ${top.mastery.evidenceCount} diagnostic/practice observation(s) (${top.mastery.masteryConfidence}).`,
    prerequisiteTopicId: prereqId,
    changeNotice,
  };

  return { tasks, recommendation };
}

export function queryTextbookRAG(
  query: string,
  passages: TextbookPassage[],
  subject: SubjectName,
  classLevel: ClassLevel,
  mode: 'standard' | 'simple' | 'example' | 'why_correct'
): {
  answer: string;
  citations: TextbookPassage[];
  grounded: boolean;
  followUpSuggestions: string[];
} {
  const clean = query.toLowerCase();
  const tokens = clean
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['what', 'why', 'how', 'the', 'and', 'for', 'can', 'you', 'explain', 'this', 'more', 'simply', 'show', 'give'].includes(w));

  const scored = passages
    .map((p) => {
      const hay = `${p.subject} ${p.chapter} ${p.content} ${p.simpleSummary} ${p.exampleText}`.toLowerCase();
      let matches = 0;
      tokens.forEach((t) => {
        if (hay.includes(t)) matches += 1;
      });
      if (p.subject === subject) matches += 0.5;
      if (p.classLevel === classLevel) matches += 0.25;
      return { score: matches, passage: p };
    })
    .filter((x) => x.score > 1.0)
    .sort((a, b) => b.score - a.score);

  // Out-of-syllabus guardrail check
  const outOfSyllabusTerms = ['quantum', 'calculus', 'relativity', 'cryptocurrency', 'thermodynamics', 'organic chemistry'];
  if (outOfSyllabusTerms.some((term) => clean.includes(term)) || scored.length === 0) {
    return {
      answer:
        `I checked the indexed CBSE/NCERT textbook corpus for Class ${classLevel} ${subject}, and there is insufficient textbook evidence to answer "${query}". Rather than inventing an unverified citation, I can only provide grounded explanations from your uploaded or indexed NCERT chapters. Try asking about Linear Equations, Algebraic Identities, Force & Pressure, or Chemical Effects of Electric Current!`,
      citations: [],
      grounded: false,
      followUpSuggestions: [
        'How do I transpose terms in Linear Equations?',
        'Why does (a - b)^2 have a -2ab middle term?',
        'How does surface area affect pressure in Pascals?',
      ],
    };
  }

  const primary = scored[0].passage;
  const secondary = scored[1]?.passage;

  let body = '';
  if (mode === 'simple' || clean.includes('simpl')) {
    body = `**Simple Concept Explanation (${primary.chapter}):**\n${primary.simpleSummary}\n\n**Key NCERT Takeaway:** ${primary.content}`;
  } else if (mode === 'example' || clean.includes('example') || clean.includes('practice')) {
    body = `**Step-by-Step NCERT Worked Example (${primary.chapter}):**\n${primary.exampleText}`;
  } else if (mode === 'why_correct' || clean.includes('why')) {
    body = `**Why This Principle Works (${primary.chapter}, p. ${primary.pageNumber}):**\n${primary.content}\n\n**Intuitive Check:** ${primary.simpleSummary}`;
  } else {
    body = `**Textbook-Grounded Answer (${primary.chapter}, p. ${primary.pageNumber}):**\n${primary.content}\n\n**In Plain Words:** ${primary.simpleSummary}\n\n${primary.exampleText}`;
  }

  return {
    answer: body,
    citations: secondary && secondary.id !== primary.id ? [primary, secondary] : [primary],
    grounded: true,
    followUpSuggestions: [
      'Can you explain this more simply?',
      'Can you show me an example?',
      'Can you give me a practice question?',
    ],
  };
}
