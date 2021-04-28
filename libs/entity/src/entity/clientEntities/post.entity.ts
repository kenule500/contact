import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User, Comment, File, Like, Page } from '../..';

@ObjectType()
@Entity({name: "posts"})
export class Post extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String, {nullable: true})
  @Column('text', {nullable: true})
  title?: string;

  @Field(() => String, {nullable: true})
  @Column('text', {nullable: true})
  description?: string;

  @Field(() => Boolean)
  @Column('boolean', { default: false })
  published: boolean;

  @Column('uuid')
  authorId: string;

  @Column('uuid')
  pageId: string;

  @Field(() => User)
  @ManyToOne(() => User, author => author.posts, {onDelete: "CASCADE"})
  author: User;

  @Field(() => Page, { nullable: true })
  @ManyToOne(() => Page, page => page.posts, { onDelete: "CASCADE", nullable: true })
  page: Page;

  @Field(() => [File], { nullable: true })
  @OneToMany(() => File, files => files.post, { nullable: true, onDelete: "SET NULL"})
  files?: File[];

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, comments => comments.post, { nullable: true, onDelete: "SET NULL" })
  comments?: Comment[];

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, likes => likes.post, { nullable: true, onDelete: "SET NULL"})
  likes?: Like[]

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

}


