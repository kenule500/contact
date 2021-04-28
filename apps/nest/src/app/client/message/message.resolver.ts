import { Resolver, Mutation, Args, ResolveField, Parent, Query, Subscription } from '@nestjs/graphql';
import { Message, Discussion, User, Like } from '@contact/entity/index';
import { CreateMessageInput, UpdateMessageInput } from '@contact/dto/index';
import { NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';


const pubSub = new PubSub();

@Resolver(Message)
export class MessageResolver {

  @Query(() => [Message])
  async groupMessages(@Args("groupId") groupId: string): Promise<Message[]> {
    return await Message.find({ where: { groupId } });
  }

  @Mutation(() => Message)
  async createGroupMessage(@Args("data") data: CreateMessageInput): Promise<Message> {
    return await Message.create({ ...data }).save();
  }

  @Mutation(() => Message)
  async createMessage(@Args("data") data: CreateMessageInput, @Args("author1Id") author1Id: string,
    @Args("author2Id") author2Id: string): Promise<Message> {
    const oldDiscussion = await Discussion.findOne({ where: [{ author1Id, author2Id }, { author1Id: author2Id, author2Id: author1Id }] })
    let message;
    if (oldDiscussion) {
      data.discussionId = oldDiscussion.id
      message = await Message.create({ ...data }).save();
    } else {
      const discussion = new Discussion();
      discussion.author1Id = author1Id;
      discussion.author2Id = author2Id;
      const newDiscussion = await Discussion.create({ ...discussion }).save();

      message = Message.create({ ...data })
      message.discussionId = newDiscussion.id;
      await message.save();
      pubSub.publish('messageCreated', {messageCreated: message})
    }
    return message
  }

  @Mutation(() => Message)
  async updateMessage(@Args("messageId") messageId: string, @Args("authorId") authorId: string,
    @Args("data") data: UpdateMessageInput): Promise<Message> {
    const updatedMessage = await Message.update({ id: messageId, authorId }, { ...data })
    if(updatedMessage.affected === 0) throw new NotFoundException("Message not found/Error while updating")
    const newMessage = await Message.findOne({ where: { id: messageId, authorId } });
    if (updatedMessage.affected > 0) pubSub.publish('messageUpdated', { messageUpdated: newMessage });
    return newMessage;
  }

  @Mutation(() => String)
  async deleteMessage(@Args("messageId") messageId: string, @Args("authorId") authorId: string): Promise<string> {
    const pubDeleted = await Message.findOne({ where: { id: messageId}})
    const deletedMessage = await Message.delete({ id: messageId, authorId })
    if (deletedMessage.affected === 0) throw new NotFoundException("Message not found/Error while deleting a message")
    if (deletedMessage.affected > 0) pubSub.publish('messageDeleted', { messageDeleted: pubDeleted });
    return `Message deleted successfully`;
  }

  @ResolveField(() => User)
  async author(@Parent() message: Message): Promise<User> {
    return await User.findOne({where: {id: message.authorId}})
  }

  @ResolveField(() => Discussion)
  async discussion(@Parent() message: Message): Promise<Discussion> {
    return await Discussion.findOne({ where: { id: message.discussionId } })
  }

  @ResolveField(() => [Like])
  async likes(@Parent() message: Message): Promise<Like[]> {
    return await Like.find({where: {messageId: message.id}})
  }

  @Subscription(() => Message)
  messageCreated() {
    return pubSub.asyncIterator('messageCreated');
  }

  @Subscription(() => Message)
  messageUpdated() {
    return pubSub.asyncIterator('messageUpdated');
  }

  @Subscription(() => Message)
  messageDeleted() {
    return pubSub.asyncIterator('messageDeleted');
  }
}
