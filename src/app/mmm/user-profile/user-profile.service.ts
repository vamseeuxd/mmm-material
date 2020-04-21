import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {BusyIndicatorService} from '../../utils/busy-indicator.service';
import {auth, User} from 'firebase';
import {AlertService} from '../../utils/alert-service';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UserProfileService {

    user$ = this.auth.user;
    user: User;

    constructor(
        private afs: AngularFirestore,
        private auth: AngularFireAuth,
        private alert: AlertService,
        private route: Router,
        private busyIndicator: BusyIndicatorService,
    ) {
        this.user$.subscribe(value => {
            if (value) {
                this.user = value;
            }
        });
    }

    async login() {
        await this.auth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }

    async logout() {
        try {
            await this.alert.confirm('Logout Confirmation', 'Are you sure! Do you want to logout?', 'Yes', 'No');
            try {
                await this.auth.auth.signOut();
            } catch (e) {
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    }
}

