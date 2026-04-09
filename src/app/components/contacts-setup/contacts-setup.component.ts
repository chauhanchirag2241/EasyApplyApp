import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contacts-setup',
  templateUrl: './contacts-setup.component.html',
  standalone: false,
  styleUrls: ['./contacts-setup.component.css']
})
export class ContactsSetupComponent implements OnInit {
  campaigns: any[] = [];
  selectedCampaignId: string = '';
  selectedCampaignProspects: any[] = [];
  emailsInput: string = '';
  
  isLoadingCampaigns = true;
  isLoadingProspects = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchCampaigns();
  }

  fetchCampaigns() {
    this.isLoadingCampaigns = true;
    this.apiService.getCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
        this.isLoadingCampaigns = false;
        
        // Auto select first if exists and none selected
        if (this.campaigns.length > 0 && !this.selectedCampaignId) {
          this.selectCampaign(this.campaigns[0].id);
        } else if (this.selectedCampaignId) {
          // If we just refreshed limits, let's keep it selected
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load campaigns list.';
        this.isLoadingCampaigns = false;
      }
    });
  }

  selectCampaign(id: string) {
    this.selectedCampaignId = id;
    this.fetchProspects();
  }

  fetchProspects() {
    if (!this.selectedCampaignId) return;
    this.isLoadingProspects = true;
    this.apiService.getProspectsForCampaign(this.selectedCampaignId).subscribe({
        next: (res) => { this.selectedCampaignProspects = res; this.isLoadingProspects = false; },
        error: (err) => { this.isLoadingProspects = false; }
    });
  }

  isEditingCampaign = false;
  editCampaignData: any = {};

  startEditCampaign(campaign: any, event: Event) {
    if (event) event.stopPropagation();
    this.isEditingCampaign = true;
    this.editCampaignData = {
      id: campaign.id,
      subject: campaign.subject,
      body: campaign.body || '',
      scheduleType: campaign.scheduleType || 'Once',
      scheduledTimeOfDay: campaign.scheduledTimeOfDay || '10:00',
      scheduledTime: campaign.scheduledTime ? new Date(campaign.scheduledTime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
    };
  }

  cancelEditCampaign() {
    this.isEditingCampaign = false;
  }

  saveEditCampaign() {
    if (!this.editCampaignData.subject || !this.editCampaignData.body) {
      alert("Subject and Body are required.");
      return;
    }

    if (this.editCampaignData.scheduleType === 'Once' && !this.editCampaignData.scheduledTime) {
      alert("Please select a date and time for the one-time campaign.");
      return;
    }

    if (this.editCampaignData.scheduleType === 'Daily' && !this.editCampaignData.scheduledTimeOfDay) {
      alert("Please enter a time for the daily campaign.");
      return;
    }
    
    this.isLoading = true;
    const updatePayload: any = {
      subject: this.editCampaignData.subject,
      body: this.editCampaignData.body,
      scheduleType: this.editCampaignData.scheduleType,
    };

    if (this.editCampaignData.scheduleType === 'Once') {
      updatePayload.scheduledTime = new Date(this.editCampaignData.scheduledTime).toISOString();
    } else {
      updatePayload.scheduledTimeOfDay = this.editCampaignData.scheduledTimeOfDay;
    }

    this.apiService.updateCampaign(this.editCampaignData.id, updatePayload).subscribe({
      next: () => {
        this.isEditingCampaign = false;
        this.isLoading = false;
        this.fetchCampaigns();
      },
      error: (err) => {
        alert("Failed to update campaign");
        this.isLoading = false;
      }
    });
  }

  deleteCampaign(id: string, event: Event) {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this campaign? All contacts and scheduled jobs will be destroyed!")) {
        this.apiService.deleteCampaign(id).subscribe({
            next: () => {
                if (this.selectedCampaignId === id) {
                    this.selectedCampaignId = '';
                    this.selectedCampaignProspects = [];
                }
                this.fetchCampaigns();
            },
            error: (err) => alert("Failed to delete campaign.")
        });
    }
  }

  editProspect(id: string, currentEmail: string) {
    const newEmail = prompt("Enter new email address:", currentEmail);
    if (newEmail && newEmail !== currentEmail) {
        this.apiService.updateProspectEmail(id, newEmail).subscribe({
            next: () => this.fetchProspects(),
            error: (err) => alert("Failed to update email.")
        });
    }
  }

  deleteProspect(id: string) {
    if (confirm("Remove this contact and cancel its scheduled email?")) {
        this.apiService.deleteProspect(id, this.selectedCampaignId).subscribe({
            next: () => {
               this.fetchProspects();
               this.fetchCampaigns(); // refresh counts
            },
            error: (err) => alert("Failed to delete contact.")
        });
    }
  }

  sendNow(id: string) {
    if (confirm("Are you sure you want to send the email to this contact immediately?")) {
        this.apiService.sendNow(id, this.selectedCampaignId).subscribe({
            next: () => {
                alert("Email queued for immediate delivery!");
                this.fetchProspects();
            },
            error: (err) => alert("Failed to queue email.")
        });
    }
  }

  submit() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const contactsRaw = this.emailsInput.split('\n').map(e => e.trim()).filter(e => e);
    const contacts: {email: string, company?: string, manager?: string}[] = [];

    contactsRaw.forEach(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length > 0 && parts[0]) {
            contacts.push({
                email: parts[0],
                company: parts.length > 1 ? parts[1] : undefined,
                manager: parts.length > 2 ? parts[2] : undefined
            });
        }
    });

    if (!this.selectedCampaignId || contacts.length === 0) {
      this.errorMessage = 'Please select a campaign and provide at least one valid email.';
      this.isLoading = false;
      return;
    }

    this.apiService.addProspects(this.selectedCampaignId, contacts).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Prospects added successfully.';
        this.isLoading = false;
        this.emailsInput = ''; // Clear text area
        this.fetchCampaigns(); // Refresh counts
        this.fetchProspects(); // Refresh prospect list
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to add prospects.';
        this.isLoading = false;
      }
    });
  }
}
