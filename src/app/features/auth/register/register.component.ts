import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <div class="auth-header">
          <span class="auth-icon">🚀</span>
          <h1>Create Account</h1>
          <p>Start your interview prep journey</p>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="alert alert-success" *ngIf="success">{{ success }}</div>

        <div class="form-group">
          <label>Full Name</label>
          <input class="form-control" [(ngModel)]="name" placeholder="John Doe">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input class="form-control" type="email" [(ngModel)]="email" placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input class="form-control" type="password" [(ngModel)]="password" placeholder="••••••••">
        </div>
        <div class="form-group">
          <label>Role</label>
          <select class="form-control" [(ngModel)]="role">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button class="btn btn-primary w-full" (click)="register()" [disabled]="loading">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>

        <p class="auth-footer">Already have an account? <a routerLink="/login">Sign in</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 24px; }
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
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role: 'USER' | 'ADMIN' = 'USER';
  loading = false;
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  register(): void {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.register({ name: this.name, email: this.email, password: this.password, role: this.role }).subscribe({
      next: () => {
        this.success = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.error = 'Registration failed. Email may already be in use.';
        this.loading = false;
      }
    });
  }
}
