import { Resolver, Mutation, Args, ResolveField, Parent, Query, Subscription } from '@nestjs/graphql';
import { Group, GroupMember } from '@contact/entity/index';
import { CreateGroup, GroupMemberType, UpdateGroup } from '@contact/dto/index';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(Group)
export class GroupResolver {

  @Query(() => [GroupMember])
  async myGroups(@Args("authorId") authorId: string): Promise<GroupMember[]> {
    return GroupMember.find({ where: { memberId: authorId } });
  }

  @Mutation(() => Group)
  async createGroup(@Args("data") data: CreateGroup, @Args("authorId") authorId: string): Promise<Group> {
    const newGroup =  Group.create({ ...data })
    try {
      await newGroup.save();
      const groupMember = new GroupMember()
      groupMember.groupId = newGroup.id;
      groupMember.memberId = authorId;
      groupMember.memberType = GroupMemberType.CHIEFADMIN;
      const pubCreated = await GroupMember.create({ ...groupMember }).save();
      if (newGroup) pubSub.publish('groupCreated', { newGroup });
      if (pubCreated) pubSub.publish('groupMemberCreated', { groupMemberCreated: pubCreated });
    } catch (error) {
      if (error.code === '23505') throw new ConflictException(`Group with name "${newGroup.groupName}" already exist`)
    }
    return newGroup;
  }

  @Mutation(() => Group)
  async updateGroup(@Args("data") data: UpdateGroup, @Args("authorId") authorId: string, @Args("groupId") groupId: string): Promise<Group> {
    const isAdmin = await GroupMember.findOne({
      where: [{ memberType: "CHIEF-ADMIN", memberId: authorId, groupId: groupId },
        { memberType: "ADMIN", memberId: authorId, groupId: groupId  }]
    })
    if (!isAdmin) throw new UnauthorizedException("You are not authorised to edit this group")
    const updatedGroup = await Group.update({ id: groupId }, { ...data })
    if (updatedGroup.affected === 0) throw new NotFoundException(`Error in updating this group`)
    const pubUpdated = Group.findOne({ where: { id: groupId } });
    if (pubUpdated) pubSub.publish('groupUpdated', { groupUpdated: pubUpdated });
    return pubUpdated;
  }

  @Mutation(() => String)
  async deletGroup(@Args("authorId") authorId: string, @Args("groupId") groupId: string): Promise<string> {
    const groupExist = await Group.findOne({ where: { id: groupId } });
    if (!groupExist) throw new NotFoundException("Group not found")
    const isAdmin = await GroupMember.findOne({
      where: [{ memberType: "CHIEF-ADMIN", memberId: authorId, groupId: groupId },
      { memberType: "ADMIN", memberId: authorId, groupId: groupId }]
    })
    if (!isAdmin) throw new UnauthorizedException("You are not authorised to delete this group")
    const pubDeleted = await Group.findOne({ where: { id: groupId } });
    const groupDeleted = await Group.delete({ id: groupId })
    if (groupDeleted.affected > 0) pubSub.publish('groupDeleted', { groupDeleted: pubDeleted });
    return `Group deleted successfully`;
  }

  @ResolveField(() => [GroupMember])
  async groupMembers(@Parent() group: Group): Promise<GroupMember[]> {
    return await GroupMember.find({where: {groupId: group.id}})
  }

  @Subscription(() => Group)
  groupCreated() {
    return pubSub.asyncIterator('groupCreated');
  }

  @Subscription(() => GroupMember)
  groupMemberCreated() {
    return pubSub.asyncIterator('groupMemberCreated');
  }

  @Subscription(() => Group)
  groupUpdated() {
    return pubSub.asyncIterator('groupUpdated');
  }

  @Subscription(() => Group)
  groupDeleted() {
    return pubSub.asyncIterator('groupDeleted');
  }
}
