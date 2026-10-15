"""
StudyVerse SQLite Database Layer & CBSE/NCERT Seed Dataset
Manages tables for students, topics, quiz_attempts, topic_mastery,
study_tasks, study_sessions, achievements, and resources.
"""
import json
import sqlite3
from typing import Dict, List
from models import (
    Student, Topic, QuizAttempt, TopicMastery, StudyTask, StudySession, Achievement
)
from rag_pipeline import TextbookChunk


def get_seed_topics() -> Dict[str, Topic]:
    topics = [
        # Class 6 & 7 Foundational Prerequisite Topics
        Topic(
            id="math-6-fractions-ops",
            title="Fractions & Operations on Rational Quantities",
            classLevel=6,
            subject="Mathematics",
            chapter="Class 6 Ch 7: Fractions",
            prerequisiteTopicIds=[],
            learningObjectives=[
                "Add and subtract unlike fractions using LCM of denominators",
                "Clear fractional denominators in equations cleanly",
            ],
            estimatedMinutes=12,
            difficulty="Easy",
            isFoundationTopic=True,
        ),
        Topic(
            id="math-7-simple-eq",
            title="Simple Equations: Balancing & Transposing Terms",
            classLevel=7,
            subject="Mathematics",
            chapter="Class 7 Ch 4: Simple Equations",
            prerequisiteTopicIds=["math-6-fractions-ops"],
            learningObjectives=[
                "Maintain equality by performing identical operations on both sides",
                "Transpose terms across the equals sign by inverting signs (+ to -, * to /)",
            ],
            estimatedMinutes=15,
            difficulty="Easy",
            isFoundationTopic=True,
        ),
        Topic(
            id="math-7-algebraic-terms",
            title="Algebraic Terms, Factors & Distributive Law",
            classLevel=7,
            subject="Mathematics",
            chapter="Class 7 Ch 12: Algebraic Expressions",
            prerequisiteTopicIds=[],
            learningObjectives=[
                "Identify like and unlike algebraic terms",
                "Apply a(b + c) = ab + ac without dropping negative signs",
            ],
            estimatedMinutes=15,
            difficulty="Easy",
            isFoundationTopic=True,
        ),
        Topic(
            id="sci-7-motion-time",
            title="Motion, Force Direction & Unit Area Basics",
            classLevel=7,
            subject="Science",
            chapter="Class 7 Ch 9: Motion and Time",
            prerequisiteTopicIds=[],
            learningObjectives=[
                "Relate net force direction to change in state of motion",
                "Understand how surface area affects distributed force",
            ],
            estimatedMinutes=12,
            difficulty="Easy",
            isFoundationTopic=True,
        ),
        Topic(
            id="sci-6-electric-circuits",
            title="Electric Circuits: Conductors vs Insulators",
            classLevel=6,
            subject="Science",
            chapter="Class 6 Ch 9: Electricity and Circuits",
            prerequisiteTopicIds=[],
            learningObjectives=[
                "Distinguish materials that allow electric current to pass from insulators",
                "Trace closed circuit paths required for current flow",
            ],
            estimatedMinutes=12,
            difficulty="Easy",
            isFoundationTopic=True,
        ),
        # Class 8 Core Topics
        Topic(
            id="math-8-linear-eq",
            title="Linear Equations in One Variable",
            classLevel=8,
            subject="Mathematics",
            chapter="Class 8 Ch 2: Linear Equations in One Variable",
            prerequisiteTopicIds=["math-7-simple-eq", "math-6-fractions-ops"],
            learningObjectives=[
                "Solve linear equations with variables on both sides",
                "Reduce equations with fractional coefficients to simpler linear form",
            ],
            estimatedMinutes=25,
            difficulty="Medium",
            isFoundationTopic=False,
        ),
        Topic(
            id="math-8-algebraic-expr",
            title="Algebraic Expressions and Identities",
            classLevel=8,
            subject="Mathematics",
            chapter="Class 8 Ch 8: Algebraic Expressions and Identities",
            prerequisiteTopicIds=["math-7-algebraic-terms"],
            learningObjectives=[
                "Multiply monomials and polynomials using the distributive property",
                "Apply standard identities (a+b)^2, (a-b)^2, and (a+b)(a-b)",
            ],
            estimatedMinutes=25,
            difficulty="Medium",
            isFoundationTopic=False,
        ),
        Topic(
            id="sci-8-force-pressure",
            title="Force and Pressure",
            classLevel=8,
            subject="Science",
            chapter="Class 8 Ch 8: Force and Pressure",
            prerequisiteTopicIds=["sci-7-motion-time"],
            learningObjectives=[
                "Calculate Pressure = Force / Area and explain inverse area dependence",
                "Compare contact forces (friction, muscular) and non-contact forces",
            ],
            estimatedMinutes=20,
            difficulty="Medium",
            isFoundationTopic=False,
        ),
        Topic(
            id="sci-8-chemical-effects",
            title="Chemical Effects of Electric Current",
            classLevel=8,
            subject="Science",
            chapter="Class 8 Ch 11: Chemical Effects of Electric Current",
            prerequisiteTopicIds=["sci-6-electric-circuits"],
            learningObjectives=[
                "Explain ionic conduction in liquids (acids, bases, salts)",
                "Describe electroplating and chemical evolution at electrodes",
            ],
            estimatedMinutes=20,
            difficulty="Medium",
            isFoundationTopic=False,
        ),
    ]
    return {t.id: t for t in topics}


def get_seed_rag_chunks() -> List[TextbookChunk]:
    return [
        TextbookChunk(
            chunkId="ncert-m8-ch2-p21",
            board="CBSE",
            classLevel=8,
            subject="Mathematics",
            chapter="Ch 2: Linear Equations in One Variable",
            pageNumber=21,
            topicId="math-8-linear-eq",
            content=(
                "To solve an equation having variables on both sides, transpose variable terms to the "
                "Left Hand Side (LHS) and constant terms to the Right Hand Side (RHS). When a term "
                "is transposed across the equality sign, + becomes - and - becomes +. If fractional "
                "denominators exist, multiply both sides by the LCM of denominators first."
            ),
        ),
        TextbookChunk(
            chunkId="ncert-m7-ch4-p82",
            board="CBSE",
            classLevel=7,
            subject="Mathematics",
            chapter="Ch 4: Simple Equations (Foundation)",
            pageNumber=82,
            topicId="math-7-simple-eq",
            content=(
                "An equation is like a balanced weighing scale. Adding, subtracting, multiplying, or "
                "dividing both sides by the same non-zero number keeps the balance intact. Transposing "
                "a number is equivalent to adding or subtracting it from both sides."
            ),
        ),
        TextbookChunk(
            chunkId="ncert-m8-ch8-p95",
            board="CBSE",
            classLevel=8,
            subject="Mathematics",
            chapter="Ch 8: Algebraic Expressions and Identities",
            pageNumber=95,
            topicId="math-8-algebraic-expr",
            content=(
                "When multiplying a monomial by a binomial, apply the distributive law: a(b + c) = ab + ac. "
                "Standard Identities: (1) (a + b)^2 = a^2 + 2ab + b^2; (2) (a - b)^2 = a^2 - 2ab + b^2; "
                "(3) (a + b)(a - b) = a^2 - b^2. Always include the middle term 2ab when squaring a binomial."
            ),
        ),
        TextbookChunk(
            chunkId="ncert-s8-ch8-p102",
            board="CBSE",
            classLevel=8,
            subject="Science",
            chapter="Ch 8: Force and Pressure",
            pageNumber=102,
            topicId="sci-8-force-pressure",
            content=(
                "Pressure is defined as the force acting perpendicularly on a unit area of a surface: "
                "Pressure (P) = Force (F) / Area (A). The SI unit of pressure is N/m^2 or Pascal (Pa). "
                "For the same force, a smaller contact area produces a much larger pressure—which is why "
                "school bags have wide straps and cutting tools have sharp edges."
            ),
        ),
        TextbookChunk(
            chunkId="ncert-s8-ch11-p138",
            board="CBSE",
            classLevel=8,
            subject="Science",
            chapter="Ch 11: Chemical Effects of Electric Current",
            pageNumber=138,
            topicId="sci-8-chemical-effects",
            content=(
                "Distilled water is free of dissolved salts and is a poor conductor of electricity. "
                "When small amounts of acid, base, or salt are dissolved in water, they dissociate into "
                "free-moving ions, making the solution conduct electricity and causing chemical changes "
                "at the electrodes (such as gas bubbles or metal deposition via electroplating)."
            ),
        ),
    ]


class StudyVerseDB:
    def __init__(self, db_path: str = ":memory:"):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._init_schema()

    def _init_schema(self):
        cur = self.conn.cursor()
        cur.executescript(
            """
            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS quiz_attempts (
                id TEXT PRIMARY KEY,
                student_id TEXT NOT NULL,
                topic_id TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS topic_mastery (
                student_id TEXT NOT NULL,
                topic_id TEXT NOT NULL,
                payload TEXT NOT NULL,
                PRIMARY KEY (student_id, topic_id)
            );
            CREATE TABLE IF NOT EXISTS study_tasks (
                id TEXT PRIMARY KEY,
                student_id TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS study_sessions (
                id TEXT PRIMARY KEY,
                student_id TEXT NOT NULL,
                date TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            """
        )
        self.conn.commit()

    def save_student(self, student: Student):
        self.conn.execute(
            "INSERT OR REPLACE INTO students (id, payload) VALUES (?, ?)",
            (student.id, json.dumps(student.to_dict())),
        )
        self.conn.commit()

    def get_student(self, student_id: str) -> Student:
        row = self.conn.execute(
            "SELECT payload FROM students WHERE id = ?", (student_id,)
        ).fetchone()
        if not row:
            raise KeyError(f"Student {student_id} not found")
        return Student(**json.loads(row["payload"]))

    def save_attempt(self, attempt: QuizAttempt):
        self.conn.execute(
            "INSERT OR REPLACE INTO quiz_attempts (id, student_id, topic_id, payload) VALUES (?, ?, ?, ?)",
            (attempt.id, attempt.studentId, attempt.topicId, json.dumps(attempt.to_dict())),
        )
        self.conn.commit()

    def list_attempts(self, student_id: str) -> List[QuizAttempt]:
        rows = self.conn.execute(
            "SELECT payload FROM quiz_attempts WHERE student_id = ?", (student_id,)
        ).fetchall()
        return [QuizAttempt(**json.loads(r["payload"])) for r in rows]

    def save_mastery(self, mastery: TopicMastery):
        self.conn.execute(
            "INSERT OR REPLACE INTO topic_mastery (student_id, topic_id, payload) VALUES (?, ?, ?)",
            (mastery.studentId, mastery.topicId, json.dumps(mastery.to_dict())),
        )
        self.conn.commit()

    def get_mastery_map(self, student_id: str) -> Dict[str, TopicMastery]:
        rows = self.conn.execute(
            "SELECT topic_id, payload FROM topic_mastery WHERE student_id = ?", (student_id,)
        ).fetchall()
        return {r["topic_id"]: TopicMastery(**json.loads(r["payload"])) for r in rows}
