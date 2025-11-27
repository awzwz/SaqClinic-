import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminAuthService } from './admin-auth.service';

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

  constructor(
    private http: HttpClient,
    private adminAuth: AdminAuthService
  ) {}

  // Публичная форма на лендинге
  submitInquiry(payload: ContactSubmission): Observable<StoredSubmission> {
    return this.http.post<StoredSubmission>(
      `${this.baseUrl}/api/submissions`,
      payload
    );
  }

  // Загрузка заявок в админ-панели (только с токеном)
  getSubmissions(): Observable<StoredSubmission[]> {
    const token = this.adminAuth.getToken();

    const headers = token
      ? new HttpHeaders({ 'X-Admin-Token': token })
      : new HttpHeaders();

    return this.http.get<StoredSubmission[]>(
      `${this.baseUrl}/api/admin/submissions`,
      { headers }
    );
  }
}
