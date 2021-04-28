import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GroupMember, Message } from '..';

@ObjectType()
@Entity({ name: "groups" })
export class Group extends BaseEntity{

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column("text", {unique: true})
  groupName?: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  groupPicture: string;

  @Field(() => [GroupMember])
  @OneToMany(() => GroupMember, groupMember => groupMember.group, {onDelete: "SET NULL"})
  groupMembers: GroupMember[];

  @Field(() => [Message], {nullable: true})
  @OneToMany(() => Message, message => message.group, { onDelete: "SET NULL", nullable: true })
  messages?: Message[];

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
