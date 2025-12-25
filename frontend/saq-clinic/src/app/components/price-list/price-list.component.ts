import { Component } from '@angular/core';

@Component({
    selector: 'app-price-list',
    templateUrl: './price-list.component.html',
    styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent {
    // Placeholder URL - User will need to update this or I will ask for it
    sheetUrl: string = 'https://docs.google.com/spreadsheets/d/19bcO2G2Q8p3BWCq8w1__UOrkWZw3ppd_Btyys-mBoEc/edit?usp=sharing';

    constructor() { }
}
