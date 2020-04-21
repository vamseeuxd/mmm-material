import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {FireBaseTableService} from './old/services/fire-base-table.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {AlertServiceComponent} from './utils/alert-service';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {AngularFireAuthGuardModule} from '@angular/fire/auth-guard';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthGuardModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatCardModule,
    ],
    declarations: [
        AlertServiceComponent,
    ],
    exports: [
        CommonModule,
        FormsModule,
        AngularFireModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        MatProgressSpinnerModule,
        AlertServiceComponent,
        MatButtonModule,
        MatTabsModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatCardModule,
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
