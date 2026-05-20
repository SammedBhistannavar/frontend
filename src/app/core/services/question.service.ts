import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionRequest, QuestionResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private userUrl = 'http://localhost:8080/api/user';
  private adminUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  getQuestions(topic: string, difficulty: string): Observable<QuestionResponse[]> {
    const params = new HttpParams().set('topic', topic).set('difficulty', difficulty);
    return this.http.get<QuestionResponse[]>(`${this.userUrl}/questions`, { params });
  }

  addQuestion(req: QuestionRequest): Observable<QuestionResponse> {
    return this.http.post<QuestionResponse>(`${this.adminUrl}/questions`, req);
  }
}
