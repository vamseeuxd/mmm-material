import {Component, OnInit} from '@angular/core';
import {TransactionTypeService} from './transaction-type.service';

@Component({
    selector: 'app-types',
    templateUrl: './types.component.html',
    styleUrls: ['./types.component.css']
})
export class TypesComponent implements OnInit {

    types$ = this.typesService.types$;

    constructor(private typesService: TransactionTypeService) {
    }

    ngOnInit(): void {
    }

}
