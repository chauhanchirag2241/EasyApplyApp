import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignSetupComponent } from './components/campaign-setup/campaign-setup.component';
import { ContactsSetupComponent } from './components/contacts-setup/contacts-setup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'campaigns', component: CampaignSetupComponent },
  { path: 'contacts', component: ContactsSetupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
