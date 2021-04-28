import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { File } from '@contact/entity/index';
import { NotFoundException } from '@nestjs/common';
import { UpdateFileInput } from '@contact/dto/index';

@Resolver()
export class FileResolver {

  @Mutation(() => String)
  async deleteFile(@Args("id") id: string): Promise<string> {
    const result = await File.delete({id})
    if (result.affected === 0) throw new NotFoundException(`file with ID - ${id} not found/Error in deleting a file`)
    return `file deleted successfully`;
  }

  @Mutation(() => File)
  async updateFile(@Args("id") id: string, @Args("authorId") authorId: string, @Args("data") data: UpdateFileInput): Promise<File> {
    const file = await File.update({ id }, { ...data })
    if (file.affected === 0) throw new NotFoundException("file not found/Error while updating");
    return File.findOne({ where: { id, authorId } })
  }
}
