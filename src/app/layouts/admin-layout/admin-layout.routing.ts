import {Routes} from '@angular/router';

import {DashboardComponent} from '../../old/dashboard/dashboard.component';
import {UserProfileComponent} from '../../mmm/user-profile/user-profile.component';
import {TypographyComponent} from '../../old/typography/typography.component';
import {IconsComponent} from '../../old/icons/icons.component';
import {MapsComponent} from '../../old/maps/maps.component';
import {NotificationsComponent} from '../../old/notifications/notifications.component';
import {UpgradeComponent} from '../../old/upgrade/upgrade.component';
import {TransactionListComponent} from '../../old/transaction-list/transaction-list.component';
import {ManageCategoriesComponent} from '../../old/manage-categories/manage-categories.component';
import {MonthlyIncomeListComponent} from '../../old/monthly-income-list/monthly-income-list.component';
import {DatabaseTestingComponent} from '../../old/database-testing/database-testing.component';
import {CategoriesComponent} from '../../mmm/categories/categories.component';
import {DefaultOptionsComponent} from '../../mmm/default-options/default-options.component';
import {RepeatOptionsComponent} from '../../mmm/repeat-options/repeat-options.component';
import {SettledTransactionsComponent} from '../../mmm/settled-transactions/settled-transactions.component';
import {TaxExemptionsComponent} from '../../mmm/tax-exemptions/tax-exemptions.component';
import {TransactionsComponent} from '../../mmm/transactions/transactions.component';
import {TypesComponent} from '../../mmm/types/types.component';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['user-profile']);
export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    // { path: 'dashboard',        component: DashboardComponent },
    // { path: 'manage-categories',       component: ManageCategoriesComponent },
    // { path: 'monthly-income-list',       component: MonthlyIncomeListComponent },
    // { path: 'typography',       component: TypographyComponent },
    // { path: 'icons',            component: IconsComponent },
    // { path: 'maps',             component: MapsComponent },
    { path: 'notifications',    component: NotificationsComponent },
    // { path: 'upgrade',          component: UpgradeComponent },
    // { path: 'transaction-list', component: TransactionListComponent },
    // { path: 'database-testing', component: DatabaseTestingComponent },
    {
        path: '',
        redirectTo: 'types',
        pathMatch: 'full',
    },
    {path: 'categories', component: CategoriesComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}},
    {path: 'default-options', component: DefaultOptionsComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}},
    {path: 'repeat-options', component: RepeatOptionsComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}},
    {path: 'settled-transactions', component: SettledTransactionsComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}},
    {path: 'tax-exemptions', component: TaxExemptionsComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}},
    {path: 'transactions', component: TransactionsComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}},
    {path: 'types', component: TypesComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}},
    {path: 'user-profile', component: UserProfileComponent},
];
