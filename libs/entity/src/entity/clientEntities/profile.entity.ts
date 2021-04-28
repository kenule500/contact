import { PrimaryGeneratedColumn, BaseEntity, Column, OneToOne, JoinColumn, OneToMany, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../..';


@ObjectType()
@Entity({name: "profiles"})
export class Profile extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column('text')
  firstName: string;

  @Field(() => String)
  @Column('text')
  lastName: string;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  middleName?: string;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  nickName?: string;

  @Column('uuid', {unique: true})
  userId?: string;

  @Field(() => String)
  @Column('date')
  dateOfBirth: Date;

  @Field(() => User)
  @OneToOne(() => User, user => user.profile, {onDelete: "CASCADE"})
  @JoinColumn()
  user: User;

  @Field(() => String, {nullable: true})
  @Column('text', { nullable: true })
  profilePic?: string;

  // @Field(() => Post, { nullable: true })
  // @OneToMany(() => Post, posts => posts.profile, { nullable: true, onDelete: "SET NULL"})
  // posts?: Post;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;




}
