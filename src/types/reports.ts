import type { Transaction } from "./transactions";

export type AnuualReports = {
    final_balance: string,
    month: string,
    income: string,
    outcome: string
}

type MonthReportSubtype = {
    total: string;
    type: 'INCOME' | 'OUTCOME';
    subtype: string;
    percentage: string;
};
  
export type MonthReport = {
    final_balance: string;
    total_income: string;
    total_outcome: string;
    subtypes: MonthReportSubtype[];
    transactions: Transaction[]
  };