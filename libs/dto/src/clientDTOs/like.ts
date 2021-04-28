import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateLikeInput  {

  @Field(() => ID, {nullable: true})
  commentId?: string;

  @Field(() => ID, { nullable: true })
  postId?: string;

  @Field(() => ID, { nullable: true })
  messageId?: string;

  @Field(() => ID)
  authorId?: string;

  @Field(() => LikeType)
  likeType: LikeType;
}

export enum LikeType {
  LIKE = "LIKE",
  HATE = "HATE",
  LOVE = "LOVE",
  WOW = "WOW",
  SURPRISE = "SURPRISE"
}
