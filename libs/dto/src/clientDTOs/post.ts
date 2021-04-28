import { InputType, Field } from '@nestjs/graphql';
import { CreateFileInput } from './file';
import { GraphQLUpload } from 'graphql-upload';


@InputType()
export class CreatePostInput {

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean)
  published: boolean;
}

@InputType()
export class UpdatePostInput {

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean, { nullable: true })
  published?: boolean;

}
