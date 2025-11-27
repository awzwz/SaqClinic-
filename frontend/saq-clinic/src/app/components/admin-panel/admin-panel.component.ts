import { Component } from '@angular/core';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  password = '';
  isLoading = false;
  error: string | null = null;

  constructor(public adminAuth: AdminAuthService) {}

  get isLoggedIn$() {
    return this.adminAuth.isLoggedIn$;
  }

  onLogin(): void {
    if (!this.password.trim()) {
      this.error = 'Введите пароль';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.adminAuth.login(this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.password = '';
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Неверный пароль';
      }
    });
  }

  onLogout(): void {
    this.adminAuth.logout();
  }
}
