import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Discussion, User, Group, Like } from '..';

@ObjectType()
@Entity({ name: "messages" })
export class Message extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", {nullable: true})
  discussionId?: string;

  @Field(() => String, {nullable: true})
  @Column("text", {nullable: true})
  text?: string;

  @Field(() => String, {nullable: true})
  @Column("text", {nullable: true})
  file?: string;

  @Column("uuid")
  authorId: string;

  @Column("uuid", {nullable: true})
  groupId?: string

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, like => like.message, { onDelete: "SET NULL", nullable: true })
  likes?: Like[];

  @Field(() => Group, { nullable: true })
  @ManyToOne(() => Group, group => group.messages, { onDelete: "CASCADE" , nullable: true})
  group?: Group;

  @Field(() => Discussion, { nullable: true })
  @ManyToOne(() => Discussion, discussion => discussion.messages, { onDelete: "CASCADE", nullable: true})
  discussion?: Discussion;

  @Field(() => User)
  @ManyToOne(() => User, user => user.messages, { onDelete: "CASCADE" })
  author: User;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
