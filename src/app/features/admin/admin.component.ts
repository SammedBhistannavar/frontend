import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../core/services/question.service';
import { QuestionResponse } from '../../core/models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>⚙️ Admin Panel</h1>
        <p>Manage interview questions</p>
      </div>

      <div class="admin-grid">
        <!-- Add Question Form -->
        <div class="add-question card">
          <h3>Add New Question</h3>

          <div class="alert alert-success" *ngIf="success">{{ success }}</div>
          <div class="alert alert-error" *ngIf="error">{{ error }}</div>

          <div class="form-group">
            <label>Question *</label>
            <textarea class="form-control" [(ngModel)]="form.question" rows="3" placeholder="Enter the interview question..."></textarea>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" [(ngModel)]="form.description" rows="2" placeholder="Additional context or explanation..."></textarea>
          </div>
          <div class="form-group">
            <label>Topic *</label>
            <select class="form-control" [(ngModel)]="form.topic">
              <option value="">Select topic</option>
              <option *ngFor="let t of topics" [value]="t">{{ t }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Difficulty *</label>
            <select class="form-control" [(ngModel)]="form.difficulty">
              <option value="">Select difficulty</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <button class="btn btn-primary" (click)="addQuestion()" [disabled]="loading">
            {{ loading ? 'Adding...' : '+ Add Question' }}
          </button>
        </div>

        <!-- Recent additions -->
        <div class="recent-questions">
          <h3>Recently Added</h3>
          <div *ngIf="added.length === 0" class="empty-recent">
            <p>Questions you add will appear here</p>
          </div>
          <div class="added-card card" *ngFor="let q of added">
            <div class="added-header">
              <span class="badge" [ngClass]="'badge-' + q.difficulty.toLowerCase()">{{ q.difficulty }}</span>
              <span class="topic-badge">{{ q.topic }}</span>
            </div>
            <p class="added-q">{{ q.questions }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; }
    .page-header p { color: #94a3b8; margin-top: 4px; }

    .admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
    @media (max-width: 768px) { .admin-grid { grid-template-columns: 1fr; } }

    .add-question h3, .recent-questions h3 { font-size: 16px; font-weight: 600; margin-bottom: 20px; }
    textarea.form-control { resize: vertical; }

    .empty-recent { color: #64748b; font-size: 13px; padding: 24px; text-align: center; border: 1px dashed #334155; border-radius: 8px; }

    .added-card { margin-bottom: 12px; }
    .added-header { display: flex; gap: 8px; margin-bottom: 8px; }
    .topic-badge { background: rgba(100,116,139,0.2); color: #94a3b8; padding: 3px 10px; border-radius: 20px; font-size: 12px; }
    .added-q { font-size: 14px; line-height: 1.5; }
  `]
})
export class AdminComponent {
  form = {
    question: '',
    description: '',
    topic: '',
    difficulty: ''
  };

  topics = ['Java', 'Spring Boot', 'Angular', 'SQL', 'Python', 'React', 'Data Structures', 'System Design', 'JavaScript', 'TypeScript'];
  added: QuestionResponse[] = [];
  loading = false;
  success = '';
  error = '';

  constructor(private questionService: QuestionService) {}

  addQuestion(): void {
    if (!this.form.question || !this.form.topic || !this.form.difficulty) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';

    this.questionService.addQuestion(this.form).subscribe({
      next: (q) => {
        this.added.unshift(q);
        this.form = { question: '', description: '', topic: '', difficulty: '' };
        this.success = 'Question added successfully!';
        this.loading = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: () => {
        this.error = 'Failed to add question.';
        this.loading = false;
      }
    });
  }
}
