import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {FireBaseTableService} from './services/fire-base-table.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        MatProgressSpinnerModule,
    ],
    declarations: [],
    exports: [
        CommonModule,
        FormsModule,
        AngularFireModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        MatProgressSpinnerModule,
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                FireBaseTableService
            ]
        };
    }
}
