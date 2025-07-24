import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateLogDto } from './dto/create-log.dto';
import { Logs, TicketLogs } from '../db/schema/log';
import { eq } from 'drizzle-orm';
import { Tickets } from '../db/schema/tickets';

@Injectable()
export class PurchaseService {
  constructor(private readonly dbService: DbService) {}

  async create(dto: CreateLogDto) {
    // Szétválasztás készpénzre és kártyára
    const grouped = {
      cash: dto.tickets.filter((t) => t.payed_in_cash),
      card: dto.tickets.filter((t) => !t.payed_in_cash),
    };

    const createLogWithTickets = async (
      tickets: typeof dto.tickets,
      isCash: boolean,
    ) => {
      if (tickets.length === 0) return;

      const logResult = await this.dbService.db
        .insert(Logs)
        .values({
          cashierId: dto.cashierId,
          totalAmount: dto.totalAmount,
          totalDeposit: dto.totalDeposit,
        })
        .returning({ id: Logs.id });

      const logId = logResult[0].id;

      // Minden jegyet hozzáadunk a loghoz
      const ticketLogs = tickets.map((t) => ({
        logId,
        ticketTypeId: t.id,
        quantity: t.quantity,
        paidInCash: isCash, // 💡 Itt már nem t.payed_in_cash, hanem a group alapján
      }));

      await this.dbService.db.insert(TicketLogs).values(ticketLogs);
    };

    // Két külön log rekord, ha szükséges
    await createLogWithTickets(grouped.cash, true);
    await createLogWithTickets(grouped.card, false);

    return { success: true };
  }

  async getAll(kassza: number) {
    const results = await this.dbService.db
      .select({
        date: Logs.date,
        quantity: TicketLogs.quantity,
        paidInCash: TicketLogs.paidInCash,
        ticketName: Tickets.name,
        weekday_price: Tickets.weekday_price,
        weekend_price: Tickets.weekend_price,
      })
      .from(Logs)
      .innerJoin(TicketLogs, eq(Logs.id, TicketLogs.logId))
      .innerJoin(Tickets, eq(Tickets.id, TicketLogs.ticketTypeId))
      .where(eq(Logs.cashierId, kassza));

    const grouped = new Map<
      string,
      {
        amount_kp: number;
        list_kp_ticket_names: Record<string, number>;
        amount_card: number;
        list_card_ticket_names: Record<string, number>;
      }
    >();

    for (const row of results) {
      if (!row.date) continue;

      const day = row.date.toISOString().split('T')[0];
      const jsDate = new Date(row.date);
      const isWeekend = jsDate.getDay() === 0 || jsDate.getDay() === 6;

      const price = isWeekend ? row.weekend_price : row.weekday_price;
      const totalForThisLine = row.quantity * price;
      const name = row.ticketName;

      if (!grouped.has(day)) {
        grouped.set(day, {
          amount_kp: 0,
          list_kp_ticket_names: {},
          amount_card: 0,
          list_card_ticket_names: {},
        });
      }

      const entry = grouped.get(day)!;

      if (row.paidInCash) {
        entry.amount_kp += totalForThisLine;
        entry.list_kp_ticket_names[name] =
          (entry.list_kp_ticket_names[name] || 0) + row.quantity;
      } else {
        entry.amount_card += totalForThisLine;
        entry.list_card_ticket_names[name] =
          (entry.list_card_ticket_names[name] || 0) + row.quantity;
      }
    }

    const day = Array.from(grouped.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    return { day };
  }

  findAll() {
    return 'This action returns all purchases';
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`;
  }

  update(id: number, updatePurchaseDto: any) {
    return `This action updates a #${id} purchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}
