import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {BusyIndicatorService} from '../../utils/busy-indicator.service';
import {BehaviorSubject, Observable} from 'rxjs';

export interface TransactionType {
    id: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class TransactionTypeService {

    private selectedTypeAction: BehaviorSubject<string> = new BehaviorSubject<string>('income');
    public selectedType$ = this.selectedTypeAction.asObservable();

    private selectedTypeActionForList: BehaviorSubject<string> = new BehaviorSubject<string>('income');
    public selectedTypeForList$ = this.selectedTypeActionForList.asObservable();

    private typesCollection: AngularFirestoreCollection<TransactionType> = this.afs.collection<TransactionType>('types', ref => ref.orderBy('name'));
    public types$: Observable<TransactionType[]> = this.typesCollection.valueChanges();

    constructor(
        private afs: AngularFirestore,
        private auth: AngularFireAuth,
        private busyIndicator: BusyIndicatorService,
    ) {
    }

    setSelectedType(type: string) {
        this.selectedTypeAction.next(type);
    }

    setSelectedTypeForList(type: string) {
        this.selectedTypeActionForList.next(type);
    }
}

