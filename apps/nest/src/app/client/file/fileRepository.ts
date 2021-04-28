import { EntityRepository, Repository } from 'typeorm';
import { File } from '@contact/entity/index';


@EntityRepository(File)
export class FileRepository extends Repository<File> {

}
