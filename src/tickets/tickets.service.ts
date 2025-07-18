import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import BaseResponse from '../response';
import { DbService } from '../db/db.service';
import { Tickets } from '../db/schema/tickets';
import { eq } from 'drizzle-orm';

@Injectable()
export class TicketsService {
  constructor(private readonly dbService: DbService) {}

  async ticketExists(name: string): Promise<BaseResponse> {
    const ticket = await this.dbService.db
      .select()
      .from(Tickets)
      .where(eq(Tickets.name, name))
      .execute();
    return BaseResponse.from({
      status: ticket.length > 0 ? 800 : 200,
      message:
        ticket.length > 0 ? 'Ticket already exists' : 'Ticket does not exist',
      data: ticket.length > 0 ? [ticket[0]] : [],
    });
  }

  async create(createTicketDto: CreateTicketDto) {
    const inDB = await this.ticketExists(createTicketDto.name);
    if (inDB.data.length > 0) {
      return BaseResponse.from({
        status: 800,
        message: inDB.message,
        data: inDB.data,
      });
    }
    const ticket = await this.dbService.db
      .insert(Tickets)
      .values({
        name: createTicketDto.name,
        weekend_price: createTicketDto.weekend_price,
        weekday_price: createTicketDto.weekday_price,
        deposit: createTicketDto.deposit,
        rental_id: createTicketDto.rental_id,
      })
      .returning()
      .execute();
    return BaseResponse.from({
      status: 200,
      message: 'Ticket created successfully',
      data: ticket,
    });
  }

  async findAll(): Promise<BaseResponse> {
    return BaseResponse.from({
      status: 200,
      message: 'Tickets retrieved successfully',
      data: await this.dbService.db.select().from(Tickets).execute(),
    });
  }

  async findOne(id: string): Promise<BaseResponse> {
    const ticket = await this.dbService.db
      .select()
      .from(Tickets)
      .where(eq(Tickets.id, id))
      .execute();
    return BaseResponse.from({
      status: ticket.length > 0 ? 200 : 404,
      message: ticket.length > 0 ? 'Ticket found' : 'Ticket not found',
      data: ticket,
    });
  }

  async update(
    id: string,
    updateTicketDto: UpdateTicketDto,
  ): Promise<BaseResponse> {
    const ticket = await this.dbService.db
      .select()
      .from(Tickets)
      .where(eq(Tickets.id, id));
    if (ticket.length === 0) {
      return BaseResponse.from({
        status: 800,
        message: 'Ticket not found',
        data: [],
      });
    }
    if (updateTicketDto.name && updateTicketDto.name !== ticket[0].name) {
      const inDB = await this.ticketExists(updateTicketDto.name);
      if (inDB.data.length > 0) {
        return BaseResponse.from({
          status: 800,
          message: inDB.message,
          data: inDB.data,
        });
      }
      ticket[0].name = updateTicketDto.name;
    }
    if (updateTicketDto.weekend_price) {
      ticket[0].weekend_price = updateTicketDto.weekend_price;
    }
    if (updateTicketDto.weekday_price) {
      ticket[0].weekday_price = updateTicketDto.weekday_price;
    }
    if (updateTicketDto.deposit) {
      ticket[0].deposit = updateTicketDto.deposit;
    }
    if (updateTicketDto.rental_id) {
      ticket[0].rental_id = updateTicketDto.rental_id;
    }
    const updatedTicket = await this.dbService.db
      .update(Tickets)
      .set({
        name: ticket[0].name,
        weekend_price: ticket[0].weekend_price,
        weekday_price: ticket[0].weekday_price,
        deposit: ticket[0].deposit,
        rental_id: ticket[0].rental_id,
      })
      .where(eq(Tickets.id, id))
      .returning()
      .execute();

    return BaseResponse.from({
      status: 200,
      message: 'Ticket updated successfully',
      data: updatedTicket,
    });
  }

  async remove(id: string): Promise<BaseResponse> {
    return BaseResponse.from({
      status: 200,
      message: 'Ticket removed successfully',
      data: await this.dbService.db
        .delete(Tickets)
        .where(eq(Tickets.id, id))
        .returning()
        .execute(),
    });
  }
}
