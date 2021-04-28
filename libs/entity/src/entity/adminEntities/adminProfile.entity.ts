import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Admin } from '../..';


@ObjectType()
@Entity({ name: "admin-profile" })
export class AdminProfile extends BaseEntity {

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

  @Field(() => String)
  @Column("date")
  dateOfBirth: Date;

  @Column("uuid", {unique: true})
  adminId: string;

  @Field(() => Admin)
  @OneToOne(() => Admin, admin => admin.adminProfile, { onDelete: "CASCADE" })
  @JoinColumn()
  admin: Admin;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  profilePic?: string;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

}
