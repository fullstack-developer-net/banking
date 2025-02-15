export interface TransactionModel {
  transactionId: string;
  fromAccountId?: number;
  toAccountId: number;
  fromAccount?: AccountDto;
  toAccount?: AccountDto;
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

export interface AccountDto {
  accountId?: number;
  balance?: number;
  accountNumber?: string;
  userId?: string;
  fullName?: string;
  email?: string;
  isActive?: boolean;
  password?: string;
}