import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isMenuOpen = false;

  constructor(
    private readonly router: Router,
    private readonly viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    // Force scroll to top on load
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  async navigateWithFragment(fragment: string): Promise<void> {
    this.isMenuOpen = false;
    await this.router.navigate(['/'], { fragment });
  }
}
