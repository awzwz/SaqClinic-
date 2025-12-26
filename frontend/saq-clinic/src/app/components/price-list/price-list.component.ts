import { Component } from '@angular/core';

@Component({
    selector: 'app-price-list',
    templateUrl: './price-list.component.html',
    styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent {
    // Placeholder URL - User will need to update this or I will ask for it
    sheetUrl: string = 'https://docs.google.com/spreadsheets/d/1l-nErqYz_5UVebEswggpBhfb1NPLwYg3EBGWgXHLgdw/edit?usp=sharing';

    constructor() { }
}
