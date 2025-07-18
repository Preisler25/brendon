import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { DbService } from './db/db.service';
import { RentalsModule } from './rentals/rentals.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [DbModule, RentalsModule, TicketsModule],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
