export class CreateTicketDto {
  readonly name: string;
  readonly weekend_price: number;
  readonly weekday_price: number;
  readonly deposit: number;
  readonly importance: number;
  readonly rental_id: string;
}
