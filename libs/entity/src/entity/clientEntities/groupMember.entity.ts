import { Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { GroupMemberType } from '@contact/dto/index';
import { Group } from '../..';
import { User } from './user.entity';

@ObjectType()
@Entity({ name: "groupMembers" })
export class GroupMember extends BaseEntity{

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  groupId: string;

  @Column("uuid")
  memberId: string;

  @Field(() => GroupMemberType)
  @Column("enum", { name: "memberType", enum: GroupMemberType, default: "ORDINARY-MEMBER" })
  memberType: GroupMemberType;

  @Field(() => User)
  member: User;

  @Field(() => Group)
  @ManyToOne(() => Group, group => group.groupMembers, { onDelete: "CASCADE" })
  group: Group;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}

registerEnumType(GroupMemberType, {
  name: 'GroupMemberType',
});
