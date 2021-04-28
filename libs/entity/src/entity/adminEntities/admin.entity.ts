import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToOne } from 'typeorm';
import { Role } from '@contact/dto/index';
import { AdminProfile } from '../..';

@ObjectType()
@Entity({ name: "admins" })
export class Admin extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column("text", {unique: true})
  email: string;

  @Field(() => String)
  @Column("text", { unique: true })
  phoneNumber: string;

  @Column('text')
  password: string;

  @Column('text')
  salt?: string;

  @Field(() => Role)
  @Column('enum', { name: 'role', enum: Role, default: "ADMIN" })
  role: Role;

  @Field(() => Boolean)
  @Column('boolean', { default: false })
  emailConfirmed: boolean;

  @Field(() => AdminProfile)
  @OneToOne(() => AdminProfile, adminProfile => adminProfile.admin, { onDelete: "SET NULL" })
  adminProfile: AdminProfile;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
