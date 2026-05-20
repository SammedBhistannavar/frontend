import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, UserProfileUpdate } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private baseUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/profile`);
  }

  updateProfile(dto: UserProfileUpdate): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/profile`, dto);
  }
}
