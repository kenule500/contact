import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGroupMember {

  @Field(() => String)
  groupId: string;

  @Field(() => String)
  memberId: string;
}

@InputType()
export class UpdateGroupMember {

  @Field(() => String)
  groupId: string;

  @Field(() => String)
  memberId: string;

  @Field(() => GroupMemberType)
  memberType: GroupMemberType;
}

@InputType()
export class DeleteGroupMember {

  @Field(() => String)
  groupId: string;

  @Field(() => String)
  memberId: string;
}

export enum GroupMemberType {
  ORDINARYMEMBER = "ORDINARY-MEMBER",
  CHIEFADMIN = "CHIEF-ADMIN",
  ADMIN = "ADMIN"
}
