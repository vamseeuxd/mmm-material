import {Component, Inject, Injectable} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as firebase from 'firebase';

export interface DialogData {
    title: string;
    message: string;
    okLabel: string;
    cancelLabel: string;
}

@Injectable({providedIn: 'root'})
export class AlertService {

    constructor(private dialog: MatDialog) {
    }

    show(title: string, message: string, width = '350px', okLabel = 'Ok', disableClose = false) {
        return new Promise(
            async function(resolve, reject) {
                const dialogRef = this.dialog.open(AlertServiceComponent, {
                    width: width,
                    disableClose,
                    data: {
                        title,
                        message,
                        okLabel,
                        cancelLabel: null
                    }
                });

                dialogRef.afterClosed().subscribe(result => {
                    console.log('The dialog was closed', result);
                    if (result) {
                        resolve(result);
                    }
                    else {
                        reject();
                    }
                });
            }.bind(this)
        );
    }

    confirm(title: string, message: string, okLabel = 'Ok', cancelLabel = 'Cancel', disableClose = true, width = '350px') {
        return new Promise(
            async function(resolve, reject) {
                const dialogRef = this.dialog.open(AlertServiceComponent, {
                    width: width,
                    disableClose,
                    data: {
                        title,
                        message,
                        okLabel,
                        cancelLabel
                    }
                });

                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        resolve(result);
                    }
                    else {
                        reject();
                    }
                });
            }.bind(this)
        );
    }

}

@Component({
    selector: 'alert-service-component',
    template: `
        <h1 mat-dialog-title
            *ngIf="data.title">{{data.title}}</h1>
        <div mat-dialog-content>
            {{data.message}}
        </div>
        <div mat-dialog-actions>
            <div class="text-right w-100">
                <button class="btn btn-dark"
                        *ngIf="data.cancelLabel"
                        (click)="onNoClick()">{{data.cancelLabel}}</button>
                <button class="btn btn-primary"
                        *ngIf="data.okLabel"
                        [mat-dialog-close]="data"
                        cdkFocusInitial>{{data.okLabel}}</button>
            </div>
        </div>
    `
})
export class AlertServiceComponent {

    constructor(
        public dialogRef: MatDialogRef<AlertServiceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
