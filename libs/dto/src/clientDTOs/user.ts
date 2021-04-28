import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, MinLength } from 'class-validator';


@InputType()
export class CreateUserInput {
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
export class LoginUserInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  password: string;
}

export enum Role {
  CHIEFADMIN = "CHIEF-ADMIN",
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  TEMPORARY_BLOCKED = 'TEMPORARY_BLOCKED',
  PERMANENTLY_BLOCKED = 'PERMANENTLY_BLOCKED',
}
