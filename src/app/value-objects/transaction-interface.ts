import {TransactionType} from './transaction-type-enum';

export interface ITransaction {
    id?: string;
    type: TransactionType;
    name: string;
    amount: number;
    uid?: string;
    category?: string;
    interval?: number;
    repeat?: string;
    startDate?: string;
    endDate?: string;
    exemptions?: string;
    remarks?: string;
}
