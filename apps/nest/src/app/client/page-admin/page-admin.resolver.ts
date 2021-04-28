import { Resolver, Query, Args, ResolveField, Parent, Mutation, Subscription } from '@nestjs/graphql';
import { PageAdmin, Page, AdminType, Follower } from '@contact/entity/index';
import { ConflictException } from '@nestjs/common';

import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();
@Resolver(PageAdmin)
export class PageAdminResolver {

  @Mutation(() => PageAdmin)
  async createPageAdmin(@Args("authorId") authorId: string, @Args("userId") userId: string, @Args("pageId") pageId: string): Promise<PageAdmin> {
    const isChiefAdmin = await PageAdmin.findOne({ where: { adminId: authorId, pageId, adminType: "CHIEF-ADMIN" } });
    if (!isChiefAdmin) throw new Error("You are not authorised to make any body an admin of this page")
    const isAdmin = await PageAdmin.findOne({ where: { pageId, adminId: userId } });
    if (isAdmin) throw new ConflictException("this user is already an admin of this page");
    const isFollower = await Follower.findOne({ where: { pageId, followerId: userId } });
    if (!isFollower) {
      const follow =  Follower.create({})
      follow.pageId = pageId;
      follow.followerId = userId;
      await follow.save();
    }
    try {
      const pageAdmin =  PageAdmin.create({})
      pageAdmin.adminId = userId;
      pageAdmin.pageId = pageId;
      pageAdmin.adminType = AdminType.ADMIN
      await pageAdmin.save();
      pubSub.publish('pageAdminCreated', { pageAdminCreated: pageAdmin });
      return pageAdmin;
    } catch (error) {
      throw new Error(error)
    }
  }

  @Mutation(() => String)
  async deletePageAdmin(@Args("authorId") authorId: string, @Args("userId") userId: string, @Args("pageId") pageId: string): Promise<string> {
    const isChiefAdmin = await PageAdmin.findOne({ where: { adminId: authorId, pageId, adminType: "CHIEF-ADMIN" } });
    if (!isChiefAdmin) throw new Error("You are not authorised to delete an admin of this page")
    const deletedAdmin = await PageAdmin.findOne({ where: { pageId, adminId: userId } });
    const deleteAdmin = await PageAdmin.delete({ pageId, adminId: userId });
    if (deleteAdmin.affected === 0) throw new Error("There was an error while deleting this user");
    if (deleteAdmin.affected > 0) pubSub.publish('pageAdminDeleted', { pageAdminDeleted: deletedAdmin });
    return `Admin deleted successfully`;
  }

  @Query(() => [PageAdmin])
  async myPages(@Args("adminId") adminId: string): Promise<PageAdmin[]> {
    return await PageAdmin.find({ where: { adminId } });
  }

  @ResolveField(() => Page)
  async page(@Parent() pageAdmin: PageAdmin): Promise<Page> {
    return await Page.findOne({where: {id: pageAdmin.pageId}})
  }

  @Subscription(() => PageAdmin)
  pageAdminCreated() {
    return pubSub.asyncIterator('pageAdminCreated');
  }

  @Subscription(() => PageAdmin)
  pageAdminDeleted() {
    return pubSub.asyncIterator('pageAdminDeleted');
  }


}
