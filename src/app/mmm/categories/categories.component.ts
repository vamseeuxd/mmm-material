import {Component, OnInit} from '@angular/core';
import {TransactionTypeService} from '../types/transaction-type.service';
import {CategoriesService} from './categories.service';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

    categories$ = this.categoriesService.categories$;
    selectedType$ = this.typesService.selectedType$;
    types$ = this.typesService.types$;

    constructor(
        private categoriesService: CategoriesService,
        private typesService: TransactionTypeService,
    ) {
    }

    ngOnInit(): void {
    }

}
