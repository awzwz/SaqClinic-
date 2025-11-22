import { Component, OnInit } from '@angular/core';
import { ApiService, StoredSubmission } from '../../services/api.service';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.scss']
})
export class SubmissionListComponent implements OnInit {
  submissions: StoredSubmission[] = [];
  isLoading = false;
  hasError = false;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchSubmissions();
  }

  fetchSubmissions(): void {
    this.isLoading = true;
    this.hasError = false;

    this.apiService.getSubmissions().subscribe({
      next: submissions => {
        this.submissions = submissions;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }
}
