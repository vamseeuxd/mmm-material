import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, switchMap} from 'rxjs/operators';
import {TransactionType} from '../value-objects/transaction-type-enum';
import {BehaviorSubject, combineLatest, of} from 'rxjs';
import {NgForm} from '@angular/forms';
import {BusyIndicatorService} from '../services/busy-indicator.service';
import {ITransaction} from '../value-objects/transaction-interface';

@Component({
    selector: 'app-table-list',
    templateUrl: './manage-categories.component.html',
    styleUrls: ['./manage-categories.component.css']
})
export class ManageCategoriesComponent implements OnInit {
    readonly TRANSACTION_TYPE = TransactionType;
    transactionType: TransactionType = TransactionType.INCOME;
    transactionTypeAction: BehaviorSubject<TransactionType> = new BehaviorSubject<TransactionType>(TransactionType.INCOME);
    transactionType$ = this.transactionTypeAction.asObservable();
    categoriesCollection = this.afs.collection<any>('categories');
    categories$ = combineLatest(this.auth.user, this.transactionType$).pipe(switchMap(
        ([userDetails, transactionType]) => {
            if (userDetails && userDetails.providerData && userDetails.providerData.length > 0) {
                return this.afs.collection<any>(
                    'categories',
                    ref => ref.where('type', '==', transactionType).where('uid', 'in', ['mmm', userDetails.providerData[0].uid])
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
    categoryToEdit;

    constructor(
        private afs: AngularFirestore,
        public auth: AngularFireAuth,
        public busyIndicator: BusyIndicatorService,
    ) {
    }

    ngOnInit() {
    }

    async setTransactionType(transactionType: TransactionType) {
        this.transactionType = transactionType;
        this.transactionTypeAction.next(transactionType);
    }

    async addCategory(value: any, form: NgForm, categoryName: HTMLInputElement, uid) {
        const busyIndicatorId = this.busyIndicator.show();
        const sample = await this.categoriesCollection.add({uid, ...value, type: this.transactionType});
        form.resetForm();
        this.busyIndicator.hide(busyIndicatorId);
    }

    async updateCategory(form: NgForm, name) {
        const isConfirmed = confirm('Are you sure! Do you want to update ' + this.transactionType.toUpperCase() + ' Category');
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
        const isConfirmed = confirm('Are you sure! Do you want to delete ' + this.transactionType.toUpperCase() + ' Category');
        if (isConfirmed) {
            const busyIndicatorId = this.busyIndicator.show();
            const deletedRecord = await this.categoriesCollection.doc(id).delete();
            this.busyIndicator.hide(busyIndicatorId);
        }
    }
}
