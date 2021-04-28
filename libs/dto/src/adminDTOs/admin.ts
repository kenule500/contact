import { InputType, Field } from "@nestjs/graphql";
import { IsPhoneNumber, MinLength, IsEmail } from 'class-validator';

@InputType()
export class CreateAdminInput {

  @IsEmail()
  @Field(() => String)
  email: string;

  @IsPhoneNumber(null)
  @Field(() => String)
  phoneNumber: string;

  @MinLength(8)
  @Field(() => String)
  password: string;

  salt?: string;
}


@InputType()
export class UpdateAdminInput {

  @IsEmail()
  @Field(() => String, {nullable: true})
  email?: string;

  @IsPhoneNumber(null)
  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @MinLength(8)
  @Field(() => String, { nullable: true })
  password?: string;

  salt?: string;
}
