import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Campaign {
  subject: string;
  body: string;
  resumeFilePath?: string;
  scheduleType: string;
  scheduledTime?: string;
  scheduledTimeOfDay?: string;
}

export interface Stats {
  total: number;
  pending: number;
  sent: number;
  failed: number;
  recentSent: any[];
  lastJobRun?: string;
  nextJobScheduled?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  createCampaign(campaign: Campaign): Observable<any> {
    return this.http.post(`${this.apiUrl}/campaigns`, campaign);
  }

  uploadResume(file: File, customName?: string): Observable<{resumeFilePath: string}> {
    const formData = new FormData();
    if (customName) {
      formData.append('file', file, customName);
    } else {
      formData.append('file', file);
    }
    return this.http.post<{resumeFilePath: string}>(`${this.apiUrl}/campaigns/resume`, formData);
  }

  addProspects(campaignId: string, contacts: {email: string, company?: string, manager?: string}[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/prospects`, { campaignId, contacts });
  }

  getProspectsForCampaign(campaignId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prospects/campaign/${campaignId}`);
  }

  deleteProspect(id: string, campaignId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/prospects/${id}/${campaignId}`);
  }

  updateProspectEmail(id: string, email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/prospects/${id}`, { emailAddress: email });
  }

  sendNow(id: string, campaignId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/prospects/${id}/${campaignId}/send`, {});
  }

  getCampaigns(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/campaigns`);
  }

  deleteCampaign(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/campaigns/${id}`);
  }

  updateCampaign(id: string, updateData: Partial<Campaign>): Observable<any> {
    return this.http.put(`${this.apiUrl}/campaigns/${id}`, updateData);
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/dashboard/stats`);
  }

  executePendingEmails(): Observable<any> {
    return this.http.post(`${this.apiUrl}/dashboard/execute-all`, {});
  }
}
