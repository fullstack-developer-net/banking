export interface TransactionModel {
  transactionId: string;
  fromAccountId?: string;
  toAccountId: string;
  amount: number;
  status?: string;
  transactionTime?: Date;
  note?: string;
}
export interface TransferModel {
  toAccountId: number;
  amount: number;
  note?: string;
}
 