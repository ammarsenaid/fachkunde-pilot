# Data Model

Central types are defined in `src/types/learning.ts`.

## Core Entities
- `LearningModule`: high-level exam module metadata and progress summary
- `Subtopic`: learning unit under a module
- `Lesson` / `LessonBlock`: future-ready lesson content blocks
- `Flashcard`: spaced-repetition style memory card
- `QuizQuestion` / `QuizAnswer`: quiz interaction entities
- `GlossaryTerm`: searchable vocabulary entries
- `NavigationItem`: app navigation metadata
- `UserProgress`, `StudyPlanTask`, `ExamAttempt`, `UploadedSource`: future-ready entities for stateful features

## Mock Data Files
- `src/data/modules.ts`
- `src/data/subtopics.ts`
- `src/data/flashcards.ts`
- `src/data/quizQuestions.ts`
- `src/data/glossary.ts`
- `src/data/navigation.ts`
- `src/data/index.ts` barrel exports
