import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {BusyIndicatorService} from '../../utils/busy-indicator.service';
import {switchMap} from 'rxjs/operators';
import {TransactionTypeService} from '../types/transaction-type.service';

export interface TransactionCategory {
    id: string;
    name: string;
    type: string;
    uid: string;
}

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    private categoriesCollection: AngularFirestoreCollection<TransactionCategory> = this.afs.collection<TransactionCategory>('categories', ref => ref.orderBy('name'));
    public categories$: Observable<TransactionCategory[]> = combineLatest(this.transactionTypeService.selectedType$, this.categoriesCollection.valueChanges()).pipe(
        switchMap(
            ([type, categories]) => {
                return of(categories.filter(d => d.type === type));
            }
        )
    );

    constructor(
        private afs: AngularFirestore,
        private auth: AngularFireAuth,
        private transactionTypeService: TransactionTypeService,
        private busyIndicator: BusyIndicatorService,
    ) {
    }
}
