import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettledTransactionsComponent} from './settled-transactions/settled-transactions.component';
import {TaxExemptionsComponent} from './tax-exemptions/tax-exemptions.component';
import {RepeatOptionsComponent} from './repeat-options/repeat-options.component';
import {DefaultOptionsComponent} from './default-options/default-options.component';
import {CategoriesComponent} from './categories/categories.component';
import {TypesComponent} from './types/types.component';
import {ManageTransactionsComponent, TransactionsComponent} from './transactions/transactions.component';
import {SharedModule} from '../shared.module';


@NgModule({
    declarations: [
        CategoriesComponent,
        DefaultOptionsComponent,
        RepeatOptionsComponent,
        SettledTransactionsComponent,
        TaxExemptionsComponent,
        TransactionsComponent,
        ManageTransactionsComponent,
        TypesComponent,
    ],
    exports: [
        SettledTransactionsComponent,
        TaxExemptionsComponent,
        RepeatOptionsComponent,
        DefaultOptionsComponent,
        CategoriesComponent,
        TypesComponent,
        TransactionsComponent,
        ManageTransactionsComponent,
    ],
    entryComponents: [
        SettledTransactionsComponent,
        TaxExemptionsComponent,
        RepeatOptionsComponent,
        DefaultOptionsComponent,
        CategoriesComponent,
        TypesComponent,
        TransactionsComponent,
        ManageTransactionsComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ]
})
export class MmmModule {
}
