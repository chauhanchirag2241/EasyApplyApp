import { Component, OnInit } from '@angular/core';
import { ApiService, Stats } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: Stats = { total: 0, pending: 0, sent: 0, failed: 0, recentSent: [] };
  isLoading = true;
  isExecuting = false;
  successMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.refreshStats();
  }

  triggerSend() {
    this.isExecuting = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    this.apiService.executePendingEmails().subscribe({
      next: (resp) => {
        this.successMessage = resp.message || 'Execution started...';
        this.isExecuting = false;
        // Refresh stats after a short delay
        setTimeout(() => {
          this.refreshStats();
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to trigger email execution.';
        this.isExecuting = false;
      }
    });
  }

  refreshStats() {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load dashboard statistics.';
        this.isLoading = false;
      }
    });
  }
}
