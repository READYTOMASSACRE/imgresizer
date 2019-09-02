import { Module } from '@nestjs/common'
import { ResizerController } from './resizer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BFile } from './entities/bfile.entity';
import { BFileService } from './bfile.service';
import { ResizerService } from './resizer.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([BFile]), ConfigModule],
  providers: [BFileService, ResizerService],
  controllers: [ResizerController]
})
export class ResizerModule {}