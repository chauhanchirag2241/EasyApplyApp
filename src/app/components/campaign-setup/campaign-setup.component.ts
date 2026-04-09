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
  resumeName: string = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  scheduleType: string = 'Once'; // Default kept for backend if needed
  scheduledTimeOfDay: string = '10:00';

  constructor(private apiService: ApiService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
        this.resumeName = this.selectedFile.name;
    }
  }

  submit() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.subject || !this.body) {
      this.errorMessage = "Subject and Body are required.";
      this.isLoading = false;
      return;
    }

    if (this.selectedFile) {
      let finalName = this.resumeName.trim() || this.selectedFile.name;
      const extMatch = this.selectedFile.name.match(/\.[0-9a-z]+$/i);
      if (extMatch) {
         const ext = extMatch[0];
         if (!finalName.toLowerCase().endsWith(ext.toLowerCase())) {
             finalName += ext;
         }
      }

      this.apiService.uploadResume(this.selectedFile, finalName).subscribe({
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
      scheduleType: 'Once', // Hardcode default
      resumeFilePath
    };

    campaign.scheduledTime = new Date().toISOString(); // Default to current time

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
