import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('b_file')
export class BFile {
  @PrimaryGeneratedColumn()
  ID: number

  @Column('datetime')
  TIMESTAMP_X: Date

  @Column({ length: 500 })
  MODULE_ID: string

  @Column('int')
  HEIGHT: number

  @Column('int')
  WIDTH: number

  @Column('int')
  FILE_SIZE: number

  @Column({ length: 500 })
  CONTENT_TYPE: string

  @Column({ length: 500 })
  SUBDIR: string

  @Column({ length: 500 })
  FILE_NAME: string

  @Column({ length: 500 })
  ORIGINAL_NAME: string

  @Column('text')
  DESCRIPTION: string

  @Column({ length: 500 })
  HANDLER_ID: string

  @Column({ length: 500 })
  EXTERNAL_ID: string
}