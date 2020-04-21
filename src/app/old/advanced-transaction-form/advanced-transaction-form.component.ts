import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject, combineLatest, of} from 'rxjs';
import * as _ from 'lodash';
import {map, switchMap} from 'rxjs/operators';
import {ITransaction} from '../value-objects/transaction-interface';
import {RepeatOption} from '../value-objects/repeat-option';
import {FireBaseTableService} from '../services/fire-base-table.service';
import {BusyIndicatorService} from '../../utils/busy-indicator.service';
import {TransactionType} from '../value-objects/transaction-type-enum';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatSelectChange} from '@angular/material/select';

@Component({
    selector: 'app-advanced-transaction-form',
    templateUrl: './advanced-transaction-form.component.html',
    styleUrls: ['./advanced-transaction-form.component.css']
})
export class AdvancedTransactionFormComponent implements OnInit {
    repeatOptionsTable = this.fireBaseTable.getTable('repeat-options');
    taxExemptionsTable = this.fireBaseTable.getTable('tax-exemptions');
    readonly NEVER_REPEAT_ID = 'aPn6tnYI3bWxyzRglunz';
    readonly NOT_A_TAX_EXEMPTION = 'tmoJWDCNMNI47IJMP5ah';

    selectedRepeatOption = '';
    selectedRepeatOptionActions: BehaviorSubject<string> = new BehaviorSubject<string>(this.selectedRepeatOption);
    selectedRepeatOption$ = this.selectedRepeatOptionActions.asObservable();

    selectedType: TransactionType = TransactionType.INCOME;
    selectedTypeActions: BehaviorSubject<TransactionType> = new BehaviorSubject<TransactionType>(this.selectedType);
    selectedType$ = this.selectedTypeActions.asObservable();

    categories$ = combineLatest(this.auth.user, this.selectedType$).pipe(switchMap(
        ([userDetails, transactionType]) => {
            if (userDetails && userDetails.providerData && userDetails.providerData.length > 0) {
                // .where('uid', '==', userDetails.providerData[0].uid)
                return this.afs.collection<any>(
                    'categories',
                    ref => ref.where('type', '==', transactionType)
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

    intervalOptions$ = combineLatest(this.selectedRepeatOption$, this.repeatOptionsTable.data).pipe(
        switchMap(
            ([selectedRepeatOption, repeatOptions]) => {
                const selectedRepeatOptions = repeatOptions.find(o => o.id === selectedRepeatOption);
                if (selectedRepeatOptions) {
                    return of(Array(selectedRepeatOptions.noOfIntervals).fill(0).map((x, i) => i + 1));
                }
                else {
                    return of([]);
                }

            }
        )
    );

    minDate = null;
    maxDate = null;
    title = null;
    masterData: ITransaction;

    ngOnInit(): void {
    }

    constructor(
        private fireBaseTable: FireBaseTableService,
        public dialogRef: MatDialogRef<AdvancedTransactionFormComponent>,
        public busyIndicator: BusyIndicatorService,
        private afs: AngularFirestore,
        public auth: AngularFireAuth,
        @Inject(MAT_DIALOG_DATA) public data: ITransaction) {
        this.setInitData();
        this.handleBusyIndicator();
    }

    handleBusyIndicator() {
        const busyIndicatorId = this.busyIndicator.show();
        const transactionsSubscription = this.intervalOptions$.subscribe(value => {
            this.busyIndicator.hide(busyIndicatorId);
            transactionsSubscription.unsubscribe();
        });
    }

    setInitData() {
        debugger;
        this.data = JSON.parse(JSON.stringify(this.data));
        this.masterData = JSON.parse(JSON.stringify(this.data));
        if (this.data.type) {
            this.selectedType = this.data.type;
            this.selectedTypeActions.next(this.selectedType);
        }
        if (this.data.repeat) {
            this.selectedRepeatOption = this.data.repeat;
            this.selectedRepeatOptionActions.next(this.selectedRepeatOption);
        }
        if (this.data.startDate) {
            const seconds = this.data.startDate.seconds;
            this.data.startDate = new Date(seconds * 1000).toISOString();
            this.masterData.startDate = new Date(seconds * 1000).toISOString();
        }
        if (this.data.endDate) {
            const seconds = this.data.endDate.seconds;
            this.data.endDate = new Date(seconds * 1000).toISOString();
            this.masterData.endDate = new Date(seconds * 1000).toISOString();
        }
        this.title = this.data.name;
    }

    isDataModified(): boolean {
        return _.isEqual(this.masterData, this.data);
    }

    cancelClick(): void {
        this.dialogRef.close(null);
    }

    updateSelectedRepeatOption($event: any, repeatOptions: RepeatOption[]) {
        this.data.interval = 1;
        this.selectedRepeatOption = $event;
        this.selectedRepeatOptionActions.next(this.selectedRepeatOption);
    }

    saveClick(): void {
        const isConfirmed = confirm('Are you sure! Do you want to Save this Transaction');
        if (isConfirmed) {
            this.data.startDate = new Date(this.getFormattedDate(this.data.startDate));
            this.data.endDate = new Date(this.getFormattedDate(this.data.endDate));
            this.dialogRef.close(this.data);
        }
    }

    getFormattedDate(date: string): string {
        return date ? `${new Date(date).getMonth() + 1}-${new Date(date).getDate()}-${new Date(date).getFullYear()}` : '';
    }

    updateMinDate(startDate: string) {
        if (startDate) {
            this.data.startDate = new Date(this.getFormattedDate(this.data.startDate)).toISOString();
            this.minDate = new Date(startDate);
        }
    }

    updateMaxDate(endDate: string) {
        if (endDate) {
            this.data.endDate = new Date(this.getFormattedDate(this.data.endDate)).toISOString();
            this.maxDate = new Date(endDate);
        }
    }

    updateSelectedType($event: MatSelectChange) {
        this.data.category = null;
        this.selectedType = $event.value;
        this.selectedTypeActions.next(this.selectedType);
    }
}
