import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User, Message } from '../..';

@ObjectType()
@Entity({ name: "discussions" })
export class Discussion extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  author1Id: string;

  @Column("uuid")
  author2Id: string;

  @Field(() => User)
  author1: User;

  @Field(() => User)
  author2: User

  @Field(() => [Message], {nullable: true})
  @OneToMany(() => Message, message => message.discussion, { onDelete: "SET NULL", nullable: true })
  messages?: Message[];

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
