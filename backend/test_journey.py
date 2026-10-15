"""
End-to-End Automated Verification of the 16-Step StudyVerse Learning Journey
Tests onboarding, diagnostic quiz with hints & lucky-guess reasoning evaluation,
weakness detection, Class 6/7 prerequisite identification, foundation completion,
targeted practice quiz, recommendation shift, and RAG tutor grounding.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import StudyVerseDB, get_seed_topics, get_seed_rag_chunks
from models import Student, QuizAttempt
from recommendation_engine import (
    evaluate_answer_and_reasoning,
    update_topic_mastery,
    generate_adaptive_study_plan,
)
from rag_pipeline import TextbookRAGService


def run_verification():
    db = StudyVerseDB()
    topics = get_seed_topics()
    rag = TextbookRAGService(get_seed_rag_chunks())

    # Steps 1-5: Onboarding (Class 8, CBSE, Math & Science, Weak subject Math, 30-min daily goal)
    student = Student(
        id="stu-verify-8",
        displayName="Aarav Sharma",
        classLevel=8,
        board="CBSE",
        selectedSubjects=["Mathematics", "Science"],
        selectedWeakSubjects=["Mathematics"],
        dailyGoalMinutes=30,
        preferredStudyDays=["Mon", "Tue", "Wed", "Thu", "Fri"],
        preferredStudyTime="Evening",
    )
    db.save_student(student)
    assert db.get_student("stu-verify-8").dailyGoalMinutes == 30

    # Steps 6-8: Diagnostic Quiz across Math & Science with hints & reasoning evaluation
    # 1) Math Linear Equations: Incorrect answer with misconception -> Weak topic + Class 7 Prerequisite Gap
    q1_qual, q1_label, _ = evaluate_answer_and_reasoning(
        is_correct=False,
        reasoning_text="I added 3 on the left side only",
        expected_keywords=["transpose", "both sides", "subtract", "balance"],
        misconception_keywords=["left side only"],
        confidence_rating="Low",
        hint_count=2,
    )
    assert q1_qual == "misconception"

    # 2) Math Algebraic Expressions: Correct answer but weak/lucky-guess reasoning -> Uncertain mastery
    q2_qual, q2_label, _ = evaluate_answer_and_reasoning(
        is_correct=True,
        reasoning_text="Just guessed option B",
        expected_keywords=["distributive", "identity", "multiply", "2ab"],
        misconception_keywords=[],
        confidence_rating="Low",
        hint_count=1,
    )
    assert q2_qual == "weak_or_missing"

    # 3) Science Force & Pressure: Correct answer with strong reasoning -> Strong mastery
    q3_qual, q3_label, _ = evaluate_answer_and_reasoning(
        is_correct=True,
        reasoning_text="Because Pressure equals Force divided by Area, smaller area increases pressure",
        expected_keywords=["pressure", "force", "area", "smaller"],
        misconception_keywords=[],
        confidence_rating="High",
        hint_count=0,
    )
    assert q3_qual == "strong"

    attempts = [
        QuizAttempt("a1", student.id, "q-lin-1", "math-8-linear-eq", "Mathematics", 1, False, "I added 3 on the left side only", q1_qual, "Low", 2, "2026-10-15T10:00:00Z", q1_label),
        QuizAttempt("a2", student.id, "q-alg-1", "math-8-algebraic-expr", "Mathematics", 2, True, "Just guessed option B", q2_qual, "Low", 1, "2026-10-15T10:02:00Z", q2_label),
        QuizAttempt("a3", student.id, "q-sci-1", "sci-8-force-pressure", "Science", 0, True, "Because Pressure equals Force divided by Area, smaller area increases pressure", q3_qual, "High", 0, "2026-10-15T10:04:00Z", q3_label),
    ]
    for a in attempts:
        db.save_attempt(a)

    mastery_map = {}
    for tid, t in topics.items():
        m = update_topic_mastery(student.id, t, attempts, topics, mastery_map)
        db.save_mastery(m)
        mastery_map[tid] = m

    # Steps 9-10: Verify Weak topic identified (math-8-linear-eq) & Class 7 Prerequisite Gap discovered
    lin_m = mastery_map["math-8-linear-eq"]
    assert lin_m.status == "weak"
    assert "math-7-simple-eq" in lin_m.prerequisiteGapIds

    alg_m = mastery_map["math-8-algebraic-expr"]
    assert alg_m.status == "uncertain"

    sci_m = mastery_map["sci-8-force-pressure"]
    assert sci_m.status == "strong"

    tasks_initial, rec_initial = generate_adaptive_study_plan(student, topics, mastery_map)
    assert rec_initial["nextTopicId"] == "math-8-linear-eq"
    assert sum(t.estimatedMinutes for t in tasks_initial) == 30

    # Steps 11-14: Complete Foundation Lesson + Targeted Practice Quiz on Linear Equations
    lin_m.foundationCompleted = True
    db.save_mastery(lin_m)
    mastery_map["math-8-linear-eq"] = lin_m

    # Targeted practice quiz: 2 strong correct answers on Linear Equations
    attempts.extend([
        QuizAttempt("a4", student.id, "q-lin-2", "math-8-linear-eq", "Mathematics", 0, True, "Transpose 2x to LHS and subtract 5 from both sides to keep balance", "strong", "High", 0, "2026-10-15T10:15:00Z", "Strong"),
        QuizAttempt("a5", student.id, "q-lin-3", "math-8-linear-eq", "Mathematics", 2, True, "Multiply both sides by LCM 6 to clear fraction denominators then transpose", "strong", "High", 0, "2026-10-15T10:18:00Z", "Strong"),
    ])
    for tid, t in topics.items():
        m = update_topic_mastery(student.id, t, attempts, topics, mastery_map)
        db.save_mastery(m)
        mastery_map[tid] = m

    # Step 15: Verify updated topic analysis & recommendation shift!
    assert mastery_map["math-8-linear-eq"].status == "strong"
    tasks_after, rec_after = generate_adaptive_study_plan(
        student, topics, mastery_map, previous_top_topic_id="math-8-linear-eq"
    )
    assert rec_after["nextTopicId"] == "math-8-algebraic-expr"
    assert "recommendation changed" in rec_after["changeNotice"].lower()

    # Verify RAG Tutor grounded citation & insufficient-evidence guardrail
    ans_grounded = rag.answer_question("How does contact area affect pressure in Pascal?", class_level=8, subject="Science")
    assert ans_grounded["grounded"] is True
    assert len(ans_grounded["citations"]) >= 1

    ans_ungrounded = rag.answer_question("Explain quantum chromodynamics and string manifolds", class_level=8, subject="Science")
    assert ans_ungrounded["grounded"] is False

    print("ALL 16 JOURNEY STEPS & RAG CHECKS PASSED SUCCESSFULLY!")
    print("Initial Top Priority:", rec_initial["nextTopicTitle"], f"({lin_m.performanceScore}%)")
    print("Updated Top Priority:", rec_after["nextTopicTitle"], "| Notice:", rec_after["changeNotice"])


if __name__ == "__main__":
    run_verification()
