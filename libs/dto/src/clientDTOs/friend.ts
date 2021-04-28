import { InputType, Field } from '@nestjs/graphql';
import { RelationshipStatus } from '@contact/entity/index';


@InputType()
export class CreateFriendInput {

  @Field(() => String)
  friendsId: string;

  @Field(() => String)
  friendingId: string;

}
