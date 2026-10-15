# StudyVerse — Learn Smarter. Improve Faster.

**StudyVerse** is an AI-powered personalized learning web application designed for CBSE/NCERT school students in **Classes 6–10** (featuring deep initial demonstration content for **Class 8 Mathematics and Science**, linked to **Class 6 and Class 7** prerequisite foundations).

StudyVerse answers one central pedagogical question at every step of the student journey:
> *"What should this student study next, why should they study it, and what evidence shows that they understand the current topic?"*

---

## 1. Project Architecture & File Organization

```text
studyverse-project/
├── .env.example                     # Server-side environment variable template (no real secrets)
├── README.md                        # Setup, run, test, and architecture documentation
├── backend/
│   ├── requirements.txt             # Python FastAPI, SQLite, PyPDF/PyMuPDF, pytest dependencies
│   ├── models.py                    # Domain models (Student, Topic, QuizAttempt, TopicMastery, StudyTask, etc.)
│   ├── database.py                  # SQLite persistence layer + CBSE Class 6–8 seed curriculum & RAG chunks
│   ├── recommendation_engine.py     # Lucky-guess reasoning evaluator, prerequisite solver, & adaptive planner
│   ├── rag_pipeline.py              # 8-step NCERT textbook RAG pipeline & PDF chunk extractor
│   ├── main.py                      # FastAPI REST API endpoints (/api/onboarding, /api/quiz/submit, /api/tutor/ask, etc.)
│   └── test_journey.py              # End-to-end automated verification script for the 16-step student journey
└── frontend/
    ├── package.json                 # React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts
    ├── vite.config.ts               # Vite dev server & /api proxy configuration
    ├── tsconfig.json                # TypeScript strict configuration
    ├── tailwind.config.js           # Tailwind CSS styling configuration
    ├── index.html                   # HTML entry point
    └── src/
        ├── main.tsx                 # React DOM bootstrap
        ├── App.tsx                  # Main application state, routing, & 16-step walkthrough bar
        ├── types/
        │   └── studyverse.ts        # Reusable TypeScript interfaces for all domain structures
        ├── data/
        │   └── curriculumData.ts    # CBSE/NCERT Class 6–8 topic graph, diagnostic & targeted questions, RAG corpus
        ├── services/
        │   └── recommendationEngine.ts # Deterministic evaluation, mastery scoring, adaptive planner, & RAG search
        └── components/
            ├── BrandAndLanding.tsx      # Book-orbit SVG logo, Hero section, 17-step learning cycle, feature showcase
            ├── OnboardingWizard.tsx     # 6-step wizard + dedicated Weak-Subject Confirmation screen & Skip flow
            ├── QuizEngine.tsx           # Diagnostic & targeted quizzes, 3-stage hints, lucky-guess check, results view
            ├── LearningAndGaps.tsx      # 6-question Explainable Weakness cards & Class 6/7 Prerequisite Foundation bridge
            ├── TutorPlannerResources.tsx# NCERT RAG Tutor, Ask a Doubt drawer, Adaptive Planner, Streaks, PDF Uploads
            └── DashboardAndProgress.tsx # Student Dashboard, Recharts analytics, Why-This-Recommendation modal, Settings
```

---

## 2. Setup & Installation Instructions

### Prerequisites
- **Node.js** (v18+ recommended) and `npm`
- **Python** (v3.10+ recommended) and `pip`

### Step 1: Configure Server Environment Variables
Copy `.env.example` to `backend/.env`. Keep all LLM API keys strictly on the server (never expose them in `VITE_*` frontend variables):

```bash
cp .env.example backend/.env
```

If `GEMINI_API_KEY` and `OPENAI_API_KEY` are left blank or set to placeholder values, StudyVerse automatically runs in **Deterministic Demo Mode** so every feature works offline without external paid API calls.

### Step 2: Install & Run the Backend (FastAPI + SQLite)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Run the automated 16-step verification test suite
python3 test_journey.py

# Start the FastAPI server on http://localhost:8000
uvicorn main:app --reload --port 8000
```

### Step 3: Install & Run the Frontend (React + TypeScript + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 3. Testing the Complete 16-Step Demonstration Journey (Demo Mode)

You can test the complete 16-step learning journey directly in the interactive Canvas preview (`studyverse.tsx`) or local dev server:

1. **Open StudyVerse**: Review the landing page hero (*"Know What to Study Next."*), the 17-step learning cycle, and click **Start Learning (Step-by-Step Onboarding)**.
2. **Select Class 8 and CBSE**: Choose `Class 8` in Step 1 and `CBSE (NCERT Curriculum)` in Step 2.
3. **Select Mathematics and Science**: Choose `Mathematics` and `Science` in Step 3.
4. **Select Weak Subjects or Skip**:
   - Select `Mathematics` and click **Continue** to view the dedicated confirmation screen: *"Okay, then let's focus on those subjects more."*
   - Or click **Skip** to bypass confirmation without disabling diagnostic weakness detection.
5. **Set a 30-Minute Daily Goal**: Choose `30 minutes`, preferred study days, and preferred study window in Step 5.
6. **Complete the Mandatory Combined Diagnostic Quiz**: Launch the quiz in Step 6 (you can answer question-by-question or click **Quick-Fill Realistic Demo Diagnostic**).
7. **Use Hints & Explain Correct Answers (Lucky-Guess Detection)**:
   - Click **Need a Hint? (1/3 -> 2/3 -> 3/3)** to reveal progressive conceptual clues, rule pointers, and scaffolds.
   - When you choose a correct option, StudyVerse asks: *"Can you explain why this answer is correct?"* before scoring mastery.
8. **View Diagnostic Results**: Review overall accuracy, subject scores, preliminary sample badges, and per-topic evidence.
9. **Identify a Weak Topic with Supporting Evidence**: Navigate to **My Learning Gaps** to inspect the 6-point evidence card for *Linear Equations in One Variable* (Weak, 20%) and *Algebraic Expressions and Identities* (Uncertain / Lucky Guess, 58%).
10. **Discover a Relevant Class 6 or Class 7 Prerequisite**: Observe the *"Let's strengthen your basics first"* banner linking Class 8 *Linear Equations* to **Class 7 Ch 4: Simple Equations** and **Class 6 Ch 7: Fractions**.
11. **Complete a Foundation Lesson**: Click **Start Class 7 Foundation Lesson**, study the worked transposition example, and click **Complete Foundation Lesson & Return to Original Topic**.
12. **Return to the Original Topic**: StudyVerse automatically transitions back to Class 8 *Linear Equations in One Variable* with the prerequisite gap resolved.
13. **Take a Targeted Practice Quiz**: Click **Take Targeted Practice Quiz on Linear Equations in One Variable** and answer the two reassessment questions with strong reasoning.
14. **Observe Updated Topic Analysis**: Watch *Linear Equations in One Variable* rise to **Strong Mastery (85%+)**.
15. **See the Study Recommendation Change**: On the **Dashboard**, a green banner announces: *"Your recommendation changed because your latest quiz showed improvement in Linear Equations in One Variable. Algebraic Expressions and Identities is now your next priority."*
16. **Complete a Study Task & Observe Daily Goal / Streak Progress**: In **Today's Study Plan** or **Study Planner**, mark a task complete to cross the 30-minute daily goal threshold, increment the streak from **9 Days to 10 Days**, and unlock the **Bronze Learner (10-Day Streak)** milestone badge!

---

## 4. Feature Implementation Status vs. External Production Integrations

| Capability / Module | Current Implementation Status | Production Extension Notes |
| :--- | :--- | :--- |
| **Landing Page & 6-Step Onboarding** | **Fully Implemented & Tested** (Includes weak-subject confirmation screen & Skip flow) | Ready for production multi-tenant auth |
| **Mandatory Combined Diagnostic & Targeted Quizzes** | **Fully Implemented & Tested** (3-stage progressive hints, confidence ratings, full teaching explanations) | Expand question bank across all chapters |
| **Lucky-Guess Reasoning Evaluation** | **Fully Implemented & Tested** (Deterministic keyword + misconception rubric in frontend & backend) | Connect live LLM rubric grader via `GEMINI_API_KEY` in `backend/.env` |
| **Prerequisite-Aware Topic Graph (Class 6/7 -> 8)** | **Fully Implemented & Tested** (Explicit DAG linking Class 8 Math & Science to Class 6/7 foundations) | Add graphs for Classes 9 & 10 and ICSE/State Boards |
| **Explainable Weakness Detection (6 Questions)** | **Fully Implemented & Tested** (Dedicated *My Learning Gaps* page with sample-size uncertainty labels) | Ready for longitudinal multi-month analytics |
| **Adaptive Study Planner & Continuous Recommendation Engine** | **Fully Implemented & Tested** (Fits tasks to daily budget and logs recommendation shift notices after quizzes) | Add push/email reminders |
| **Textbook RAG AI Tutor & Persistent Doubt Drawer** | **Implemented with Curated NCERT Corpus (Demo Mode)** + **PyPDF/TF-IDF Backend Pipeline** | Connect vector DB (e.g., Qdrant/Chroma) + live LLM API key in `backend/.env` |
| **Personal PDF Resource Uploads** | **Fully Validated** (Checks `.pdf` extension & 25 MB limit; extracts chunks in FastAPI backend via `pypdf`) | Add OCR for scanned handwritten PDFs |
| **Streaks, Activity Calendar & Milestone Badges** | **Fully Implemented & Tested** (10d Bronze, 50d Silver, 100d Gold with duplicate-day protection) | Sync across devices via backend user auth |
