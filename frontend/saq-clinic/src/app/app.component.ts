import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isMenuOpen = false;

  constructor(private readonly router: Router) {}

  async navigateWithFragment(fragment: string): Promise<void> {
    this.isMenuOpen = false;
    await this.router.navigate(['/'], { fragment });
  }
}
