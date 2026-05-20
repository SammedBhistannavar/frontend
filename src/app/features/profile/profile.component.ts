import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <h1>👤 My Profile</h1>
        <p>Manage your personal information</p>
      </div>

      <div class="loading" *ngIf="loading"><div class="spinner"></div></div>

      <div class="profile-content" *ngIf="profile && !loading">
        <div class="profile-avatar-card card">
          <div class="avatar">{{ profile.name?.charAt(0)?.toUpperCase() }}</div>
          <h2>{{ profile.name }}</h2>
          <p class="email">{{ profile.email }}</p>
        </div>

        <div class="profile-form card">
          <h3>Edit Information</h3>
          <div class="alert alert-success" *ngIf="success">{{ success }}</div>
          <div class="alert alert-error" *ngIf="error">{{ error }}</div>

          <div class="form-group">
            <label>Full Name</label>
            <input class="form-control" [(ngModel)]="profile.name" placeholder="Your name">
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input class="form-control" [(ngModel)]="profile.phone" placeholder="+91 9876543210">
          </div>
          <div class="form-group">
            <label>Bio</label>
            <textarea class="form-control" [(ngModel)]="profile.bio" rows="3" placeholder="Tell us about yourself..."></textarea>
          </div>
          <div class="form-group">
            <label>Skills</label>
            <input class="form-control" [(ngModel)]="profile.skills" placeholder="Java, Spring Boot, Angular, SQL...">
          </div>
          <div class="form-group">
            <label>Resume URL</label>
            <input class="form-control" [(ngModel)]="profile.resumeUrl" placeholder="https://link-to-your-resume.com">
          </div>

          <button class="btn btn-primary" (click)="save()" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; }
    .page-header p { color: #94a3b8; margin-top: 4px; }

    .profile-content { display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: start; }
    @media (max-width: 700px) { .profile-content { grid-template-columns: 1fr; } }

    .profile-avatar-card { text-align: center; padding: 32px 24px; }
    .avatar {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 32px; font-weight: 700; color: white;
      margin: 0 auto 16px;
    }
    .profile-avatar-card h2 { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
    .email { font-size: 13px; color: #94a3b8; }

    .profile-form h3 { font-size: 16px; font-weight: 600; margin-bottom: 20px; }
    textarea.form-control { resize: vertical; }
  `]
})
export class ProfileComponent implements OnInit {
  profile?: UserProfile;
  loading = true;
  saving = false;
  success = '';
  error = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (p) => { this.profile = p; this.loading = false; },
      error: () => { this.loading = false; this.error = 'Failed to load profile.'; }
    });
  }

  save(): void {
    if (!this.profile) return;
    this.saving = true;
    this.success = '';
    this.error = '';
    this.profileService.updateProfile({
      name: this.profile.name,
      phone: this.profile.phone,
      bio: this.profile.bio,
      skills: this.profile.skills,
      resumeUrl: this.profile.resumeUrl
    }).subscribe({
      next: (p) => {
        this.profile = p;
        this.success = 'Profile updated successfully!';
        this.saving = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: () => {
        this.error = 'Failed to update profile.';
        this.saving = false;
      }
    });
  }
}
