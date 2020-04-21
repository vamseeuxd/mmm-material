import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {BusyIndicatorService} from '../../utils/busy-indicator.service';
import {Transaction} from '../transactions/transactions.service';

@Injectable({
    providedIn: 'root'
})
export class DefaultOptionsService {

    private transactionOptionsCollection: AngularFirestoreDocument<Transaction> = this.afs.doc<Transaction>('defaultOptions/transactions');
    public transactionOptions$: Observable<Transaction> = this.transactionOptionsCollection.valueChanges();

    constructor(
        private afs: AngularFirestore,
        private auth: AngularFireAuth,
        private busyIndicator: BusyIndicatorService,
    ) {

    }
}
