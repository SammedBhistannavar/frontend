import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { ProgressDTO } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="welcome-header">
        <div>
          <h1>Welcome back! 👋</h1>
          <p>Continue your interview preparation journey</p>
        </div>
        <a routerLink="/quiz" class="btn btn-primary">Start Quiz 🚀</a>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" *ngIf="progress">
        <div class="stat-card card">
          <div class="stat-icon">📊</div>
          <div class="stat-value">{{ progress.totalQuizzes }}</div>
          <div class="stat-label">Total Quizzes</div>
        </div>
        <div class="stat-card card">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">{{ progress.averageScore | number:'1.1-1' }}</div>
          <div class="stat-label">Average Score</div>
        </div>
        <div class="stat-card card">
          <div class="stat-icon">🏆</div>
          <div class="stat-value">{{ progress.highestScore }}</div>
          <div class="stat-label">Best Score</div>
        </div>
        <div class="stat-card card">
          <div class="stat-icon">📉</div>
          <div class="stat-value">{{ progress.lowestScore }}</div>
          <div class="stat-label">Lowest Score</div>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-grid">
          <a routerLink="/quiz" class="action-card card">
            <span class="action-icon">🧠</span>
            <h3>Take a Quiz</h3>
            <p>Test your knowledge with timed quizzes on any topic</p>
          </a>
          <a routerLink="/questions" class="action-card card">
            <span class="action-icon">📚</span>
            <h3>Browse Questions</h3>
            <p>Explore our question bank by topic and difficulty</p>
          </a>
          <a routerLink="/profile" class="action-card card">
            <span class="action-icon">👤</span>
            <h3>Update Profile</h3>
            <p>Keep your skills and resume information up to date</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {}
    .welcome-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
    }
    .welcome-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
    .welcome-header p { color: #94a3b8; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 40px;
    }
    .stat-card {
      text-align: center;
      padding: 28px 20px;
      transition: transform 0.2s;
    }
    .stat-card:hover { transform: translateY(-2px); }
    .stat-icon { font-size: 32px; margin-bottom: 12px; }
    .stat-value { font-size: 32px; font-weight: 700; color: #6366f1; }
    .stat-label { font-size: 13px; color: #94a3b8; margin-top: 4px; }

    .quick-actions h2 { font-size: 20px; font-weight: 600; margin-bottom: 16px; }
    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
    .action-card {
      display: block;
      text-decoration: none;
      color: inherit;
      transition: transform 0.2s, border-color 0.2s;
    }
    .action-card:hover { transform: translateY(-2px); border-color: #6366f1; }
    .action-icon { font-size: 36px; display: block; margin-bottom: 12px; }
    .action-card h3 { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
    .action-card p { font-size: 13px; color: #94a3b8; line-height: 1.5; }
  `]
})
export class DashboardComponent implements OnInit {
  progress?: ProgressDTO;
  loading = true;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.quizService.getProgress().subscribe({
      next: (p) => { this.progress = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
