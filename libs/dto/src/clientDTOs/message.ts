import { InputType, Field, ID } from "@nestjs/graphql";


@InputType()
export class CreateMessageInput {

  @Field(() => ID, {nullable: true})
  discussionId?: string;

  @Field(() => ID, { nullable: true })
  groupId?: string;

  @Field(() => ID)
  authorId: string;

  @Field(() => String, { nullable: true })
  text?: string;

  @Field(() => String, { nullable: true })
  file?: string
}

@InputType()
export class UpdateMessageInput {

  @Field(() => String, { nullable: true })
  text?: string;

  @Field(() => String, { nullable: true })
  file?: string
}
