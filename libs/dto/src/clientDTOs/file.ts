import { InputType, Field } from "@nestjs/graphql";
import { ReadStream } from 'fs';


@InputType()
export class CreateFileInput {

  @Field(() => String)
  fileName: string;

  @Field(() => String)
  size: string;

  @Field(() => String)
  mimetype: string;

  @Field(() => String)
  url: string;

}

@InputType()
export class UpdateFileInput {

  @Field(() => String)
  fileName: string;

  @Field(() => String)
  size: string;

  @Field(() => String)
  mimetype: string;

  @Field(() => String)
  url: string;
}

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(): ReadStream;
}
