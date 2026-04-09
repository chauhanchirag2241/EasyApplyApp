import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CampaignSetupComponent } from './components/campaign-setup/campaign-setup.component';
import { ContactsSetupComponent } from './components/contacts-setup/contacts-setup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    CampaignSetupComponent,
    ContactsSetupComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
