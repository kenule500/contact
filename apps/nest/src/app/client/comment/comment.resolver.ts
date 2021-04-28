import { Resolver, Mutation, Args, Query, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { Comment, File, User } from '@contact/entity/index';
import { CreateCommentInput, CreateFileInput, UpdateCommentInput } from '@contact/dto/index';
import { NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(Comment)
export class CommentResolver {

  @Query(() => [Comment])
  async comments(): Promise<Comment[]> {
    return await Comment.find({relations: ["post", "likes"]});
  }

  @Query(() => Comment)
  async comment(@Args("id") id: string, @Args("authorId") authorId: string): Promise<Comment> {
    const comment = await Comment.findOne({ where: { id, authorId } });
    if (!comment) throw new NotFoundException(`Comment with ID - ${id} not found`);
    return comment;
  }

  @Mutation(() => Comment)
  async createComment(@Args("authorId") authorId: string, @Args("postId") postId: string,
    @Args("comment", { nullable: true }) commentInput: CreateCommentInput,
    @Args("files", { nullable: true }) filesInput: CreateFileInput): Promise<Comment> {
    const comment = Comment.create({ ...commentInput });
    comment.authorId = authorId;
    comment.postId = postId;
    await comment.save();

    if (filesInput) {
      const file = File.create({ ...filesInput })
      file.commentId = comment.id
      file.comment = comment
      await file.save();
    }
    if (comment) pubSub.publish('commentCreated', { commentCreated: comment });
    return comment;
  }

  @Mutation(() => Comment)
  async updateComment(@Args("id") id: string, @Args("authorId") authorId: string, @Args("data") data: UpdateCommentInput): Promise<Comment> {
    const comment = await Comment.update({ id, authorId }, { ...data })
    if (comment.affected === 0) throw new NotFoundException("Comment not found/Error while updating")
    const pubUpdated = await Comment.findOne({ where: { id, authorId } });
    if (comment.affected > 0) pubSub.publish('commentUpdated', { commentUpdated: pubUpdated });
    return pubUpdated;
  }

  @Mutation(() => String)
  async deleteComment(@Args("id") id: string, @Args("authorId") authorId: string): Promise<string> {
    const pubDeleted = await Comment.findOne({ where: { id, authorId } });
    const comment = await Comment.delete({ id, authorId });
    if (comment.affected === 0) throw new NotFoundException(`comment with ID - ${id} not found/Error in deleting a comment`);
    if (comment.affected > 0) pubSub.publish('commentDeleted', { commentDeleted: pubDeleted });
    return `comment deleted successfully`;
  }

  @ResolveField(() => [File])
  async files(@Parent() comment: Comment): Promise<File[]> {
    return await File.find({where: {commentId: comment.id}})
  }

  @ResolveField(() => User)
  async author(@Parent() comment: Comment): Promise<User> {
    return await User.findOne({where: {id: comment.authorId}})
  }

  @Subscription(() => Comment)
  commentCreated() {
    return pubSub.asyncIterator('commentCreated');
  }

  @Subscription(() => Comment)
  commentUpdated() {
    return pubSub.asyncIterator('commentUpdated');
  }

  @Subscription(() => Comment)
  commentDeleted() {
    return pubSub.asyncIterator('commentDeleted');
  }

}
