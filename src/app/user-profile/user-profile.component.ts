import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

    constructor(public auth: AngularFireAuth) {
    }

    async login() {
        await this.auth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }

    async logout() {
        const isConfirmed = confirm('Are you sure! Do you want to logout?');
        if (isConfirmed) {
            await this.auth.auth.signOut();
        }
    }

}
