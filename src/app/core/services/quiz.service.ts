import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuizStartRequest, QuizQuestion, QuizSubmitRequest, QuizResult, ProgressDTO } from '../models/models';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private baseUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  startQuiz(req: QuizStartRequest): Observable<QuizQuestion[]> {
    return this.http.post<QuizQuestion[]>(`${this.baseUrl}/quiz/start`, req);
  }

  submitQuiz(req: QuizSubmitRequest): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${this.baseUrl}/quiz/submit`, req);
  }

  getResult(sessionId: number): Observable<QuizResult> {
    const params = new HttpParams().set('sessionId', sessionId);
    return this.http.get<QuizResult>(`${this.baseUrl}/quiz/result`, { params });
  }

  getProgress(): Observable<ProgressDTO> {
    return this.http.get<ProgressDTO>(`${this.baseUrl}/progress`);
  }
}
