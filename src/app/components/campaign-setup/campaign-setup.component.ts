import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-campaign-setup',
  templateUrl: './campaign-setup.component.html',
  standalone: false,
  styleUrls: ['./campaign-setup.component.css']
})
export class CampaignSetupComponent {
  subject: string = '';
  body: string = '';
  scheduledTime: string = '';
  selectedFile: File | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  scheduleType: string = 'Once';
  scheduledTimeOfDay: string = '10:00';

  constructor(private apiService: ApiService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submit() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.scheduleType === 'Once' && !this.scheduledTime) {
      this.errorMessage = "Please select a date and time.";
      this.isLoading = false;
      return;
    }
    if (this.scheduleType === 'Daily' && !this.scheduledTimeOfDay) {
      this.errorMessage = "Please select a daily time.";
      this.isLoading = false;
      return;
    }

    if (this.selectedFile) {
      this.apiService.uploadResume(this.selectedFile).subscribe({
        next: (res) => this.createCampaignCall(res.resumeFilePath),
        error: (err) => {
          this.errorMessage = 'Failed to upload resume.';
          this.isLoading = false;
        }
      });
    } else {
      this.createCampaignCall();
    }
  }

  private createCampaignCall(resumeFilePath?: string) {
    const campaign: any = {
      subject: this.subject,
      body: this.body,
      scheduleType: this.scheduleType,
      resumeFilePath
    };

    if (this.scheduleType === 'Once') {
      campaign.scheduledTime = new Date(this.scheduledTime).toISOString();
    } else {
      campaign.scheduledTimeOfDay = this.scheduledTimeOfDay;
    }

    this.apiService.createCampaign(campaign).subscribe({
      next: (res) => {
        this.successMessage = 'Campaign created successfully! Campaign ID: ' + res.id;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to create campaign.';
        this.isLoading = false;
      }
    });
  }
}
