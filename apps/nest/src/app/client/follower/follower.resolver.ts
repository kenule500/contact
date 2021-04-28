import { Resolver, Mutation, Args, ResolveField, Parent, Query, Subscription } from '@nestjs/graphql';
import { Follower, User, Page, Post } from '@contact/entity/index';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();
@Resolver(Follower)
export class FollowerResolver {
  private post = new BehaviorSubject<Post[]>([]);

  @Query(() => [Follower])
  async newsFeed(@Args("userId") userId: string): Promise<Follower[]> {
    const follower = await Follower.find({ where: { followerId: userId }, order: { postUpdate: "DESC" } });
    await follower.forEach((e) => this.post.next(e.page.posts))
    console.log(this.post)
    return follower;
  };
  // async newsFeed(@Args("userId") userId: string): Promise<Post[]> {
  //   return await Post.createQueryBuilder("post")
  //     // .select("post.page")
  //     .where("post.page.followers.followerId = :userId", { userId })
  //     .getMany()
  // }

  @Mutation(() => Follower)
  async followPage(@Args("pageId") pageId: string, @Args("authorId") authorId: string): Promise<Follower> {
    const followerExist = await Follower.findOne({ where: { pageId, followerId: authorId } });
    if (followerExist) throw new ConflictException(" You are following this page already");
    const follower = new Follower();
    follower.pageId = pageId;
    follower.followerId = authorId;
    await follower.save();
    if (follower) pubSub.publish('followerCreated', { followerCreated: follower })
    return follower;
  }

  @Mutation(() => String)
  async unFollowPage(@Args("PageId") pageId: string, @Args("authorId") authorId: string): Promise<string> {
    const pubDeleted = await Follower.findOne({ where: { pageId, followerId: authorId } });
    const unfollowedPage = await Follower.delete({ pageId, followerId: authorId });
    if (unfollowedPage.affected === 0) throw new NotFoundException("Page not found/Error while unfollowing Page");
    if (unfollowedPage.affected > 0) pubSub.publish('followerCreated', { followerCreated: pubDeleted });
    return `You have successfully unfollowed this page`;
  }

  @ResolveField(() => User)
  async follower(@Parent() follower: Follower): Promise<User> {
    return await User.findOne({ where: { id: follower.followerId } });
  }

  @ResolveField(() => Page)
  async page(@Parent() follower: Follower): Promise<Page> {
    return await Page.findOne({ where: { id: follower.pageId } });
  }

  @Subscription(() => Follower)
  followerCreated() {
    return pubSub.asyncIterator('followerCreated');
  }

  @Subscription(() => Follower)
  followerDeleted() {
    return pubSub.asyncIterator('followerDeleted');
  }
}
