export interface CreateLogDto {
  cashierId: number;
  totalAmount: number;
  totalDeposit: number;
  tickets: {
    id: string; // UUID of ticket type
    quantity: number;
    payed_in_cash: boolean; // frontend küldi így
  }[];
}
