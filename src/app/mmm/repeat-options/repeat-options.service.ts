import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {BusyIndicatorService} from '../../utils/busy-indicator.service';
import {switchMap, tap} from 'rxjs/operators';

export interface RepeatOption {
    'api-id': string;
    'adjustInterval': number;
    'name': string;
    'noOfIntervals': number;
    'id': string;
}

@Injectable({
    providedIn: 'root'
})
export class RepeatOptionsService {

    private selectedRepeatOptionAction: BehaviorSubject<string> = new BehaviorSubject<string>('never');
    public selectedRepeatOption$ = this.selectedRepeatOptionAction.asObservable();

    private repeatOptionsCollection: AngularFirestoreCollection<RepeatOption> = this.afs.collection<RepeatOption>('repeat-options', ref => ref.orderBy('name'));
    public repeatOptions$: Observable<RepeatOption[]> = this.repeatOptionsCollection.valueChanges();

    public intervalOptions$: Observable<number[]> = combineLatest(this.selectedRepeatOption$, this.repeatOptions$).pipe(
        switchMap(
            ([repeatOption, repeatOptions]) => {
                let selectedRepeatOption;
                repeatOptions.forEach(value => {
                    if (value.id === repeatOption) {
                        selectedRepeatOption = value;
                    }
                });
                return of(Array.from({length: selectedRepeatOption.noOfIntervals}, (v, i) => (i + 1)));
            }
        )
    );

    constructor(
        private afs: AngularFirestore,
        private auth: AngularFireAuth,
        private busyIndicator: BusyIndicatorService,
    ) {
    }

    setSelectedRepeatOption(type: string) {
        this.selectedRepeatOptionAction.next(type);
    }
}
