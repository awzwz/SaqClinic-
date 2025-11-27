import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.scss'],
})
export class SubmissionListComponent implements OnInit {
  submissions: any[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchSubmissions();
  }

  fetchSubmissions(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.apiService.getSubmissions().subscribe({
      next: (submissions) => {
        this.submissions = submissions;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.hasError = true;

        if (err.status === 401 || err.status === 403) {
          // нет доступа — говорим, что надо зайти в админ-панель
          this.errorMessage =
            'Нет доступа. Пожалуйста, войдите в админ-панель.';
        } else {
          // любая другая ошибка (сервер, сеть и т.п.)
          this.errorMessage =
            'Не удалось получить данные. Проверьте соединение и повторите.';
        }
      },
    });
  }
}
