import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, switchMap} from 'rxjs/operators';
import {TransactionType} from '../value-objects/transaction-type-enum';
import {BehaviorSubject, combineLatest, of} from 'rxjs';
import {NgForm} from '@angular/forms';
import {BusyIndicatorService} from '../../utils/busy-indicator.service';
import {ITransaction} from '../value-objects/transaction-interface';
import {MonthTypeEnum} from '../value-objects/month-type-enum';

@Component({
    selector: 'app-table-list',
    templateUrl: './monthly-income-list.component.html',
    styleUrls: ['./monthly-income-list.component.css']
})
export class MonthlyIncomeListComponent implements OnInit {
    readonly MONTH_TYPE = MonthTypeEnum;
    selectedMonthType: MonthTypeEnum | string = (new Date().getMonth() + 1).toString();
    monthsList = Object.keys(MonthTypeEnum);
    selectedMonthTypeAction: BehaviorSubject<MonthTypeEnum | string> = new BehaviorSubject<MonthTypeEnum | string>(this.selectedMonthType);
    selectedMonthType$ = this.selectedMonthTypeAction.asObservable();
    repeatOptions$ = this.afs.collection<any>('repeat-options').snapshotChanges().pipe(
        map(actions =>
            actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return {id, ...data};
            })
        )
    );

    categoriesCollection = this.afs.collection<any>('categories');
    transaction$ = combineLatest(this.auth.user, this.selectedMonthType$, this.repeatOptions$).pipe(
        switchMap(
            ([userDetails, monthType, repeatOptions]) => {
                if (userDetails && userDetails.providerData && userDetails.providerData.length > 0) {
                    // // ref => ref.where('type', '==', monthType).where('uid', 'in', ['mmm', userDetails.providerData[0].uid])
                    return this.afs.collection<any>('transaction').snapshotChanges().pipe(
                        map(actions =>
                            actions.map(a => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                data.id = id;
                                return this.getTransactionBreakups(
                                    data,
                                    repeatOptions.find(rp => rp.id === data.repeat)
                                ).filter(d => d.dueOn.split('-')[0] == monthType);
                                //.map(d => ({...d, data}));
                            })
                        )
                    );
                }
                else {
                    return of([]);
                }
            }
        )
    );
    categoryToEdit;

    constructor(
        private afs: AngularFirestore,
        public auth: AngularFireAuth,
        public busyIndicator: BusyIndicatorService,
    ) {
    }

    ngOnInit() {
    }

    getTransactionBreakups(transaction: any, repeatOption: any) {
        // console.log('startDateValue', transaction.startDate, 'endDateVale', transaction.endDate);
        if(!transaction.startDate){
            var temDate = new Date();
            temDate.setTime(0);
            transaction.startDate = temDate.getSeconds();
        }
        if(!transaction.endDate){
            var temDate = new Date();
            temDate.setTime(0);
            transaction.endDate = temDate.getSeconds();
        }
        console.log('startDateValue', transaction.startDate, 'endDateVale', transaction.endDate);
        const recurringDates = this.recurringDates(
            transaction.startDate.seconds * 1000,
            transaction.endDate.seconds * 1000,
            repeatOption.adjustInterval * transaction.interval,
            repeatOption['api-id'],
            false
        );
        const returnData = recurringDates.map(date => {
            const tempDate = new Date(date);
            return {
                name: transaction.name,
                amount: transaction.amount,
                transactionId: transaction.id,
                type: transaction.type,
                dueOn: `${tempDate.getMonth() + 1}-${tempDate.getDate()}-${tempDate.getFullYear()}`,
                isSettled: false
            };
        });
        return returnData;
    }

    recurringDates(startDateValue: number, endDateVale: number, interval: number, _intervalType: string, noweekends: boolean) {
        const intervalType = _intervalType || 'Date';
        const date: any = new Date(startDateValue);
        date.setHours(0, 0, 0, 0);
        const endDate = new Date(endDateVale);
        endDate.setHours(23, 59, 59, 999);
        const recurrent = [];
        const setGet = {set: 'set' + intervalType, get: 'get' + intervalType};

        // add 1 day for sunday, subtract one for saturday
        const noWeekend = () => {
            const currentDate = new Date(date), day = date.getDay();
            // tslint:disable-next-line:no-bitwise
            if (~[6, 0].indexOf(day)) {
                currentDate.setDate(currentDate.getDate() + (day === 6 ? -1 : 1));
            }
            return new Date(currentDate);
        };

        while (date < endDate) {
            recurrent.push(noweekends ? noWeekend() : new Date(date));
            date[setGet.set](date[setGet.get]() + interval);
        }
        return recurrent;
    }

    async setMonthType(monthType: MonthTypeEnum) {
        this.selectedMonthType = monthType;
        this.selectedMonthTypeAction.next(monthType);
    }

    async addCategory(value: any, form: NgForm, categoryName: HTMLInputElement, uid) {
        const busyIndicatorId = this.busyIndicator.show();
        const sample = await this.categoriesCollection.add({uid, ...value, type: this.selectedMonthType});
        form.resetForm();
        this.busyIndicator.hide(busyIndicatorId);
    }

    async updateCategory(form: NgForm, name) {
        const isConfirmed = confirm('Are you sure! Do you want to update ' + this.selectedMonthType.toUpperCase() + ' Category');
        if (isConfirmed) {
            const busyIndicatorId = this.busyIndicator.show();
            const docId = this.categoryToEdit.id;
            delete this.categoryToEdit.id;
            const sample = await this.categoriesCollection.doc(docId).update({...this.categoryToEdit, name});
            this.categoryToEdit = null;
            form.resetForm();
            this.busyIndicator.hide(busyIndicatorId);
        }
    }

    async deleteTransaction(id) {
        const isConfirmed = confirm('Are you sure! Do you want to delete ' + this.selectedMonthType.toUpperCase() + ' Category');
        if (isConfirmed) {
            const busyIndicatorId = this.busyIndicator.show();
            const deletedRecord = await this.categoriesCollection.doc(id).delete();
            this.busyIndicator.hide(busyIndicatorId);
        }
    }
}
