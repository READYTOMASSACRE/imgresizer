// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { BFile } from "./entities/bfile.entity";
// import { Repository } from "typeorm";

// @Injectable()
// export class BFileService {
//     constructor(
//         @InjectRepository(BFile)
//         private readonly bfileRepository: Repository<BFile>
//     ) {}

//     findById(id: string): Promise<BFile> {
//         return this.bfileRepository.findOne(id);
//     }
// }