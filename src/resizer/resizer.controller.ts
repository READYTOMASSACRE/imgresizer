import { Controller, Get, Param, Res, HttpStatus, Header, Req, UseInterceptors } from '@nestjs/common';
import { ResizerService } from './resizer.service';
import { WebpSupportInterceptor } from '../webpsupport.interceptor';

@Controller('_image')
export class ResizerController {
  constructor(private readonly resizeService: ResizerService) {}

  @Get(':id/s/:size/t/:type')
  @Header('Cache-Control', 'max-age=7776000, public')
  @UseInterceptors(WebpSupportInterceptor)
  async getImage(
    @Res() res,
    @Req() req,
    @Param('id') id: string,
    @Param('size') size: string,
    @Param('type') type: string,
  ) {
    const sizes: string[] = size.split('x')

    type = type.toLowerCase()

    if (type === 'webp' && !req.webpSupport) type = 'jpeg'

    const filePath : string|boolean = await this.resizeService.getImage(+id, +sizes[0], +sizes[1], type)

    if (filePath === false) {
      return res.status(HttpStatus.NOT_FOUND).send({ statusCode: 404 })
    } else {
      return res.sendFile(filePath)
    }
  }
}
