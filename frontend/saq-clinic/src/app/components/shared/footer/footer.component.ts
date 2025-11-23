import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  // styleUrls: ['./footer.component.css'],  // ← comment out or delete this line
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
