import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../core/services/question.service';
import { QuestionResponse } from '../../core/models/models';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="questions-page">
      <div class="page-header">
        <h1>📚 Question Bank</h1>
        <p>Browse questions by topic and difficulty</p>
      </div>

      <!-- Filters -->
      <div class="filters card">
        <div class="filter-row">
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
          <button class="btn btn-primary search-btn" (click)="search()" [disabled]="loading || !topic || !difficulty">
            {{ loading ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="loading"><div class="spinner"></div></div>

      <!-- Results -->
      <div class="questions-list" *ngIf="questions.length > 0 && !loading">
        <div class="results-header">
          <span>{{ questions.length }} questions found</span>
        </div>
        <div class="question-card card" *ngFor="let q of questions; let i = index">
          <div class="q-header">
            <span class="q-number">Q{{ i + 1 }}</span>
            <div class="q-badges">
              <span class="badge" [ngClass]="'badge-' + q.difficulty.toLowerCase()">{{ q.difficulty }}</span>
              <span class="topic-badge">{{ q.topic }}</span>
            </div>
          </div>
          <p class="q-text">{{ q.questions }}</p>
          <p class="q-desc" *ngIf="q.description">{{ q.description }}</p>
        </div>
      </div>

      <!-- Empty -->
      <div class="empty-state" *ngIf="searched && questions.length === 0 && !loading">
        <span>😔</span>
        <p>No questions found for this filter combination.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; }
    .page-header p { color: #94a3b8; margin-top: 4px; }

    .filters { margin-bottom: 24px; }
    .filter-row { display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap; }
    .filter-row .form-group { flex: 1; min-width: 160px; margin-bottom: 0; }
    .search-btn { align-self: flex-end; white-space: nowrap; }

    .results-header { margin-bottom: 12px; font-size: 13px; color: #94a3b8; }

    .question-card { margin-bottom: 12px; }
    .q-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .q-number {
      background: rgba(99,102,241,0.2);
      color: #818cf8;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
    }
    .q-badges { display: flex; gap: 8px; }
    .topic-badge {
      background: rgba(100,116,139,0.2);
      color: #94a3b8;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 12px;
    }
    .q-text { font-size: 15px; font-weight: 500; line-height: 1.5; margin-bottom: 8px; }
    .q-desc { font-size: 13px; color: #94a3b8; line-height: 1.6; }

    .empty-state {
      text-align: center;
      padding: 60px;
      color: #94a3b8;
    }
    .empty-state span { font-size: 48px; display: block; margin-bottom: 12px; }
  `]
})
export class QuestionsComponent {
  topic = '';
  difficulty = '';
  questions: QuestionResponse[] = [];
  loading = false;
  searched = false;

  topics = ['Java', 'Spring Boot', 'Angular', 'SQL', 'Python', 'React', 'DSA', 'System Design', 'JavaScript', 'TypeScript'];

  constructor(private questionService: QuestionService) {}

  search(): void {
    if (!this.topic || !this.difficulty) return;
    this.loading = true;
    this.searched = true;
    this.questionService.getQuestions(this.topic, this.difficulty).subscribe({
      next: (qs) => { this.questions = qs; this.loading = false; },
      error: () => { this.questions = []; this.loading = false; }
    });
  }
}
