import { Resolver, Mutation, Args, ResolveField, Parent, Query, Subscription } from '@nestjs/graphql';
import { Friend, User, RelationshipStatus } from '@contact/entity/index';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(Friend)
export class FriendResolver {

  @Query(() => [Friend])
  async myFriends(@Args("friendId") friendsId: string): Promise<Friend[]> {
    return await Friend.find({ where: { friendsId}});
  }

  @Mutation(() => Friend, {nullable: true})
  async addFriend(@Args("user1") user1: string, @Args("user2") user2: string): Promise<Friend | null> {
    const friendExist = await Friend.findOne({ where: [{ friendingId: user1, friendsId: user2 }, { friendingId: user2, friendsId: user1 }] });
    if (friendExist) return;
    const friend = Friend.create()
    friend.friendsId = user1;
    friend.friendingId = user2;
    await friend.save()
    if (friend) pubSub.publish('friendCreated', { friendCreated: friend });
  }

  @ResolveField(() => [User])
  async friends(@Parent() friend: Friend): Promise<User[]> {
    return await User.find({where: {id: friend.friendsId}})
  }

  @ResolveField(() => [User])
  async friending(@Parent() friend: Friend): Promise<User[]> {
    return await User.find({ where: { id: friend.friendingId } })
  }

  @Mutation(() => Friend)
  async blockFriend(@Args("user1") user1: string, @Args("user2") user2: string): Promise<Friend> {
    const query = Friend.createQueryBuilder().update(Friend).set({ relationshipStatus: RelationshipStatus.BLOCKED, blockedBy: user1 });
    query.where("friendingId = :user1 AND friendsId = :user2", { user1, user2 })
    query.orWhere("friendingId = :user2 AND friendsId = :user1", { user1, user2 }).execute()
    const pubUpdated = await Friend.findOne({ where: [{ friendingId: user1, friendsId: user2 }, { friendingId: user2, friendsId: user1 }] });
    if (pubUpdated) pubSub.publish('pubUpdated', { friendUpdated: pubUpdated });
    return pubUpdated;
  }

  @Mutation(() => Friend)
  async unblockFriend(@Args("user1") user1: string, @Args("user2") user2: string): Promise<Friend> {
    const blockedByMe = await Friend.findOne({ where: [{ friendsId: user1, friendingId: user2 }, { friendsId: user2, friendingId: user1 }] });
    if ( blockedByMe.blockedBy !== user1) throw new Error("You can't unblock this relationship since it was not blocked by You")
    const query = Friend.createQueryBuilder().update(Friend).set({ relationshipStatus: RelationshipStatus.ACTIVE, blockedBy: null });
    query.where("friendingId = :user1 AND friendsId = :user2", { user1, user2 })
    query.orWhere("friendingId = :user2 AND friendsId = :user1", { user1, user2 }).execute()
    const pubUpdated = await Friend.findOne({ where: [{ friendingId: user1, friendsId: user2 }, { friendingId: user2, friendsId: user1 }] });
    if (pubUpdated) pubSub.publish('pubUpdated', { friendUpdated: pubUpdated });
    return pubUpdated;
  }

  @Subscription(() => Friend)
  friendCreated() {
    return pubSub.asyncIterator('friendCreated');
  }

  @Subscription(() => Friend)
  friendUpdated() {
    return pubSub.asyncIterator('friendUpdated');
  }

}
