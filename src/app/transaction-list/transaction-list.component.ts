import {Component} from '@angular/core';
import {BehaviorSubject, combineLatest, of} from 'rxjs';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AdvancedTransactionFormComponent} from '../advanced-transaction-form/advanced-transaction-form.component';
import {map, switchMap, tap} from 'rxjs/operators';
import {ITransaction} from '../value-objects/transaction-interface';
import {TransactionType} from '../value-objects/transaction-type-enum';
import {FireBaseTableService} from '../services/fire-base-table.service';
import * as _ from 'lodash';
import {Router} from '@angular/router';
import {BusyIndicatorService} from '../services/busy-indicator.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserInfo} from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
    selector: 'app-dashboard',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent {
    readonly TRANSACTION_TYPE = TransactionType;
    readonly NEVER_REPEAT_ID = 'aPn6tnYI3bWxyzRglunz';
    readonly NOT_A_TAX_EXEMPTION = 'tmoJWDCNMNI47IJMP5ah';
    defaultTransactionData = {};
    userDetails: UserInfo;
    userDetails$ = this.auth.user.pipe(
        tap(userDetails => {
            if (userDetails && userDetails.providerData && userDetails.providerData.length > 0) {
                this.userDetails = userDetails.providerData[0];
            }
            else {
                this.userDetails = null;
            }
        })
    );
    transactionTypeAction: BehaviorSubject<TransactionType> = new BehaviorSubject<TransactionType>(TransactionType.INCOME);
    transactionType$ = this.transactionTypeAction.asObservable();

    filteredTransactions$ = combineLatest(this.auth.user, this.transactionType$).pipe(switchMap(
        ([userDetails, transactionType]) => {
            if (userDetails && userDetails.providerData && userDetails.providerData.length > 0) {
                return this.afs.collection<any>(
                    'transaction',
                    ref => ref.where('uid', '==', userDetails.providerData[0].uid).where('type', '==', transactionType)
                ).snapshotChanges().pipe(
                    map(actions =>
                        actions.map(a => {
                            const data = a.payload.doc.data();
                            const id = a.payload.doc.id;
                            return {id, ...data};
                        })
                    )
                );
            }
            else {
                return of([]);
            }
        }
    ));
    transactionsTable = this.fireBaseTable.getTable('transaction');
    defaultOptionsTable = this.fireBaseTable.getTable('defaultOptions');

    newTransactions: ITransaction;

    constructor(
        public dialog: MatDialog,
        private fireBaseTable: FireBaseTableService,
        public busyIndicator: BusyIndicatorService,
        private afs: AngularFirestore,
        public auth: AngularFireAuth
    ) {
        this.getDefaultOptions();
    }

    getDefaultOptions() {
        const busyIndicatorId = this.busyIndicator.show();
        const transactionsSubscription = this.defaultOptionsTable.getDocById('transactions').valueChanges().subscribe(
            (value: ITransaction) => {
                this.defaultTransactionData = value;
                this.newTransactions = _.clone(this.defaultTransactionData) as ITransaction;
                this.busyIndicator.hide(busyIndicatorId);
                transactionsSubscription.unsubscribe();
            }
        );
    }

    async setTransactionType(transactionType: TransactionType) {
        this.newTransactions.type = transactionType;
        this.transactionTypeAction.next(transactionType);
    }

    openDialog(transaction: ITransaction): void {
        const dialogRef = this.dialog.open(AdvancedTransactionFormComponent, {
            width: '250px',
            data: transaction,
            hasBackdrop: true,
            disableClose: true,
            minWidth: window.screen.width > 700 ? '700px' : '90vw'
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                const busyIndicatorId = this.busyIndicator.show();
                result.uid = this.userDetails.uid;
                await this.transactionsTable.update(result.id, result);
                this.busyIndicator.hide(busyIndicatorId);
            }
        });
    }

    async addTransaction(transaction: ITransaction, form: NgForm, transactionName: HTMLInputElement, transactionType) {
        this.newTransactions.type = transactionType;
        const busyIndicatorId = this.busyIndicator.show();
        this.newTransactions.uid = this.userDetails.uid;
        const sample = await this.transactionsTable.insert(this.newTransactions);
        this.newTransactions = _.clone(this.defaultTransactionData) as ITransaction;
        this.newTransactions.type = transactionType;
        form.resetForm(this.newTransactions);
        this.busyIndicator.hide(busyIndicatorId);
    }

    async deleteTransaction(transaction: ITransaction) {
        const isConfirmed = confirm('Are you sure! Do you want to delete ' + transaction.type.toUpperCase());
        if (isConfirmed) {
            const busyIndicatorId = this.busyIndicator.show();
            const deletedRecord = await this.transactionsTable.remove(transaction.id);
            this.busyIndicator.hide(busyIndicatorId);
        }
    }
}
