import { Controller, Get, Param } from '@nestjs/common';
// import { BFileService } from './bfile.service';
// import { BFile } from './entities/bfile.entity';

@Controller('_image')
export class ResizerController {
  // constructor(private readonly bfileService: BFileService) {}

  @Get(':id/s/:size/t/:type')
  async getImage(
    @Param('id') id: string,
    @Param('size') size: string,
    @Param('type') type: string,
  ): Promise<string> {
    // const bFile: BFile = await this.bfileService.findById(id);
    // console.log(bFile);

    return `${id} - ${size} - ${type}`
  }
}
