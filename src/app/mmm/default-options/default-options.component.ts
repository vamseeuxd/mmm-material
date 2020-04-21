import {Component, OnInit} from '@angular/core';
import {DefaultOptionsService} from './default-options.service';
import {Observable} from 'rxjs';
import {TransactionType, TransactionTypeService} from '../types/transaction-type.service';
import {CategoriesService, TransactionCategory} from '../categories/categories.service';
import {MatSelectChange} from '@angular/material/select';
import {TaxExemption, TaxExemptionsService} from '../tax-exemptions/tax-exemptions.service';
import {RepeatOption, RepeatOptionsService} from '../repeat-options/repeat-options.service';
import {NgForm} from '@angular/forms';
import {Transaction} from '../transactions/transactions.service';

@Component({
    selector: 'app-default-options',
    templateUrl: './default-options.component.html',
    styleUrls: ['./default-options.component.css']
})
export class DefaultOptionsComponent implements OnInit {

    transactionOptions$: Observable<Transaction> = this.defaultOptionsService.transactionOptions$;
    types$: Observable<TransactionType[]> = this.transactionTypeService.types$;
    categories$: Observable<TransactionCategory[]> = this.categoryService.categories$;
    taxExemptions$: Observable<TaxExemption[]> = this.taxExemptionsService.taxExemptions$;
    repeatOptions$: Observable<RepeatOption[]> = this.repeatOptionsService.repeatOptions$;
    intervalOptions$: Observable<number[]> = this.repeatOptionsService.intervalOptions$;

    constructor(
        private defaultOptionsService: DefaultOptionsService,
        private transactionTypeService: TransactionTypeService,
        private categoryService: CategoriesService,
        private taxExemptionsService: TaxExemptionsService,
        private repeatOptionsService: RepeatOptionsService,
    ) {
    }

    ngOnInit(): void {
        this.repeatOptions$.subscribe(value => {
            console.log(value);
        });
    }

    onTransactionTypeChange($event: MatSelectChange) {
        this.transactionTypeService.setSelectedType($event.value);
    }

    saveTransaction(form: NgForm, transaction: Transaction) {
        form.resetForm(transaction);
    }

    onRepeatOptionsChange($event: MatSelectChange) {
        console.log($event.value);
        this.repeatOptionsService.setSelectedRepeatOption($event.value);
    }

    resetForm(form: NgForm, transaction: Transaction) {
        form.resetForm(transaction);
    }
}


