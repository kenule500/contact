import { Resolver, Query, Args, Mutation, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { Like, User } from '@contact/entity/index';
import { CreateLikeInput } from '@contact/dto/index';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Like)
export class LikeResolver {

  @Query(() => [Like])
  async likes(@Args("postId", { nullable: true }) postId: string, @Args("messageId", { nullable: true }) messageId: string,
    @Args("commentId", { nullable: true }) commentId: string): Promise<Like[]> {
    return await Like.find({where:[{postId}, {commentId}, {messageId}]});
  }

  @Mutation(() => Like)
  async createLike(@Args("data") data: CreateLikeInput): Promise<Like> {
    const likeExist = await Like.findOne({ where: { postId: data.postId, authorId: data.authorId } });
    if (likeExist) throw new ConflictException('You already liked this post');
    const createdLike = await Like.create({ ...data }).save();
    pubSub.publish('likeCreated', { likeCreated: createdLike });
    return createdLike;
  }

  @Mutation(() => String)
  async unLike(@Args('likeId') likeId: string, @Args('authorId') authorId: string): Promise<string> {
    const likeExist = await Like.findOne({ where: { id: likeId, authorId } });
    if (!likeExist) throw new NotFoundException('Like not found');
    const deletedLike = await Like.delete({ id: likeId, authorId });
    if (deletedLike.affected > 0) pubSub.publish('likeDeleted', { likeDeleted: likeExist });
    return `Post unliked`;
  }

  @ResolveField(() => User)
  async author(@Parent() like: Like): Promise<User> {
    return User.findOne({where: {id: like.authorId}})
  }

  @Subscription(() => Like)
  likeCreated() {
    return pubSub.asyncIterator('likeCreated');
  }

  @Subscription(() => Like)
  likeDeleted() {
    return pubSub.asyncIterator('likeDeleted');
  }
}
