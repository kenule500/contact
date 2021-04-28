import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User, Post, Comment, Message } from '../..';
import { LikeType } from '@contact/dto/index';

@ObjectType()
@Entity({name: "likes"})
export class Like extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => LikeType)
  @Column('enum', { name: 'likeType', enum: LikeType })
  likeType: LikeType;

  @Column('uuid')
  authorId: string;

  @Column('uuid', { nullable: true })
  commentId?: string;

  @Column('uuid', { nullable: true })
  postId?: string;

  @Column('uuid', { nullable: true })
  messageId?: string;

  @Field(() => Message, { nullable: true })
  @ManyToOne(() => Message, message => message.likes, { nullable: true, onDelete: "CASCADE" })
  message?: Message;

  @Field(() => Comment, {nullable: true})
  @ManyToOne(() => Comment, comment => comment.likes, {nullable: true, onDelete: "CASCADE"})
  comment?: Comment;

  @Field(() => User, { nullable: true,})
  @ManyToOne(() => User, user => user.likes, {onDelete: "CASCADE"})
  author?: User;

  @Field(() => Post, { nullable: true })
  @ManyToOne(() => Post, post => post.likes, {nullable: true, onDelete: "CASCADE"})
  post?: Post;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}



registerEnumType(LikeType, {
  name: 'LikeType',
});
