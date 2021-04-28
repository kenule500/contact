import { BaseEntity, PrimaryGeneratedColumn, Entity, Column, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, registerEnumType, ObjectType } from '@nestjs/graphql';
import { Post, Profile, Comment, Like, Friend, Message, Follower, PageAdmin } from '../..';
import { Role, Status } from '@contact/dto/index';

@ObjectType()
@Entity({name: "users"})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column('text', {unique: true})
  @Field(() => String)
  email: string;

  @Column('text')
  password?: string;

  @Column('text', {unique: true})
  @Field(() => String)
  phoneNumber: string;

  @Column('text')
  salt?: string;

  @Field(() => Role)
  @Column('enum', { name: 'role', enum: Role, default: "USER"})
  role: Role;

  @Field(() => Boolean)
  @Column('boolean', { default: false })
  emailConfirmed: boolean;

  @Field(() => [PageAdmin], { nullable: true })
  @OneToMany(() => PageAdmin, pageAdmin => pageAdmin.admin, { onDelete: "SET NULL", nullable: true })
  pages?: PageAdmin[];

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comments) => comments.author, { nullable: true, onDelete: "SET NULL"})
  comments?: Comment[];

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, likes => likes.author, { nullable: true, onDelete: "SET NULL"})
  likes?: Like[];

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (posts) => posts.author, { nullable: true, onDelete: "SET NULL"})
  posts?: Post[];

  @Field(() => Profile, { nullable: true })
  @OneToOne(() => Profile, profile => profile.user, {onDelete: "SET NULL", nullable: true})
  profile?: Profile;

  // @Field(() => [File], { nullable: true })
  // @OneToMany(() => File, files => files.author, { nullable: true, onDelete: "SET NULL"})
  // files?: File[];

  @Field(() => [Message], { nullable: true })
  @OneToMany(() => Message, messages => messages.author, { nullable: true, onDelete: "SET NULL" })
  messages?: Message[];

  @Field(() => [Friend], { nullable: true })
  @OneToMany(() => Friend, friend => friend.friends, { nullable: true, onDelete: "SET NULL" })
  friends?: Friend[];

  @Field(() => [Friend], { nullable: true })
  @OneToMany(() => Friend, friend => friend.friending, { nullable: true, onDelete: "SET NULL" })
  friending?: Friend[];

  @Field(() => [Follower], { nullable: true })
  @OneToMany(() => Follower, follower => follower.follower, { onDelete: "SET NULL" })
  following: Follower[];

  @Field(() => Status)
  @Column('enum', { name: 'status', enum: Status, default: "ACTIVE" })
  status: Status;

  // @Field(() => [Post])
  // newsFeeds: Post[];

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}


registerEnumType(Role, {
  name: 'Role',
});


registerEnumType(Status, {
  name: 'Status',
});




