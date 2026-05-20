import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../core/services/quiz.service';
import { QuizQuestion, QuizResult, AnswerDTO } from '../../core/models/models';

type QuizState = 'setup' | 'taking' | 'result';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- SETUP -->
    <div class="quiz-page" *ngIf="state === 'setup'">
      <div class="setup-card card">
        <div class="setup-header">
          <span>🧠</span>
          <h1>Start a Quiz</h1>
          <p>Choose a topic and difficulty to begin</p>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <div class="form-group">
          <label>Topic</label>
          <select class="form-control" [(ngModel)]="topic">
            <option value="">Select topic</option>
            <option *ngFor="let t of topics" [value]="t">{{ t }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Difficulty</label>
          <select class="form-control" [(ngModel)]="difficulty">
            <option value="">Select difficulty</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <button class="btn btn-primary w-full" (click)="startQuiz()" [disabled]="loading || !topic || !difficulty">
          {{ loading ? 'Loading quiz...' : 'Start Quiz 🚀' }}
        </button>
      </div>
    </div>

    <!-- TAKING QUIZ -->
    <div class="quiz-page" *ngIf="state === 'taking'">
      <div class="quiz-header">
        <div class="quiz-meta">
          <span class="badge badge-easy">{{ topic }}</span>
          <span class="badge badge-medium">{{ difficulty }}</span>
        </div>
        <div class="progress-info">
          Question {{ currentIndex + 1 }} / {{ questions.length }}
        </div>
      </div>

      <!-- Progress bar -->
      <div class="progress-bar">
        <div class="progress-fill" [style.width]="((currentIndex) / questions.length * 100) + '%'"></div>
      </div>

      <div class="question-card card" *ngIf="currentQuestion">
        <h2 class="question-text">{{ currentQuestion.question }}</h2>

        <div class="options-grid">
          <button
            class="option-btn"
            *ngFor="let opt of currentQuestion.options; let i = index"
            [class.selected]="selectedAnswers[currentQuestion.id] === opt"
            (click)="selectAnswer(currentQuestion.id, opt)"
          >
            <span class="option-letter">{{ optionLetters[i] }}</span>
            {{ opt }}
          </button>
        </div>

        <div class="quiz-nav">
          <button class="btn btn-secondary" (click)="prev()" [disabled]="currentIndex === 0">← Previous</button>
          <button class="btn btn-primary" (click)="next()" *ngIf="currentIndex < questions.length - 1">Next →</button>
          <button class="btn btn-success" (click)="submitQuiz()" *ngIf="currentIndex === questions.length - 1" [disabled]="loading">
            {{ loading ? 'Submitting...' : 'Submit Quiz ✓' }}
          </button>
        </div>
      </div>
    </div>

    <!-- RESULTS -->
    <div class="quiz-page" *ngIf="state === 'result' && result">
      <div class="result-header card">
        <div class="score-circle" [class.good]="result.score / result.totalQuestions >= 0.6">
          <span class="score-num">{{ result.score }}</span>
          <span class="score-total">/ {{ result.totalQuestions }}</span>
        </div>
        <h2>Quiz Complete!</h2>
        <p class="score-label">
          {{ result.score / result.totalQuestions >= 0.8 ? '🏆 Excellent!' :
             result.score / result.totalQuestions >= 0.6 ? '👍 Good job!' : '📖 Keep practicing!' }}
        </p>
        <div class="result-stats">
          <div>
            <span class="stat-n correct">{{ result.score }}</span>
            <span>Correct</span>
          </div>
          <div>
            <span class="stat-n wrong">{{ result.totalQuestions - result.score }}</span>
            <span>Wrong</span>
          </div>
          <div>
            <span class="stat-n">{{ (result.score / result.totalQuestions * 100).toFixed(0) }}%</span>
            <span>Score</span>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div class="result-details">
        <h3>Review Answers</h3>
        <div class="result-item card" *ngFor="let d of result.details; let i = index">
          <div class="result-q-header">
            <span class="q-num">Q{{ i + 1 }}</span>
            <span class="result-badge" [class.correct]="d.isCorrect" [class.wrong]="!d.isCorrect">
              {{ d.isCorrect ? '✓ Correct' : '✗ Wrong' }}
            </span>
          </div>
          <p class="result-q-text" *ngIf="d.question">{{ d.question }}</p>
          <div class="answer-row">
            <span class="answer-label">Your answer:</span>
            <span [class.text-correct]="d.isCorrect" [class.text-wrong]="!d.isCorrect">{{ d.selectedAnswer || '(skipped)' }}</span>
          </div>
          <div class="answer-row" *ngIf="!d.isCorrect">
            <span class="answer-label">Correct answer:</span>
            <span class="text-correct">{{ d.correctAnswer }}</span>
          </div>
        </div>
      </div>

      <button class="btn btn-primary" (click)="reset()">Take Another Quiz</button>
    </div>
  `,
  styles: [`
    .quiz-page { max-width: 700px; margin: 0 auto; }

    .setup-card { padding: 40px; }
    .setup-header { text-align: center; margin-bottom: 32px; }
    .setup-header span { font-size: 56px; display: block; margin-bottom: 12px; }
    .setup-header h1 { font-size: 26px; font-weight: 700; margin-bottom: 4px; }
    .setup-header p { color: #94a3b8; }
    .w-full { width: 100%; justify-content: center; }

    .quiz-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .quiz-meta { display: flex; gap: 8px; }
    .progress-info { font-size: 14px; color: #94a3b8; font-weight: 500; }

    .progress-bar { height: 4px; background: #334155; border-radius: 2px; margin-bottom: 24px; }
    .progress-fill { height: 100%; background: #6366f1; border-radius: 2px; transition: width 0.3s; }

    .question-text { font-size: 18px; font-weight: 600; line-height: 1.5; margin-bottom: 24px; }

    .options-grid { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
    .option-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: #1e293b;
      border: 2px solid #334155;
      border-radius: 10px;
      color: #f1f5f9;
      font-size: 14px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }
    .option-btn:hover { border-color: #6366f1; background: rgba(99,102,241,0.08); }
    .option-btn.selected { border-color: #6366f1; background: rgba(99,102,241,0.2); color: #818cf8; }
    .option-letter {
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      background: #334155;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .option-btn.selected .option-letter { background: #6366f1; color: white; }

    .quiz-nav { display: flex; justify-content: space-between; }

    /* Results */
    .result-header { text-align: center; margin-bottom: 24px; padding: 40px; }
    .score-circle {
      width: 100px; height: 100px;
      border-radius: 50%;
      background: rgba(239,68,68,0.15);
      border: 3px solid #ef4444;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .score-circle.good { background: rgba(16,185,129,0.15); border-color: #10b981; }
    .score-num { font-size: 32px; font-weight: 800; }
    .score-total { font-size: 13px; color: #94a3b8; }
    .result-header h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
    .score-label { color: #94a3b8; font-size: 15px; margin-bottom: 20px; }
    .result-stats { display: flex; gap: 32px; justify-content: center; }
    .result-stats div { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 13px; color: #94a3b8; }
    .stat-n { font-size: 24px; font-weight: 700; color: #f1f5f9; }
    .stat-n.correct { color: #10b981; }
    .stat-n.wrong { color: #ef4444; }

    .result-details { margin-bottom: 24px; }
    .result-details h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
    .result-item { margin-bottom: 12px; }
    .result-q-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .q-num { font-size: 12px; font-weight: 700; color: #94a3b8; }
    .result-badge { font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: 20px; }
    .result-badge.correct { background: rgba(16,185,129,0.15); color: #6ee7b7; }
    .result-badge.wrong { background: rgba(239,68,68,0.15); color: #fca5a5; }
    .result-q-text { font-size: 14px; font-weight: 500; margin-bottom: 10px; line-height: 1.5; }
    .answer-row { display: flex; gap: 8px; font-size: 13px; margin-bottom: 4px; }
    .answer-label { color: #94a3b8; }
    .text-correct { color: #10b981; font-weight: 500; }
    .text-wrong { color: #ef4444; font-weight: 500; }
  `]
})
export class QuizComponent {
  state: QuizState = 'setup';
  topic = '';
  difficulty = '';
  topics = ['Java', 'Spring Boot', 'Angular', 'SQL', 'Python', 'React', 'DSA', 'System Design', 'JavaScript', 'TypeScript'];
  optionLetters = ['A', 'B', 'C', 'D'];

  questions: QuizQuestion[] = [];
  currentIndex = 0;
  selectedAnswers: { [questionId: number]: string } = {};
  quizSessionId = 0;
  result?: QuizResult;
  loading = false;
  error = '';

  get currentQuestion(): QuizQuestion | null {
    return this.questions[this.currentIndex] ?? null;
  }

  constructor(private quizService: QuizService) {}

  startQuiz(): void {
    this.loading = true;
    this.error = '';
    this.quizService.startQuiz({ topic: this.topic, difficulty: this.difficulty }).subscribe({
      next: (qs) => {
        if (qs.length === 0) {
          this.error = 'No questions found for this combination. Please try different filters.';
          this.loading = false;
          return;
        }
        this.questions = qs;
        this.currentIndex = 0;
        this.selectedAnswers = {};
        // Note: session ID comes from backend but isn't returned in start response.
        // We'll use 0 as placeholder – backend should return sessionId ideally.
        this.quizSessionId = 0;
        this.state = 'taking';
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to start quiz. Please try again.';
        this.loading = false;
      }
    });
  }
  

  selectAnswer(questionId: number, answer: string): void {
    this.selectedAnswers[questionId] = answer;
  }

  next(): void {
    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;
  }

  prev(): void {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  submitQuiz(): void {
    this.loading = true;
    const answers: AnswerDTO[] = this.questions.map(q => ({
      questionId: q.id,
      selectedAnswer: this.selectedAnswers[q.id] || ''
    }));

    this.quizService.submitQuiz({ quizSessionId: this.quizSessionId, answers }).subscribe({
      next: (res) => {
        this.result = res;
        this.state = 'result';
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to submit quiz.';
        this.loading = false;
      }
    });
  }

  reset(): void {
    this.state = 'setup';
    this.questions = [];
    this.selectedAnswers = {};
    this.result = undefined;
    this.error = '';
  }
}
