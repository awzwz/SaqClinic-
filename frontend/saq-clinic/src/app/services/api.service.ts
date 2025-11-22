import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactSubmission {
  fullName: string;
  phoneNumber: string;
  email?: string;
  preferredService?: string;
  message?: string;
}

export interface StoredSubmission extends ContactSubmission {
  id: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  submitInquiry(payload: ContactSubmission): Observable<StoredSubmission> {
    return this.http.post<StoredSubmission>(`${this.baseUrl}/api/submissions`, payload);
  }

  getSubmissions(): Observable<StoredSubmission[]> {
    return this.http.get<StoredSubmission[]>(`${this.baseUrl}/api/submissions`);
  }
}
