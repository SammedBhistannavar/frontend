import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar" *ngIf="auth.isLoggedIn()">
      <div class="nav-brand">
        <span class="brand-icon">🎯</span>
        <span>Interview Prep</span>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/questions" routerLinkActive="active">Questions</a>
        <a routerLink="/quiz" routerLinkActive="active">Quiz</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>
        <a routerLink="/admin" routerLinkActive="active" *ngIf="auth.isAdmin()">Admin</a>
      </div>
      <div class="nav-actions">
        <span class="user-email">{{ email }}</span>
        <button class="btn btn-secondary" (click)="auth.logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #1e293b;
      border-bottom: 1px solid #334155;
      padding: 0 24px;
      display: flex;
      align-items: center;
      gap: 32px;
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 18px;
      color: #6366f1;
      white-space: nowrap;
    }
    .brand-icon { font-size: 22px; }
    .nav-links {
      display: flex;
      gap: 4px;
      flex: 1;
    }
    .nav-links a {
      padding: 8px 16px;
      border-radius: 8px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-links a:hover { background: #334155; color: #f1f5f9; }
    .nav-links a.active { background: rgba(99,102,241,0.15); color: #6366f1; }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-email {
      font-size: 13px;
      color: #64748b;
    }
  `]
})
export class NavbarComponent {
  email = localStorage.getItem('email') || '';
  constructor(public auth: AuthService) {}
}
