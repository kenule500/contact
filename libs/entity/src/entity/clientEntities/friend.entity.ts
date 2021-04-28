import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne } from 'typeorm';
import { User } from '../..';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum RelationshipStatus {
  BLOCKED = "BLOCKED",
  ACTIVE = "ACTIVE"
}

@ObjectType()
@Entity({ name: 'friends' })
export class Friend extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  friendingId?: string;

  @Column("uuid")
  friendsId: string;

  @Field(() => [User])
  @ManyToOne(() => User, user => user.friends)
  friends: User[];

  @Field(() => [User])
  @ManyToOne(() => User, user => user.friending, {onDelete: "CASCADE"})
  friending?: User[];

  @Field(() => RelationshipStatus)
  @Column("enum", { name: "relationshipStatus", enum: RelationshipStatus, default: "ACTIVE" })
  relationshipStatus: RelationshipStatus;

  @Field(() => String, {nullable: true})
  @Column("uuid", {nullable: true})
  blockedBy?: string

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
registerEnumType(RelationshipStatus, {
  name: "RelationshipStatus"
})
