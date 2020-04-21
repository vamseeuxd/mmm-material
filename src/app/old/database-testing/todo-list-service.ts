import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {BusyIndicatorService} from '../../utils/busy-indicator.service';
import * as firebase from 'firebase';
import {Observable, Subscription} from 'rxjs';


export interface TodoItem {
    name: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    remarks: string;
    type: string;
    category: string;
    taxExemptions: string;
    repeat: string;
    interval: number;
}

@Injectable({providedIn: 'root'})
export class TodoListService {

    private toDosCollection: AngularFirestoreCollection<TodoItem> = this.afs.collection<TodoItem>('todos', ref => ref.orderBy('createdOn'));
    public toDos$: Observable<TodoItem[]> = this.toDosCollection.valueChanges();
    private subscriptionList: Subscription[] = [];

    constructor(
        private afs: AngularFirestore,
        private auth: AngularFireAuth,
        private busyIndicator: BusyIndicatorService,
    ) {

    }

    async addTodo(data: { name: string }) {
        return new Promise(
            async function(resolve, reject) {
                if (data.name.trim().length > 2) {
                    const busyIndicatorId = this.busyIndicator.show();
                    const res = await this.toDosCollection.add({
                        name: data.name.trim(),
                        createdOn: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    const docRef = await this.toDosCollection.doc(res.id);
                    const doc = await docRef.get().toPromise();
                    await docRef.set({...doc.data(), id: res.id});
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
                await this.toDosCollection.doc(id).delete();
                this.busyIndicator.hide(busyIndicatorId);
                resolve(id);
            }.bind(this)
        );

    }

    updateTodo() {
    }
}
