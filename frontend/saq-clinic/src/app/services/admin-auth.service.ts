import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly storageKey = 'saq_admin_token';

  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }

  get isLoggedIn$() {
    return this.loggedIn$.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  login(password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${this.apiBaseUrl}/api/admin/login`, { password })
      .pipe(
        tap(res => {
          localStorage.setItem(this.storageKey, res.token);
          this.loggedIn$.next(true);
        }),
        map(() => true)
      );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.loggedIn$.next(false);
  }
}
