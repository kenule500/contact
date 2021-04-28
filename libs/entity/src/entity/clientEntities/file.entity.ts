import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Post, Comment } from '../..';
import { Stream } from 'stream';


@ObjectType()
@Entity({ name: 'files' })
export class File extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column('text')
  fileName: string;

  @Field(() => String)
  @Column('text')
  size: string;

  @Field(() => String)
  @Column('text')
  mimetype: string;

  @Field(() => String)
  @Column('text')
  url: string;

  // @Field(() => String)
  // @Column('text')
  // encoding: string;

  // @Field(() => String)
  // @Column('text')
  // stream: Stream;

  // @Column('uuid')
  // authorId: string

  @Column('uuid', { nullable: true })
  commentId?: string;

  @Column('uuid', { nullable: true })
  postId: string;

  @Field(() => Post, { nullable: true })
  @ManyToOne(() => Post, post => post.files, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  post?: Post;

  @Field(() => Comment, { nullable: true })
  @ManyToOne(() => Comment, (comment) => comment.files, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  comment?: Comment;

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
