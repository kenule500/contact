import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Page, User } from '../..';

@ObjectType()
@Entity({name: "followers"})
export class Follower extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  pageId: string;

  @Field(() => Page)
  @ManyToOne(() => Page, page => page.followers, { onDelete: "CASCADE" })
  page: Page;

  @Column("uuid")
  followerId: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.following, { onDelete: "CASCADE" })
  follower: User;

  @Column("timestamp", {nullable: true})
  postUpdate?: Date;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
