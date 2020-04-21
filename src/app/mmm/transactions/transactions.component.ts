import {Component, Inject, OnDestroy} from '@angular/core';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {MmmDate, Transaction, TransactionsService} from './transactions.service';
import {TransactionType, TransactionTypeService} from '../types/transaction-type.service';
import {CategoriesService, TransactionCategory} from '../categories/categories.service';
import {TaxExemption, TaxExemptionsService} from '../tax-exemptions/tax-exemptions.service';
import {RepeatOption, RepeatOptionsService} from '../repeat-options/repeat-options.service';
import {NgForm} from '@angular/forms';
import {AlertService, DialogData} from '../../utils/alert-service';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
    defaultTransaction$: Observable<Transaction> = this.transactionsService.defaultTransaction$;
    transactions$: Observable<Transaction[]> = this.transactionsService.transactions$;
    types$: Observable<TransactionType[]> = this.transactionTypeService.types$;
    selectedTypeForList$: Observable<string> = this.transactionTypeService.selectedTypeForList$;
    selectedTransactionId = '';

    constructor(
        public dialog: MatDialog,
        private transactionsService: TransactionsService,
        private alert: AlertService,
        private transactionTypeService: TransactionTypeService,
    ) {
    }

    openManageTransactionModal(transaction: Transaction, isUpdate: boolean, transaction_path = ''): void {
        this.transactionsService.setDefaultTransactionPath(transaction_path);
        const dialogRef = this.dialog.open(ManageTransactionsComponent, {
            width: '80vw',
            disableClose: true,
            data: {isUpdate, transaction}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
        });
    }

    async deleteTodo(id: string) {
        try {
            await this.alert.confirm('Delete Confirmation', 'Are you sure! Do you want to delete todo?', 'Yes', 'No');
            try {
                const res = this.transactionsService.deleteTodo(id);
            } catch (e) {
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    }
}

@Component({
    selector: 'manage-transactions',
    template: `
        <h1 mat-dialog-title>{{data.isUpdate ? 'Edit' : 'Add New'}} Transaction</h1>
        <!-- *ngIf="defaultTransaction$ | async as transaction"-->
        <div mat-dialog-content
             *ngIf="transaction">
            <!--<pre>{{transaction|json}}</pre>-->
            <div class="row">
                <form class="col-12"
                      #form="ngForm">
                    <div class="row bg-white">
                        <!-- Transaction Type -->
                        <div class="col-md-6"
                             *ngIf="types$ | async as types">
                            <mat-form-field class="w-100">
                                <mat-label>TRANSACTION TYPE</mat-label>
                                <mat-select required
                                            name="type"
                                            autocomplete="off"
                                            placeholder="Transaction Type"
                                            [ngModel]="transaction.type"
                                            (selectionChange)="transactionTypeService.setSelectedType($event.value)">
                                    <mat-option *ngFor="let type of types"
                                                [value]="type.id">{{type.name}}</mat-option>
                                </mat-select>
                            </mat-form-field>
                        </div>


                        <!-- Transaction Name -->
                        <div class="col-md-6">
                            <mat-form-field class="w-100">
                                <mat-label>{{form.value.type|uppercase}} NAME</mat-label>
                                <input matInput
                                       required
                                       name="name"
                                       autocomplete="off"
                                       [ngModel]="transaction.name"
                                       placeholder="Transaction Name">
                            </mat-form-field>
                        </div>


                        <!-- Transaction Amount -->
                        <div class="col-md-6">
                            <mat-form-field class="w-100">
                                <mat-label>{{form.value.type|uppercase}}  AMOUNT</mat-label>
                                <input matInput
                                       required
                                       type="number"
                                       name="amount"
                                       autocomplete="off"
                                       [ngModel]="transaction.amount"
                                       placeholder="Transaction Amount">
                            </mat-form-field>
                        </div>


                        <!-- Transaction Category -->
                        <div class="col-md-6"
                             *ngIf="categories$ | async as categories">
                            <mat-form-field class="w-100">
                                <mat-label>{{form.value.type|uppercase}}  CATEGORY</mat-label>
                                <mat-select required
                                            name="category"
                                            autocomplete="off"
                                            placeholder="Transaction Category"
                                            [ngModel]="transaction.category">
                                    <mat-option *ngFor="let category of categories"
                                                [value]="category.id">{{category.name}}</mat-option>
                                </mat-select>
                            </mat-form-field>
                        </div>


                        <div class="col-md-6">
                            <div class="row">
                                <ng-container *ngIf="form.value.repeat!=='never'">
                                    <div class="col-4"
                                         *ngIf="intervalOptions$ | async as intervalOptions">
                                        <mat-form-field class="w-100">
                                            <mat-label>REPEAT {{form.value.type|uppercase}} EVERY</mat-label>
                                            <mat-select required
                                                        name="interval"
                                                        autocomplete="off"
                                                        [ngModel]="transaction.interval">
                                                <mat-option *ngFor="let intervalOption of intervalOptions"
                                                            [value]="intervalOption">{{intervalOption}}</mat-option>
                                            </mat-select>
                                        </mat-form-field>
                                    </div>
                                </ng-container>

                                <ng-container *ngIf="repeatOptions$ | async as repeatOptions">
                                    <div [class.col-8]="form.value.repeat!=='never'"
                                         [class.col-12]="form.value.repeat==='never'">
                                        <mat-form-field class="w-100">
                                            <mat-label *ngIf="form.value.repeat==='never'">
                                                REPEAT {{form.value.type|uppercase}} EVERY
                                            </mat-label>
                                            <mat-select required
                                                        name="repeat"
                                                        autocomplete="off"
                                                        (selectionChange)="repeatOptionsService.setSelectedRepeatOption($event.value)"
                                                        [ngModel]="transaction.repeat">
                                                <mat-option *ngFor="let repeatOption of repeatOptions"
                                                            [value]="repeatOption.id">{{repeatOption.name}}</mat-option>
                                            </mat-select>
                                        </mat-form-field>
                                    </div>
                                </ng-container>
                            </div>
                        </div>
                        <!-- Transaction Start Date -->
                        <div class="col-md-6"
                             *ngIf="form.value.repeat!=='never'">
                            <mat-form-field class="w-100">
                                <mat-label>{{form.value.type|uppercase}}  START DATE</mat-label>
                                <input required
                                       name="startDate"
                                       matInput
                                       autocomplete="off"
                                       [matDatepicker]="startDate"
                                       [ngModel]="getISOString(transaction.startDate)"
                                       placeholder="Transaction Start Date">
                                <mat-datepicker-toggle matSuffix
                                                       [for]="startDate"></mat-datepicker-toggle>
                                <mat-datepicker #startDate></mat-datepicker>
                            </mat-form-field>
                        </div>


                        <!-- Transaction End Date -->
                        <div class="col-md-6"
                             *ngIf="form.value.repeat!=='never'">
                            <mat-form-field class="w-100">
                                <mat-label>{{form.value.type|uppercase}}  END DATE</mat-label>
                                <input required
                                       name="endDate"
                                       matInput
                                       autocomplete="off"
                                       [matDatepicker]="endDate"
                                       [ngModel]="getISOString(transaction.endDate)"
                                       placeholder="Transaction End Date">
                                <mat-datepicker-toggle matSuffix
                                                       [for]="endDate"></mat-datepicker-toggle>
                                <mat-datepicker #endDate></mat-datepicker>
                            </mat-form-field>
                        </div>


                        <!-- Transaction Exemptions -->
                        <div class="col-md-6"
                             *ngIf="form.value.type==='expenses'">
                            <mat-form-field class="w-100"
                                            *ngIf="taxExemptions$ | async as taxExemptions">
                                <mat-label>TAX EXEMPTIONS UNDER</mat-label>
                                <mat-select required
                                            name="exemptions"
                                            autocomplete="off"
                                            placeholder="Transaction Category"
                                            [ngModel]="transaction.exemptions">
                                    <mat-option *ngFor="let taxExemption of taxExemptions"
                                                [value]="taxExemption.id">{{taxExemption.name}}</mat-option>
                                </mat-select>
                            </mat-form-field>
                        </div>


                        <!-- Transaction Remarks -->
                        <div class="col-md-6">
                            <mat-form-field class="w-100">
                                <mat-label>{{form.value.type|uppercase}}  REMARKS</mat-label>
                                <input name="remarks"
                                       matInput
                                       autocomplete="off"
                                       [ngModel]="transaction.remarks"
                                       placeholder="Transaction Remarks">
                            </mat-form-field>
                        </div>
                        <div class="col-12 text-right">
                            <button mat-raised-button
                                    class="mr-3"
                                    color="warn"
                                    [disabled]="form.invalid"
                                    (click)="saveTransaction(form,transaction)">SAVE
                            </button>
                            <button mat-raised-button
                                    type="button"
                                    (click)="resetForm(form,transaction)">CANCEL
                            </button>
                        </div>
                    </div>
                </form>
                <!--<div class="col-12">
                    <pre>{{form.value|json}}</pre>
                </div>-->
            </div>
        </div>
    `,
})
export class ManageTransactionsComponent implements OnDestroy {

    defaultTransaction$: Observable<Transaction> = this.transactionsService.defaultTransaction$;
    defaultTransaction: Transaction;
    types$: Observable<TransactionType[]> = this.transactionTypeService.types$;
    categories$: Observable<TransactionCategory[]> = this.categoryService.categories$;
    taxExemptions$: Observable<TaxExemption[]> = this.taxExemptionsService.taxExemptions$;
    repeatOptions$: Observable<RepeatOption[]> = this.repeatOptionsService.repeatOptions$;
    intervalOptions$: Observable<number[]> = this.repeatOptionsService.intervalOptions$;
    transaction: Transaction;
    subscriptions: Subscription [] = [];

    constructor(
        private transactionsService: TransactionsService,
        private transactionTypeService: TransactionTypeService,
        private categoryService: CategoriesService,
        private taxExemptionsService: TaxExemptionsService,
        private repeatOptionsService: RepeatOptionsService,
        private alert: AlertService,
        public dialogRef: MatDialogRef<ManageTransactionsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        const subscription = combineLatest(this.transactionTypeService.selectedType$, this.defaultTransaction$).subscribe(
            ([type, defaultTransaction]) => {
                this.repeatOptionsService.setSelectedRepeatOption(defaultTransaction.repeat);
                if (this.data.isUpdate) {
                    this.repeatOptionsService.setSelectedRepeatOption(this.data.transaction.repeat);
                }
                this.defaultTransaction = defaultTransaction;
                setTimeout(() => {
                    if (this.data.isUpdate) {
                        this.transaction = this.data.transaction;
                    }
                    else {
                        this.transaction = defaultTransaction;
                        this.transaction.type = type;
                    }
                }, 1000);
            }
        );
        this.subscriptions.push(subscription);
    }

    getISOString(data: MmmDate): string {
        if (data && data.seconds) {
            return new Date(data.seconds * 1000).toISOString();
        }
        else {
            return null;
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(value => {
            value.unsubscribe();
        });
    }

    async saveTransaction(form: NgForm, transaction: Transaction) {

        if (this.data.isUpdate) {
            await this.updateTransaction(form, transaction, this.data.transaction.id);
        }
        else {
            await this.addTransaction(form, transaction);
        }
    }

    async addTransaction(form: NgForm, transaction: Transaction) {
        try {
            await this.transactionsService.addTransaction(form.value);
            form.resetForm(transaction);
            this.dialogRef.close();
        } catch (e) {
            await this.alert.show('Invalid Input', 'Minimum 3 charters are required for Todo Name!');
        }
    }

    async updateTransaction(form: NgForm, transaction: Transaction, transactionId) {
        if (form.value.startDate) {
            form.value.startDate = new Date(form.value.startDate);
        }
        if (form.value.endDate) {
            form.value.endDate = new Date(form.value.endDate);
        }
        try {
            await this.transactionsService.updateTransaction(form.value, transactionId);
            form.resetForm(transaction);
            this.dialogRef.close();
        } catch (e) {
            await this.alert.show('Invalid Input', 'Minimum 3 charters are required for Todo Name!');
        }
    }

    async resetForm(form: NgForm, transaction: Transaction) {
        try {
            await this.alert.confirm('Cancel Confirmation', 'Are you sure! Do you want to cancel?', 'Yes', 'No');
            form.resetForm(transaction);
            this.dialogRef.close();
        } catch (e) {

        }
    }

}
