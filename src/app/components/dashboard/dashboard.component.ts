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
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.refreshStats();
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
