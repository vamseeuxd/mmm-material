import {Injectable} from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {QueryFn} from '@angular/fire/firestore/interfaces';

@Injectable({providedIn: 'root'})
export class FireBaseTableService {
    constructor(private afs: AngularFirestore) {
    }

    public getTable(tableName, queryFn?: QueryFn) {
        const itemsCollection = this.afs.collection<any>(tableName, queryFn);
        const data = itemsCollection.snapshotChanges().pipe(
            map(actions =>
                actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                })
            )
        );
        const insert = (item) => {
            return itemsCollection.add(item);
        };

        const remove = (id) => {
            return itemsCollection.doc(id).delete();
        };

        const getDocById = (id) => {
            return itemsCollection.doc(id);
        };

        const update = (id, item) => {
            delete item.id;
            return itemsCollection.doc(id).set(item);
        };
        const returnObject = {
            data,
            insert,
            remove,
            update,
            getDocById,
        };
        return returnObject;
    }
}
