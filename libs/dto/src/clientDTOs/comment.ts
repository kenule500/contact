import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {

  @Field(() => String, { nullable: true })
  text?: string;

}

@InputType()
export class UpdateCommentInput {

  @Field(() => String, { nullable: true })
  text?: string;

}
