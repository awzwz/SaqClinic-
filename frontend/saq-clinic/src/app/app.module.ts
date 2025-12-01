import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SubmissionListComponent } from './components/submission-list/submission-list.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ScrollRevealDirective } from './directives/scroll-reveal.directive';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { SpecialistsComponent } from './components/specialists/specialists.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SubmissionListComponent,
    FooterComponent,
    ScrollRevealDirective,
    AdminPanelComponent,
    SpecialistsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
