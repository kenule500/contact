import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class CreateProfileInput {

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  middleName?: string;

  @Field(() => String, { nullable: true })
  nickName?: string;

  @Field(() => String)
  dateOfBirth: Date;

}

@InputType()
export class UpdateProfileInput {

  @Field(() => String, {nullable: true})
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  middleName?: string;

  @Field(() => String, { nullable: true })
  nickName?: string;

  @Field(() => String, { nullable: true })
  dateOfBirth?: Date;

}
