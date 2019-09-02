import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResizerModule } from './resizer/resizer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ResizerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
