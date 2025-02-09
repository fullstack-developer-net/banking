export interface TransactionModel {
  transactionId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  status: string;
  transactionTime: Date;
  note?: string;
}
