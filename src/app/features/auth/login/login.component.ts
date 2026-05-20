import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <div class="auth-header">
          <span class="auth-icon">🎯</span>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <div class="form-group">
          <label>Email</label>
          <input class="form-control" type="email" [(ngModel)]="email" placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input class="form-control" type="password" [(ngModel)]="password" placeholder="••••••••" (keyup.enter)="login()">
        </div>

        <button class="btn btn-primary w-full" (click)="login()" [disabled]="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p class="auth-footer">Don't have an account? <a routerLink="/register">Register</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .auth-card { width: 100%; max-width: 420px; }
    .auth-header { text-align: center; margin-bottom: 28px; }
    .auth-icon { font-size: 48px; display: block; margin-bottom: 12px; }
    .auth-header h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .auth-header p { color: #94a3b8; font-size: 14px; }
    .w-full { width: 100%; justify-content: center; }
    .auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: #94a3b8; }
    .auth-footer a { color: #6366f1; text-decoration: none; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.token) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = res.msg || 'Login failed.';
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Invalid email or password.';
        this.loading = false;
      }
    });
  }
}
