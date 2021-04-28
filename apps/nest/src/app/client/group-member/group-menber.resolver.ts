import { Resolver, ResolveField, Parent, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { GroupMember, User, Group } from '@contact/entity/index';
import { CreateGroupMember, UpdateGroupMember, DeleteGroupMember } from '@contact/dto/index';
import { UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();
@Resolver(GroupMember)
export class GroupMenberResolver {

  @Query(() => [GroupMember])
  async groupMembers(@Args("groupId") groupId: string): Promise<GroupMember[]> {
    return GroupMember.find({ where: { groupId } });
  }

  @Mutation(() => GroupMember)
  async createGroupMember(@Args("data") data: CreateGroupMember, @Args("authorId") authorId: string): Promise<GroupMember> {
    const groupExist = await Group.findOne({ where: { id: data.groupId } });
    if (!groupExist) throw new NotFoundException("group does not exist")

    const isAdmin = await GroupMember.findOne({
      where: [{ memberType: "CHIEF-ADMIN", memberId: authorId, groupId: data.groupId },
      { memberType: "ADMIN", memberId: authorId, groupId: data.groupId }]
    })
    if (!isAdmin) throw new UnauthorizedException("You are not authorised to add any one")

    const memeberExist = await GroupMember.findOne({ where: { memberId: data.memberId, groupId: data.groupId } })
    if (memeberExist) throw new ConflictException("This user already belong to this group")
    const pubCreated = GroupMember.create({ ...data }).save();
    if (pubCreated) pubSub.publish('groupMemberCreated', { groupMemberCreated: pubCreated });
    return pubCreated;
  }

  @Mutation(() => GroupMember)
  async updateGroupMember(@Args("data") data: UpdateGroupMember, @Args("authorId") authorId: string): Promise<GroupMember> {
    const groupExist = await Group.findOne({ where: { id: data.groupId } });
    if (!groupExist) throw new NotFoundException("group does not exist")

    const isAdmin = await GroupMember.findOne({
      where: [{ memberType: "CHIEF-ADMIN", memberId: authorId, groupId: data.groupId },
      { memberType: "ADMIN", memberId: authorId, groupId: data.groupId }]
    })
    if (!isAdmin) throw new UnauthorizedException("You are not authorised to edit any member of this group");

    const isChiefAdmin = await GroupMember.findOne({ where: { memberId: data.memberId, groupId: data.groupId, memberType: "CHIEF-ADMIN" } })
    if (isChiefAdmin) throw new UnauthorizedException("You can't edit the chief admin of this group")

    const updatedMember = await GroupMember.update({ memberId: data.memberId, groupId: data.groupId }, { memberType: data.memberType })
    if (updatedMember.affected === 0) throw new Error("Error in updating group member");
    const pubUpdated = GroupMember.findOne({ where: { memberId: data.memberId, groupId: data.groupId } })
    if (updatedMember.affected > 0) pubSub.publish('groupMemberUpdated', { groupMemberUpdated: pubUpdated })
    return pubUpdated;
  }

  @Mutation(() => String)
  async deleteGroupMember(@Args("authorId") authorId: string, @Args("data") data: DeleteGroupMember): Promise<string> {
    const groupExist = await Group.findOne({ where: { id: data.groupId } });
    if (!groupExist) throw new NotFoundException("group does not exist")

    const isAdmin = await GroupMember.findOne({
      where: [{ memberType: "CHIEF-ADMIN", memberId: authorId, groupId: data.groupId },
      { memberType: "ADMIN", memberId: authorId, groupId: data.groupId }]
    })
    if (!isAdmin) throw new UnauthorizedException("You are not authorised to delete any member of this group");

    const isChiefAdmin = await GroupMember.findOne({
      where: { memberType: "CHIEF-ADMIN", memberId: data.memberId, groupId: data.groupId }})
    if (isChiefAdmin) throw new UnauthorizedException("You can't delete a chief admin of this group");

    const pubDeleted = await GroupMember.findOne({ where: { memberId: data.memberId, groupId: data.groupId }})
    const deletedMember = await GroupMember.delete({memberId: data.memberId, groupId: data.groupId})
    if (deletedMember.affected === 0) throw new NotFoundException("Group member not found/Error while deleting a member")
    if (deletedMember.affected > 0) pubSub.publish('groupMemberDeleted', { groupMemberDeleted: pubDeleted });
    return `Group member deleted successfully`;
  }

  @ResolveField(() => User)
  async member(@Parent() member: GroupMember): Promise<User> {
    return await User.findOne({ where: { id: member.memberId } });
  }

  @ResolveField(() => Group)
  async group(@Parent() member: GroupMember): Promise<Group> {
    return Group.findOne({ where: { id: member.groupId } });
  }

  @Subscription(() => GroupMember)
  groupMemberCreated() {
    return pubSub.asyncIterator('groupMemberCreated');
  }

  @Subscription(() => GroupMember)
  groupMemberUpdated() {
    return pubSub.asyncIterator('groupMemberUpdated');
  }

  @Subscription(() => GroupMember)
  groupMemberDeleted() {
    return pubSub.asyncIterator('groupMemberDeleted');
  }
}
