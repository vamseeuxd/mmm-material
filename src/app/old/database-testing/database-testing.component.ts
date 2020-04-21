import {Component, OnDestroy, OnInit} from '@angular/core';
import {TodoListService} from './todo-list-service';
import {AlertService} from '../../utils/alert-service';
import * as Moment from 'moment';
import {extendMoment} from 'moment-range';
import {AngularFirestore} from '@angular/fire/firestore';

const moment = extendMoment(Moment);

@Component({
    selector: 'app-table-list',
    templateUrl: './database-testing.component.html',
    styleUrls: ['./database-testing.component.css']
})
export class DatabaseTestingComponent implements OnInit, OnDestroy {


    openToDo = '';
    editToDo = '';
    types$ = this.afs.collection('types').valueChanges();
    categories$ = this.afs.collection('categories').valueChanges();
    repeatOptions$ = this.afs.collection('repeat-options').valueChanges();
    taxExemptions$ = this.afs.collection('tax-exemptions').valueChanges();

    constructor(
        private afs: AngularFirestore,
        private todoList: TodoListService,
        private alert: AlertService
    ) {
        /*const start = new Date(2020, 3, 1);
        const end = new Date(2020, 3, 14);
        const range = moment.range(start, end);
        console.log(this.enumerateDaysBetweenDates(start, end));*/
    }

    enumerateDaysBetweenDates(startDate, endDate) {
        var dates = [];

        var currDate = moment(startDate).subtract(1, 'day').startOf('day');
        var lastDate = moment(endDate).add(1, 'days').startOf('day');

        while (currDate.add(1, 'days').diff(lastDate) < 0) {
            dates.push(currDate.clone().toDate());
        }

        return dates;
    };

    ngOnDestroy(): void {
        // this.subscriptionList.forEach(value => value.unsubscribe());
    }

    ngOnInit(): void {
    }

    async addTodo(toDoTxtInput: HTMLInputElement) {
        setTimeout(async () => {
            window.focus();
            try {
                const res = await this.todoList.addTodo({name: toDoTxtInput.value.trim()});
                toDoTxtInput.value = '';
                toDoTxtInput.focus();
            } catch (e) {
                await this.alert.show('Invalid Input', 'Minimum 3 charters are required for Todo Name!');
                toDoTxtInput.focus();
                console.log(e);
            }
        }, 1000);
    }

    async deleteTodo(id: string) {
        try {
            await this.alert.confirm('Delete Confirmation', 'Are you sure! Do you want to delete todo?', 'Yes', 'No');
            try {
                const res = this.todoList.deleteTodo(id);
            } catch (e) {
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async updateTodo() {
        alert('start');
        /*await this.addCat('AP3zVWsvPp19APo53DH1');*/
        alert('End');
    }

    async addCat(id) {
        // repeat-options
        const docRef = await this.afs.collection('tax-exemptions').doc(id);
        const doc = await docRef.get().toPromise();
        await docRef.set({...doc.data(), id: id});
    }

    getDateFromString(date: string): Date {
        return new Date(date);
    }
}
/*
{
    "name": "Test 1",
    "amount": 2000,
    "type": "income",
    "repeat": "never"
}
*/
