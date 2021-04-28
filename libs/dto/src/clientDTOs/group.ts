import { InputType, Field, ID } from '@nestjs/graphql';


@InputType()
export class CreateGroup {

  @Field(() => String)
  groupName: string;

  @Field(() => String, {nullable: true})
  groupPicture?: string;
}

@InputType()
export class UpdateGroup {

  @Field(() => String, { nullable: true })
  groupName?: string;

  @Field(() => String, { nullable: true })
  groupPicture?: string;
}
