import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {DashboardComponent} from '../../old/dashboard/dashboard.component';
import {UserProfileComponent} from '../../mmm/user-profile/user-profile.component';
import {TypographyComponent} from '../../old/typography/typography.component';
import {IconsComponent} from '../../old/icons/icons.component';
import {MapsComponent} from '../../old/maps/maps.component';
import {NotificationsComponent} from '../../old/notifications/notifications.component';
import {UpgradeComponent} from '../../old/upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {TransactionListComponent} from '../../old/transaction-list/transaction-list.component';
import {AdvancedTransactionFormComponent} from '../../old/advanced-transaction-form/advanced-transaction-form.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {SharedModule} from '../../shared.module';
import {ManageCategoriesComponent} from '../../old/manage-categories/manage-categories.component';
import {MonthlyIncomeListComponent} from '../../old/monthly-income-list/monthly-income-list.component';
import {DatabaseTestingComponent} from '../../old/database-testing/database-testing.component';
import {MmmModule} from '../../mmm/mmm.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SharedModule,
        MmmModule
    ],
    declarations: [
        DashboardComponent,
        TransactionListComponent,
        AdvancedTransactionFormComponent,
        UserProfileComponent,
        ManageCategoriesComponent,
        MonthlyIncomeListComponent,
        TypographyComponent,
        IconsComponent,
        MapsComponent,
        NotificationsComponent,
        DatabaseTestingComponent,
        UpgradeComponent,
    ],
    providers: [ ]
})

export class AdminLayoutModule {
}
