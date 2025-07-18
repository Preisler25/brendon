import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { DbService } from '../db/db.service';
import { Rentals } from '../db/schema/rentals';
import { eq } from 'drizzle-orm';
import BaseResponse from '../response';

@Injectable()
export class RentalsService {
  constructor(private readonly dbService: DbService) {}

  async checkRentalExists(rentalName: string): Promise<BaseResponse> {
    const rental = await this.dbService.db
      .select()
      .from(Rentals)
      .where(eq(Rentals.name, rentalName))
      .execute();
    return BaseResponse.from({
      status: rental.length > 0 ? 800 : 200,
      message:
        rental.length > 0 ? 'Rental already exists' : 'Rental does not exist',
      data: rental.length > 0 ? [rental[0]] : [],
    });
  }

  async create(createRentalDto: CreateRentalDto): Promise<BaseResponse> {
    const inDB = await this.checkRentalExists(createRentalDto.name);
    if (inDB.data.length > 0) {
      return BaseResponse.from({
        status: 800,
        message: inDB.message,
        data: inDB.data,
      });
    }
    const rental = await this.dbService.db
      .insert(Rentals)
      .values({
        name: createRentalDto.name,
        max_amount: Number(createRentalDto.max_amount),
        active: Number(createRentalDto.active),
      })
      .returning()
      .execute();
    return BaseResponse.from({
      status: 200,
      message: 'Rental created successfully',
      data: rental,
    });
  }

  async findAll(): Promise<BaseResponse> {
    const rentals = await this.dbService.db.select().from(Rentals).execute();
    return BaseResponse.from({
      status: 200,
      message: 'Rentals retrieved successfully',
      data: rentals,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} rental`;
  }

  async update(
    id: string,
    updateRentalDto: UpdateRentalDto,
  ): Promise<BaseResponse> {
    const rental = await this.dbService.db
      .select()
      .from(Rentals)
      .where(eq(Rentals.id, id))
      .execute();
    if (rental.length === 0) {
      return BaseResponse.from({
        status: 800,
        message: 'Rental not found',
      });
    }
    if (updateRentalDto.name && updateRentalDto.name !== rental[0].name) {
      const inDB = await this.checkRentalExists(updateRentalDto.name);
      if (inDB.data.length > 0) {
        return BaseResponse.from({
          status: 800,
          message: inDB.message,
          data: inDB.data,
        });
      }
      rental[0].name = updateRentalDto.name;
    }
    if (updateRentalDto.max_amount) {
      rental[0].max_amount = Number(updateRentalDto.max_amount);
    }
    if (updateRentalDto.active) {
      rental[0].active = Number(updateRentalDto.active);
    }
    const updatedRental = await this.dbService.db
      .update(Rentals)
      .set({
        name: rental[0].name,
        max_amount: rental[0].max_amount,
        active: rental[0].active,
      })
      .where(eq(Rentals.id, id))
      .returning()
      .execute();
    return BaseResponse.from({
      status: 200,
      message: 'Rental updated successfully',
      data: updatedRental,
    });
  }

  async remove(id: string): Promise<BaseResponse> {
    const rental = await this.dbService.db
      .select()
      .from(Rentals)
      .where(eq(Rentals.id, id))
      .execute();
    if (rental.length === 0) {
      return BaseResponse.from({
        status: 800,
        message: 'Rental not found',
      });
    }
    await this.dbService.db.delete(Rentals).where(eq(Rentals.id, id)).execute();
    return BaseResponse.from({
      status: 200,
      message: 'Rental deleted successfully',
    });
  }
}
