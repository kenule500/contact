import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAdminProfileInput {

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  middleName?: string;

  @Field(() => String)
  dateOfBirth: Date;

  @Field(() => String, { nullable: true })
  profilePic?: string;
}

@InputType()
export class UpdateAdminProfileInput {

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  middleName?: string;

  @Field(() => String, { nullable: true })
  dateOfBirth?  : Date;

  @Field(() => String, { nullable: true })
  profilePic?: string;
}
