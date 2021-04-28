import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Entity, BaseEntity, CreateDateColumn, UpdateDateColumn, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post, User, Follower, PageAdmin } from '../..';
import { PageType } from '@contact/dto/index';


@ObjectType()
@Entity({name: "pages"})
export class Page extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column("text", {unique: true})
  name: string;

  @Field(() => String)
  @Column("text")
  description: string;

  @Field(() => PageType)
  @Column('enum', { name: 'pageType', enum: PageType })
  pageType: PageType;

  // @Column("uuid")
  // authorId: string;

  @Field(() => [Follower], {nullable: true})
  @OneToMany(() => Follower, follower => follower.page, { onDelete: "SET NULL" , nullable: true})
  followers?: Follower[];

  @Field(() => PageAdmin)
  @OneToMany(() => PageAdmin, pageAdmin => pageAdmin.page, { onDelete: "SET NULL" })
  pageAdmins: PageAdmin;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, post => post.page, { onDelete: "SET NULL", nullable: true })
  posts?: Post[];

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}


registerEnumType(PageType, {
  name: 'PageType',
});

