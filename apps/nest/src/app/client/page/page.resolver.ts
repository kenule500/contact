import { Resolver, Mutation, Args, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { Post, Page, Follower, PageAdmin, AdminType } from '@contact/entity/index';
import { CreatePageInput, UpdatePageInput } from '@contact/dto/index';
import { ConflictException, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';

import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();
@Resolver(Page)
export class PageResolver {

  @Mutation(() => Page)
  async createPage(@Args("data") data: CreatePageInput, @Args("userId") userId: string): Promise<Page> {
    try {
      const page = await Page.create({ ...data }).save();

      const follow = Follower.create({})
      follow.pageId = page.id;
      follow.followerId = userId;
      follow.save();

      const pageAdmin = PageAdmin.create();
      pageAdmin.pageId = page.id;
      pageAdmin.adminType = AdminType.CHIEFADMIN;
      pageAdmin.adminId = userId;
      await pageAdmin.save();
      pubSub.publish('pageCreated', { pageCreated: page });
      return page;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Page with ${data.name} already exists`)
      } else throw new InternalServerErrorException();
    }
  }

  @Mutation(() => Page)
  async updatePage(@Args("pageId") pageId: string, @Args("userId") userId: string, @Args("data") data: UpdatePageInput): Promise<Page> {
    const isChiefAdmin = await PageAdmin.findOne({ where: { pageId, adminId: userId, adminType: "CHIEF-ADMIN" } });
    console.log(isChiefAdmin)
    if (!isChiefAdmin) throw new UnauthorizedException("You are not authorised to edit this page");
    const updatedPage = await Page.update({ id: pageId }, { ...data });
    if (updatedPage.affected === 0) throw new NotFoundException(" Page not found/ Error while updating the page");
    if (updatedPage.affected > 0) pubSub.publish('pageCreated', { pageUpdated: updatedPage });
    return Page.findOne({ where: { id: pageId } });
  }

  @Mutation(() => String)
  async deletePage(@Args("pageId") pageId: string, @Args("authorId") userId: string): Promise<string> {
    const isChiefAdmin = await PageAdmin.findOne({ where: { pageId, adminId: userId, adminType: "CHIEF-ADMIN" } });
    if (!isChiefAdmin) throw new UnauthorizedException("You are not authorised to delete this page");
    const deletePage = await Page.findOne({ id: pageId });
    const deletedPage = await Page.delete({ id: pageId })
    if (deletedPage.affected === 0) throw new NotFoundException("Page not found/Error while deleting a Page");
    if (deletedPage.affected > 0) pubSub.publish('pageDeleted', { pageDeleted: deletePage });
    return `Page successfully deleted`;
  }

  @ResolveField(() => [Post])
  async posts(@Parent() page: Page): Promise<Post[]> {
    return Post.find({ where: { pageId: page.id }, order: {updatedAt: -1} });
  }

  @ResolveField(() => [Follower])
  async followers(@Parent() page: Page): Promise<Follower[]> {
    return Follower.find({ where: { pageId: page.id } });
  }

  @ResolveField(() => [PageAdmin])
  async pageAdmins(@Parent() page: Page): Promise<PageAdmin[]> {
    return PageAdmin.find({ where: { pageId: page.id } });
  }

  @Subscription(() => Page)
  pageCreated() {
    return pubSub.asyncIterator('pageCreated');
  }

  @Subscription(() => Page)
  pageUpdated() {
    return pubSub.asyncIterator('pageUpdated');
  }

  @Subscription(() => Page)
  pageDeleted() {
    return pubSub.asyncIterator('pageDeleted');
  }
}
