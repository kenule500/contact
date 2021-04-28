import { Field, InputType } from '@nestjs/graphql';
// import { PageType } from '@contact/entity/index';

@InputType()
export class CreatePageInput {

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => PageType)
  pageType: PageType;
}

@InputType()
export class UpdatePageInput {

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => PageType, { nullable: true })
  pageType?: PageType;
}

export enum PageType {
  personal = "Personal",
  church = "Church",
  blog = "blog",
  celebrity = "celebrity"
}
