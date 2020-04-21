import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {BusyIndicatorService} from '../../utils/busy-indicator.service';

export interface TaxExemption {
    id: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class TaxExemptionsService {

    private taxExemptionsCollection: AngularFirestoreCollection<TaxExemption> = this.afs.collection<TaxExemption>('tax-exemptions', ref => ref.orderBy('name'));
    public taxExemptions$: Observable<TaxExemption[]> = this.taxExemptionsCollection.valueChanges();

    constructor(
        private afs: AngularFirestore,
        private auth: AngularFireAuth,
        private busyIndicator: BusyIndicatorService,
    ) {
    }
}
