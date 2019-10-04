import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { statSync, existsSync, mkdirSync } from 'fs'
import { BFileService } from "./bfile.service";
import { BFile } from "./entities/bfile.entity";
import * as sharp from 'sharp'
import imagemin = require("imagemin");
import imageminPngquant from 'imagemin-pngquant'
import imageminJpegtran = require('imagemin-jpegtran')
import imageminWebp = require('imagemin-webp')
import { ConfigService } from "../config/config.service";

@Injectable()
export class ResizerService {
  constructor(
    private readonly bfileService: BFileService,
    private readonly config: ConfigService
  ) {}

  /**
   * Возвращает ссылку на файл или false
   * 
   * @param id идентификатор файла
   * @param width ширина файла
   * @param height высота файла
   * @param type формат файла [jpg, jpeg, png, webp]
   * 
   * @return Promise<string|boolean>
   */
  async getImage(
    id: number,
    width: number,
    height: number,
    type: string
  ) : Promise<string|boolean> {
    type = this.validateType(type)

    try {
      const filename = this.getDestinationDir() + `/${id}/` + this.makeFileName(id, width, height, type)

      statSync(filename)

      return filename
    } catch (e) {
      const bFile: BFile = await this.bfileService.findById(id.toString())

      if (bFile) {
        try {
          width = width <= bFile.WIDTH && width > 0 && width || bFile.WIDTH
          height = height <= bFile.HEIGHT && height > 0 && height || bFile.HEIGHT

          const source = this.getSourceFile(bFile)
          const destination = this.getDestinationFile(bFile, width, height, type)

          statSync(source)

          await this.cropImage(source, destination, width, height)
          await this.optimizeImage(destination, type)

          return destination
        } catch (e) {
          if (e instanceof HttpException) throw e

          return this.config.get('NO_IMAGE')
        }
      }
    }

    return false
  }

  /**
   * Возвращает путь до исходной директории
   * @return string
   */
  protected getSourceDir() : string {
    return this.config.get('SOURCE_DIR')
  }

  /**
   * Возвращает путь до исходного файла
   * @param bFile 
   * @return string
   */
  protected getSourceFile(bFile: BFile) : string {
    const sourceDir: string = this.getSourceDir()

    if (!sourceDir || !sourceDir.trim().length) {
      throw new HttpException('Source directory doesn\'t exist', HttpStatus.FORBIDDEN)
    }

    return `${sourceDir}/${bFile.SUBDIR}/${bFile.FILE_NAME}`
  }

  /**
   * Возвращает путь до конечной директории
   * @param bFile 
   * @return string
   */
  protected getDestinationDir() : string {
    return this.config.get('DESTINATION_DIR')
  }

  /**
   * Возвращает путь до конечного файла
   * @param bFile модель файла
   * @param width ширина
   * @param height высота
   * @param ext тип [jpeg, png, webp]
   * @return string
   */
  protected getDestinationFile(
    bFile: BFile,
    width: number,
    height: number,
    ext: string
  ) : string {
    const destinationDir: string = this.getDestinationDir()

    if (!destinationDir || !destinationDir.trim().length) {
      throw new HttpException('Destination directory doesn\'t exist', HttpStatus.FORBIDDEN)
    }

    const destination: string = `${destinationDir}/${bFile.ID}`

    if (!existsSync(destination)) mkdirSync(destination)

    return destination + `/${this.makeFileName(bFile.ID, width, height, ext)}`
  }

  /**
   * Создает имя файла
   * @param id идентификатор файла
   * @param width ширина
   * @param height высота
   * @param ext тип [jpeg, png, webp]
   * @return string
   */
  protected makeFileName(id: number, width: number, height: number, ext?: string) : string {
    return `${id}_${width}x${height}.${ext}`;
  }

  /**
   * Проверяет тип файла
   * @param ext тип файла
   * @return string
   */
  protected validateType(ext?: string): string {
    const availableTypes = this.getAvailableTypes()
    
    ext = ext || 'jpeg'

    return availableTypes.includes(ext.toLowerCase()) && ext || 'jpeg'
  }

  /**
   * Возвращает допустимые типы файлов
   * @return string[]
   */
  protected getAvailableTypes() : string[] {
    return [
      'jpeg',
      'png',
      'webp'
    ]
  }

  /**
   * Изменяет размер файла
   * @param source путь до исходного файла
   * @param destination путь куда сохранить файл
   * @param width ширина
   * @param height высота
   * @return Promise<string>
   */
  protected async cropImage(
    source: string,
    destination: string,
    width: number,
    height: number
  ) : Promise<string> {
    await sharp(source)
      .resize(width, height)
      .toFile(destination)

    return destination
  }

  /**
   * Оптимизирует файл
   * @param filepath путь до файла
   * @param type тип [jpeg, png, webp]
   * @return Promise<string>
   */
  protected async optimizeImage(
    filepath: string,
    type: string
  ) : Promise<string> {
    const opts: any = {}

    switch (type) {
      case 'jpeg':
        opts.use = [imageminJpegtran({ progressive: true, })]
        break
      case 'png':
        opts.use = [imageminPngquant()]
        break
      case 'webp':
        opts.use = [imageminWebp({ quality: 50, method: 0, alphaQuality: 0 })]
        break
    }

    await imagemin([filepath], filepath, opts)

    return filepath
  }
}