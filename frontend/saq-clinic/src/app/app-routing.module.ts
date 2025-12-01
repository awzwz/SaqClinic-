import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SubmissionListComponent } from './components/submission-list/submission-list.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { SpecialistsComponent } from './components/specialists/specialists.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  // секретный URL для клиники:
  { path: 'admin-panel-94f83p', component: AdminPanelComponent },
  { path: 'specialists', component: SpecialistsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,                     // <<< добавили
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

