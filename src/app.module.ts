import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResizerModule } from './resizer/resizer.module';
import { getMetadataArgsStorage } from 'typeorm';
import { config } from '../ormconfig'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config,
      "type": "mysql",
      "entities": getMetadataArgsStorage().tables.map(tbl => tbl.target),
      "keepConnectionAlive": true
  }),
    ResizerModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
