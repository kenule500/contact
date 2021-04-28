import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { CreateProfileInput, UpdateProfileInput } from '@contact/dto/index';
import { Profile } from '@contact/entity/index';
import { NotFoundException } from '@nestjs/common';

import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();
@Resolver()
export class ProfileResolver {

  @Mutation(() => Profile)
  async createProfile(@Args("userId") userId: string, @Args("data") data: CreateProfileInput): Promise<Profile> {
    const profile = Profile.create({ ...data });
    profile.userId = userId
    await profile.save().catch((err) => { throw new Error(err) })
    pubSub.publish('profileCreated', { profileCreated: profile });
    return profile;
  }

  @Query(() => Profile)
  async myProfile(@Args("userId") userId: string): Promise<Profile> {
    return await Profile.findOne({ where: { userId} });
  }

  @Mutation(() => Profile)
  async updateProfile(@Args("id") id: string, @Args("userId") userId: string,
    @Args("data") data: UpdateProfileInput): Promise<Profile> {

    const profile = await Profile.update({id, userId}, {...data});
    if (profile.affected === 0) throw new NotFoundException(`error while updating`);
    if (profile) pubSub.publish('profileUpdated', { profileUpdated: profile });
    return await Profile.findOne({where: {id}})
  }

  @Subscription(() => Profile)
  profileCreated() {
    return pubSub.asyncIterator('profileCreated');
  }

  @Subscription(() => Profile)
  profiledUpdated() {
    return pubSub.asyncIterator('profileUpdated');
  }
}
