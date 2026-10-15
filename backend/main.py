"""
StudyVerse FastAPI Backend Server
Exposes REST endpoints for:
- /api/onboarding
- /api/student/{student_id}
- /api/quiz/submit
- /api/foundation/complete
- /api/recommendations/{student_id}
- /api/tutor/ask
- /api/resources/upload
"""
from datetime import datetime
from typing import List, Optional
from database import StudyVerseDB, get_seed_topics, get_seed_rag_chunks
from models import Student, QuizAttempt, TopicMastery
from recommendation_engine import (
    evaluate_answer_and_reasoning,
    update_topic_mastery,
    generate_adaptive_study_plan,
)
from rag_pipeline import TextbookRAGService

db = StudyVerseDB()
TOPICS = get_seed_topics()
RAG_SERVICE = TextbookRAGService(get_seed_rag_chunks())

try:
    from fastapi import FastAPI, UploadFile, File, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel

    app = FastAPI(
        title="StudyVerse API",
        description="Personalized AI-Powered CBSE/NCERT Learning Backend",
        version="1.0.0",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    class OnboardingRequest(BaseModel):
        studentId: str = "stu-demo-1"
        displayName: str = "Aarav Sharma"
        classLevel: int = 8
        board: str = "CBSE"
        selectedSubjects: List[str] = ["Mathematics", "Science"]
        selectedWeakSubjects: List[str] = ["Mathematics"]
        dailyGoalMinutes: int = 30
        preferredStudyDays: List[str] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        preferredStudyTime: str = "Evening (5:00 PM – 7:00 PM)"
        learningGoal: str = "Strengthen foundations and master Class 8 concepts"

    class QuizSubmissionItem(BaseModel):
        questionId: str
        topicId: str
        subject: str
        selectedAnswer: int
        isCorrect: bool
        reasoningText: str = ""
        expectedKeywords: List[str] = []
        misconceptionKeywords: List[str] = []
        confidenceRating: str = "Medium"
        hintCount: int = 0

    class QuizBatchSubmission(BaseModel):
        studentId: str
        items: List[QuizSubmissionItem]

    class TutorQueryRequest(BaseModel):
        query: str
        classLevel: int = 8
        subject: str = "Mathematics"
        mode: str = "standard"

    @app.get("/api/health")
    def health_check():
        return {"status": "ok", "service": "StudyVerse API", "topicsCount": len(TOPICS)}

    @app.post("/api/onboarding")
    def complete_onboarding(req: OnboardingRequest):
        student = Student(
            id=req.studentId,
            displayName=req.displayName,
            classLevel=req.classLevel,
            board=req.board,
            selectedSubjects=req.selectedSubjects,
            selectedWeakSubjects=req.selectedWeakSubjects,
            dailyGoalMinutes=req.dailyGoalMinutes,
            preferredStudyDays=req.preferredStudyDays,
            preferredStudyTime=req.preferredStudyTime,
            learningGoal=req.learningGoal,
            diagnosticCompleted=False,
        )
        db.save_student(student)
        return {"student": student.to_dict(), "weakSubjectConfirmationRequired": len(req.selectedWeakSubjects) > 0}

    @app.post("/api/quiz/submit")
    def submit_quiz(req: QuizBatchSubmission):
        student = db.get_student(req.studentId)
        mastery_map = db.get_mastery_map(req.studentId)
        _, prev_rec = generate_adaptive_study_plan(student, TOPICS, mastery_map)
        prev_top_id = prev_rec.get("nextTopicId", "") if prev_rec else ""

        now_iso = datetime.utcnow().isoformat()
        evaluated_attempts = []
        for idx, item in enumerate(req.items):
            r_qual, interp, _ = evaluate_answer_and_reasoning(
                is_correct=item.isCorrect,
                reasoning_text=item.reasoningText,
                expected_keywords=item.expectedKeywords,
                misconception_keywords=item.misconceptionKeywords,
                confidence_rating=item.confidenceRating,
                hint_count=item.hintCount,
            )
            att = QuizAttempt(
                id=f"att-{req.studentId}-{int(datetime.utcnow().timestamp()*1000)}-{idx}",
                studentId=req.studentId,
                questionId=item.questionId,
                topicId=item.topicId,
                subject=item.subject,
                selectedAnswer=item.selectedAnswer,
                isCorrect=item.isCorrect,
                reasoningText=item.reasoningText,
                reasoningQuality=r_qual,
                confidenceRating=item.confidenceRating,
                hintCount=item.hintCount,
                timestamp=now_iso,
                interpretationLabel=interp,
            )
            db.save_attempt(att)
            evaluated_attempts.append(att.to_dict())

        all_attempts = db.list_attempts(req.studentId)
        for tid, topic in TOPICS.items():
            updated_m = update_topic_mastery(req.studentId, topic, all_attempts, TOPICS, mastery_map)
            db.save_mastery(updated_m)
            mastery_map[tid] = updated_m

        student.diagnosticCompleted = True
        db.save_student(student)
        tasks, primary_rec = generate_adaptive_study_plan(student, TOPICS, mastery_map, prev_top_id)
        return {
            "evaluatedAttempts": evaluated_attempts,
            "mastery": {k: v.to_dict() for k, v in mastery_map.items()},
            "primaryRecommendation": primary_rec,
            "studyPlan": [t.to_dict() for t in tasks],
        }

    @app.post("/api/tutor/ask")
    def ask_tutor(req: TutorQueryRequest):
        return RAG_SERVICE.answer_question(
            query=req.query,
            class_level=req.classLevel,
            subject=req.subject,
            mode=req.mode,
        )

    @app.post("/api/resources/upload")
    async def upload_resource(file: UploadFile = File(...), classLevel: int = 8, subject: str = "Science"):
        if not file.filename or not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only .pdf textbook or study resources are permitted.")
        raw = await file.read()
        size_mb = len(raw) / (1024 * 1024)
        if size_mb > 25:
            raise HTTPException(status_code=400, detail="File exceeds 25 MB maximum upload limit.")
        result = RAG_SERVICE.extract_and_index_pdf(raw, file.filename, class_level=classLevel, subject=subject)
        return {"filename": file.filename, "sizeBytes": len(raw), **result}

except ImportError:
    app = None
