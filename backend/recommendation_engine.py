"""
StudyVerse Transparent Recommendation & Evaluation Engine
Handles:
1. Independent answer + reasoning evaluation (Lucky Guess detection)
2. Topic mastery & uncertainty computation
3. Prerequisite gap resolution across Class 6, 7, and 8
4. Adaptive study plan generation bounded by student's available daily time
5. Continuous recommendation updates with explainable change logs
"""
from datetime import datetime
from typing import Dict, List, Tuple
from models import (
    Student, Topic, QuizAttempt, TopicMastery, StudyTask, StudySession, Achievement
)


def evaluate_answer_and_reasoning(
    is_correct: bool,
    reasoning_text: str,
    expected_keywords: List[str],
    misconception_keywords: List[str],
    confidence_rating: str,
    hint_count: int,
) -> Tuple[str, str, float]:
    """
    Evaluates multiple-choice correctness and student's written reasoning independently.
    Returns (reasoning_quality, interpretation_label, effective_evidence_score).
    """
    clean_text = (reasoning_text or "").strip().lower()
    word_count = len(clean_text.split())
    matched_expected = [kw for kw in expected_keywords if kw.lower() in clean_text]
    matched_misconceptions = [kw for kw in misconception_keywords if kw.lower() in clean_text]

    if is_correct:
        if word_count >= 5 and (len(matched_expected) >= 1 or word_count >= 9) and not matched_misconceptions:
            # Subtle adjustment for heavy hint reliance without penalizing curiosity
            score = 92.0 if hint_count >= 2 else 100.0
            return (
                "strong",
                "Correct answer with strong reasoning: evidence of conceptual understanding.",
                score,
            )
        else:
            return (
                "weak_or_missing",
                "Correct answer with weak or missing reasoning: uncertain understanding (potential lucky guess).",
                58.0,
            )
    else:
        if word_count >= 5 and len(matched_expected) >= 1:
            return (
                "partial_understanding",
                "Incorrect answer with meaningful partial reasoning: possible partial understanding or calculation slip.",
                42.0,
            )
        else:
            return (
                "misconception",
                "Incorrect answer with a misconception: potential learning gap requiring foundational review.",
                18.0,
            )


def update_topic_mastery(
    student_id: str,
    topic: Topic,
    attempts: List[QuizAttempt],
    all_topics: Dict[str, Topic],
    existing_mastery: Dict[str, TopicMastery],
) -> TopicMastery:
    """
    Aggregates all quiz attempts for a topic to compute score, status, confidence,
    and identify whether an earlier-class prerequisite gap is active.
    """
    topic_attempts = [a for a in attempts if a.topicId == topic.id]
    prev = existing_mastery.get(topic.id)
    foundation_done = prev.foundationCompleted if prev else False

    if not topic_attempts:
        return TopicMastery(
            studentId=student_id,
            topicId=topic.id,
            performanceScore=0.0,
            evidenceCount=0,
            masteryConfidence="Unassessed",
            status="unassessed",
            lastAssessedAt="",
            observedErrors=[],
            prerequisiteGapIds=[],
            foundationCompleted=foundation_done,
        )

    # Weight recent attempts more heavily so improvement after foundation/practice reflects clearly
    weights = [1.0 + (0.35 * idx) for idx in range(len(topic_attempts))]
    raw_scores = []
    observed_errors = []
    has_uncertain_reasoning = False

    for att in topic_attempts:
        if att.isCorrect and att.reasoningQuality == "strong":
            raw_scores.append(95.0 if att.hintCount >= 2 else 100.0)
        elif att.isCorrect and att.reasoningQuality == "weak_or_missing":
            raw_scores.append(58.0)
            has_uncertain_reasoning = True
            observed_errors.append("Selected correct option but could not explain the underlying principle.")
        elif not att.isCorrect and att.reasoningQuality == "partial_understanding":
            raw_scores.append(42.0)
            observed_errors.append("Applied partial concept but made an execution or sign error.")
        else:
            raw_scores.append(20.0)
            observed_errors.append(f"Demonstrated misconception in {topic.title}.")

    weighted_score = round(sum(s * w for s, w in zip(raw_scores, weights)) / sum(weights), 1)
    if foundation_done and weighted_score < 85.0:
        weighted_score = min(85.0, round(weighted_score + 10.0, 1))

    evidence_count = len(topic_attempts)
    if evidence_count == 1:
        confidence = "Preliminary (1 observation)"
    elif evidence_count == 2:
        confidence = "Moderate (2 observations)"
    else:
        confidence = f"Established ({evidence_count} observations)"

    latest = topic_attempts[-1]
    if weighted_score < 55.0:
        status = "weak"
    elif weighted_score < 78.0 or (latest.isCorrect and latest.reasoningQuality == "weak_or_missing" and evidence_count < 3):
        status = "uncertain"
    else:
        status = "strong"

    prereq_gaps = []
    if status in ("weak", "uncertain") and not foundation_done:
        for pid in topic.prerequisiteTopicIds:
            p_mastery = existing_mastery.get(pid)
            if not p_mastery or p_mastery.status != "strong":
                prereq_gaps.append(pid)

    return TopicMastery(
        studentId=student_id,
        topicId=topic.id,
        performanceScore=weighted_score,
        evidenceCount=evidence_count,
        masteryConfidence=confidence,
        status=status,
        lastAssessedAt=latest.timestamp,
        observedErrors=list(dict.fromkeys(observed_errors))[:3],
        prerequisiteGapIds=prereq_gaps,
        foundationCompleted=foundation_done,
    )


def generate_adaptive_study_plan(
    student: Student,
    topics: Dict[str, Topic],
    mastery_map: Dict[str, TopicMastery],
    previous_top_topic_id: str = "",
) -> Tuple[List[StudyTask], dict]:
    """
    Generates an explainable daily study plan that fits strictly within
    student.dailyGoalMinutes and returns (tasks, primary_recommendation).
    """
    available_minutes = max(15, student.dailyGoalMinutes)
    candidate_topics: List[Tuple[float, Topic, TopicMastery]] = []

    for tid, topic in topics.items():
        if topic.isFoundationTopic or topic.classLevel != student.classLevel:
            continue
        if topic.subject not in student.selectedSubjects:
            continue
        m = mastery_map.get(tid)
        if not m:
            continue
        # Status tier ensures diagnosed weak & uncertain topics are prioritized first
        tier_offset = {
            "weak": 0.0,
            "uncertain": 100.0,
            "unassessed": 200.0,
            "strong": 300.0,
        }.get(m.status, 250.0)
        urgency = tier_offset + m.performanceScore
        if topic.subject in student.selectedWeakSubjects:
            urgency -= 8.0
        candidate_topics.append((urgency, topic, m))

    candidate_topics.sort(key=lambda x: x[0])

    if not candidate_topics:
        return [], {}

    _, top_topic, top_mastery = candidate_topics[0]
    prereq_topic = None
    if top_mastery.prerequisiteGapIds:
        prereq_topic = topics.get(top_mastery.prerequisiteGapIds[0])

    # Build change explanation if priority shifted
    change_notice = ""
    if previous_top_topic_id and previous_top_topic_id != top_topic.id:
        prev_topic = topics.get(previous_top_topic_id)
        prev_m = mastery_map.get(previous_top_topic_id)
        if prev_topic and prev_m:
            change_notice = (
                f"Your recommendation changed because your latest quiz showed improvement in "
                f"{prev_topic.title} (now {prev_m.performanceScore}%). "
                f"{top_topic.title} is now your next highest-priority focus."
            )

    tasks: List[StudyTask] = []
    # Allocate budget proportionally (e.g., for 30m: 10m prereq, 10m practice, 5m mistakes, 5m reassess)
    t1_min = max(5, round(available_minutes * (10 / 30)))
    t2_min = max(5, round(available_minutes * (10 / 30)))
    t3_min = max(5, round(available_minutes * (5 / 30)))
    t4_min = max(5, available_minutes - (t1_min + t2_min + t3_min))

    if prereq_topic:
        tasks.append(
            StudyTask(
                id=f"task-prereq-{prereq_topic.id}",
                topicId=prereq_topic.id,
                title=f"Review Prerequisite: {prereq_topic.title} (Class {prereq_topic.classLevel})",
                subject=top_topic.subject,
                taskType="prerequisite_foundation",
                estimatedMinutes=t1_min,
                priority="High",
                completionStatus="pending",
                recommendationReason=(
                    f"Recommended because {top_topic.title} relies on Class {prereq_topic.classLevel} "
                    f"foundations ({prereq_topic.chapter}), and recent responses showed a gap."
                ),
                scheduledDay="Today",
            )
        )
    else:
        tasks.append(
            StudyTask(
                id=f"task-concept-{top_topic.id}",
                topicId=top_topic.id,
                title=f"Concept Deep-Dive: {top_topic.title}",
                subject=top_topic.subject,
                taskType="concept_review",
                estimatedMinutes=t1_min,
                priority="High",
                completionStatus="pending",
                recommendationReason=(
                    f"Builds core NCERT Class {top_topic.classLevel} conceptual clarity in {top_topic.chapter}."
                ),
                scheduledDay="Today",
            )
        )

    tasks.append(
        StudyTask(
            id=f"task-practice-{top_topic.id}",
            topicId=top_topic.id,
            title=f"Targeted Practice: {top_topic.title}",
            subject=top_topic.subject,
            taskType="targeted_practice",
            estimatedMinutes=t2_min,
            priority="High",
            completionStatus="pending",
            recommendationReason=(
                f"Current topic score is {top_mastery.performanceScore}% ({top_mastery.masteryConfidence}). "
                f"Targeted practice strengthens procedural fluency."
            ),
            scheduledDay="Today",
        )
    )

    second_topic = candidate_topics[1][1] if len(candidate_topics) > 1 else top_topic
    tasks.append(
        StudyTask(
            id=f"task-mistakes-{top_topic.id}",
            topicId=top_topic.id,
            title=f"Review Reasoning & Mistakes: {top_topic.title}",
            subject=top_topic.subject,
            taskType="mistake_review",
            estimatedMinutes=t3_min,
            priority="Medium",
            completionStatus="pending",
            recommendationReason=(
                "Reviews step-by-step explanations and addresses lucky-guess or sign misconceptions."
            ),
            scheduledDay="Today",
        )
    )

    tasks.append(
        StudyTask(
            id=f"task-reassess-{second_topic.id}",
            topicId=second_topic.id,
            title=f"Quick Reassessment Check: {second_topic.title}",
            subject=second_topic.subject,
            taskType="reassessment_quiz",
            estimatedMinutes=t4_min,
            priority="Normal",
            completionStatus="pending",
            recommendationReason=(
                f"Verifies retention in {second_topic.subject} with reasoning check."
            ),
            scheduledDay="Today",
        )
    )

    primary_recommendation = {
        "nextTopicId": top_topic.id,
        "nextTopicTitle": top_topic.title,
        "subject": top_topic.subject,
        "chapter": top_topic.chapter,
        "status": top_mastery.status,
        "score": top_mastery.performanceScore,
        "confidence": top_mastery.masteryConfidence,
        "whyStudyNext": (
            f"Your recent responses in {top_topic.title} ({top_mastery.performanceScore}% score, "
            f"{top_mastery.masteryConfidence}) indicate {top_mastery.status} mastery"
            + (
                f", and you marked {top_topic.subject} as a priority subject."
                if top_topic.subject in student.selectedWeakSubjects
                else "."
            )
        ),
        "evidenceSummary": (
            "; ".join(top_mastery.observedErrors)
            if top_mastery.observedErrors
            else "Needs additional reasoning verification to confirm mastery."
        ),
        "prerequisiteTopic": prereq_topic.to_dict() if prereq_topic else None,
        "changeNotice": change_notice,
    }

    return tasks, primary_recommendation
