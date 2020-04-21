import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {BusyIndicatorService} from '../../utils/busy-indicator.service';
import * as firebase from 'firebase';
import {UserProfileService} from '../user-profile/user-profile.service';
import {NotificationService} from '../../utils/notification.service';
import {TransactionTypeService} from '../types/transaction-type.service';
import {switchMap, tap} from 'rxjs/operators';
import * as Moment from 'moment';
import {extendMoment} from 'moment-range';

const moment = extendMoment(Moment);

@Injectable({
    providedIn: 'any'
})
export class TransactionsService {
    public readonly DEFAULT_TRANSACTION_PATH = 'defaultOptions/transactions';
    private defaultTransactionPathAction: BehaviorSubject<string> = new BehaviorSubject<string>('defaultOptions/transactions');
    private defaultTransactionPath$ = this.defaultTransactionPathAction.asObservable();
    defaultTransaction$ = this.defaultTransactionPath$.pipe(
        switchMap(
            (defaultTransactionPath) => {
                return this.afs.doc<Transaction>(defaultTransactionPath).valueChanges();
            }
        )
    );

    private transactionCollection: AngularFirestoreCollection<Transaction> = this.afs.collection<Transaction>('transaction', ref => ref.orderBy('createdOn'));
    public transactions$: Observable<Transaction[]> = combineLatest(
        this.transactionTypeService.selectedTypeForList$,
        this.userProfileService.user$
    ).pipe(
        switchMap(
            ([type, user]) => {
                if (user) {
                    return this.afs.collection<Transaction>('transaction', ref => {
                        let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                        if (type) {
                            query = query.where('type', '==', type);
                        }
                        if (user) {
                            query = query.where('uid', '==', user.providerData[0].uid);
                        }
                        return query;
                    }).valueChanges();
                }
                else {
                    return of([]);
                }
            }
        ),
        switchMap(
            x => {
                return of(
                    x.map(value => {
                        return {
                            ...value,
                            breakups: this.enumerateDaysBetweenDates(
                                value.startDate ? value.startDate.seconds * 1000 : new Date().getTime() / 1000,
                                value.endDate ? value.endDate.seconds * 1000 : new Date().getTime() / 1000,
                                value.repeat,
                                value.interval ? value.interval : 1
                            )
                        };
                    })
                );
            }
        )
    );

    constructor(
        private afs: AngularFirestore,
        private auth: AngularFireAuth,
        private userProfileService: UserProfileService,
        private notificationService: NotificationService,
        private transactionTypeService: TransactionTypeService,
        private busyIndicator: BusyIndicatorService,
    ) {

    }

    enumerateDaysBetweenDates(startDate, endDate, repeat, interval) {
        const dates = [];
        let currDate;
        let lastDate;
        switch (repeat) {
            case 'day':
                currDate = moment(startDate).subtract(interval, repeat).startOf('day');
                lastDate = moment(endDate).add(interval, 'days').startOf('day').subtract(interval - 1, 'day');
                while (currDate.add(interval, 'days').diff(lastDate) < 0) {
                    dates.push(currDate.clone().toDate());
                }
                break;
            case 'month':
                currDate = moment(startDate).subtract(interval, repeat).startOf('month');
                lastDate = moment(endDate).add(interval, 'months').startOf('month').subtract(interval - 1, 'month');
                while (currDate.add(interval, 'months').diff(lastDate) < 0) {
                    dates.push(currDate.clone().toDate());
                }
                break;
            case 'never':
                dates.push(new Date());
                break;
            case 'week':
                currDate = moment(startDate).subtract(interval, repeat).startOf('week');
                lastDate = moment(endDate).add(interval, 'weeks').startOf('week').subtract(interval - 1, 'week');
                while (currDate.add(interval, 'weeks').diff(lastDate) < 0) {
                    dates.push(currDate.clone().toDate());
                }
                break;
            case 'year':
                currDate = moment(startDate).subtract(interval, repeat).startOf('year');
                lastDate = moment(endDate).add(interval, 'years').startOf('year').subtract(interval - 1, 'year');
                while (currDate.add(interval, 'years').diff(lastDate) < 0) {
                    dates.push(currDate.clone().toDate());
                }
                break;
        }
        return dates;
    };

    setDefaultTransactionPath(value: string) {
        this.defaultTransactionPathAction.next(value);
    }

    async updateTransaction(data: Transaction, transactionId: string) {
        return new Promise(
            async function(resolve, reject) {
                if (data.name.trim().length > 2) {
                    const busyIndicatorId = this.busyIndicator.show();
                    data.id = transactionId;
                    data.uid = this.userProfileService.user.providerData[0].uid;
                    data.lastUpdatedOn = firebase.firestore.FieldValue.serverTimestamp();
                    const doc = await this.afs.doc('transaction/' + transactionId).set(data);
                    this.notificationService.show(`${data.type} updated successfully.`);
                    this.busyIndicator.hide(busyIndicatorId);
                    resolve(data.id);
                }
                reject('Invalid Data');
            }.bind(this)
        );
    }

    async addTransaction(data: Transaction) {
        return new Promise(
            async function(resolve, reject) {
                if (data.name.trim().length > 2) {
                    const busyIndicatorId = this.busyIndicator.show();
                    const res = await this.transactionCollection.add({
                        ...data,
                        uid: this.userProfileService.user.providerData[0].uid,
                        createdOn: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    const docRef = await this.transactionCollection.doc(res.id);
                    const doc = await docRef.get().toPromise();
                    await docRef.set({...doc.data(), id: res.id});
                    this.notificationService.show(`${data.type} added successfully.`);
                    this.busyIndicator.hide(busyIndicatorId);
                    resolve(res.id);
                }
                reject('Invalid Data');
            }.bind(this)
        );
    }

    async deleteTodo(id: string) {
        return new Promise(
            async function(resolve, reject) {
                const busyIndicatorId = this.busyIndicator.show();
                await this.transactionCollection.doc(id).delete();
                this.busyIndicator.hide(busyIndicatorId);
                resolve(id);
            }.bind(this)
        );

    }
}

export interface MmmDate {
    seconds: number;
    nanoseconds: number;
}

export interface Transaction {
    repeat: string;
    startDate: MmmDate;
    name: string;
    interval: number;
    amount: number;
    exemptions: string;
    type: string;
    category: string;
    lastUpdatedOn?: any;
    breakups?: any[];
    remarks: string;
    uid: string;
    id?: string;
    endDate: MmmDate;
}
