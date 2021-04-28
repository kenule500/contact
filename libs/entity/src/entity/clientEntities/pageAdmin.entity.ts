import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Field, ID, registerEnumType, ObjectType } from '@nestjs/graphql';
import { User, Page } from '..';

export enum AdminType {
  CHIEFADMIN = "CHIEF-ADMIN",
  ADMIN = "ADMIN"
}

@ObjectType()
@Entity({ name: "pageAdmins" })
export class PageAdmin extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  adminId: string;

  @Field(() => User)
  @ManyToOne(() => User, admin => admin.pages, {onDelete: "CASCADE"})
  admin: User;

  @Field(() => AdminType)
  @Column("enum", { name: "adminType", enum: AdminType, default: "ADMIN" })
  adminType: AdminType;

  @Column("uuid")
  pageId: string;

  @Field(() => Page)
  @ManyToOne(() => Page, page => page.pageAdmins, { onDelete: "CASCADE" })
  page: Page;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}

registerEnumType(AdminType, {
  name: 'AdminType',
});
