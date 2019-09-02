import { Module } from '@nestjs/common'
import { ResizerController } from './resizer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { BFile } from './entities/bfile.entity';
// import { BFileService } from './bfile.service';

@Module({
    // imports: [TypeOrmModule.forFeature([BFile])],
    // providers: [BFileService],
    controllers: [ResizerController]
})
export class ResizerModule {}