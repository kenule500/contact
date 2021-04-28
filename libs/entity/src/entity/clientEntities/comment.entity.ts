import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User, Post, Like, File } from '../..';



@ObjectType()
@Entity({name: "comments"})
export class Comment extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String, {nullable: true})
  @Column('text', {nullable: true})
  text?: string;

  @Column('uuid')
  authorId: string;

  @Column('uuid')
  postId: string;

  @Field(() => [File], {nullable: true})
  @OneToMany(() => File, files => files.comment, { nullable: true, onDelete: "SET NULL" })
  files?: File[];

  @Field(() => User)
  @ManyToOne(() => User, user => user.comments, {onDelete: "CASCADE"})
  author: User;

  @Field(() => Post, {nullable: true})
  @ManyToOne(() => Post, post => post.comments, {nullable: true, onDelete: "CASCADE"})
  post?: Post;

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, likes => likes.comment, { nullable: true, onDelete: "SET NULL"})
  likes?: Like[];


  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

}
