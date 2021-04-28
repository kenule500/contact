import { Resolver, Mutation, Args, ResolveField, Parent, Query, Subscription } from '@nestjs/graphql';
import { CreatePostInput, CreateFileInput, UpdatePostInput } from '@contact/dto/index';
import { Post, File, User, Page, Follower, Comment, Like, PageAdmin, AdminType } from '@contact/entity/index';
import { UserService } from '../user/user.service';
import { NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';


const pubSub = new PubSub();

@Resolver(() => Post)
export class PostResolver {
  constructor(private userService: UserService) { }

  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await Post.find({
     order: {updatedAt: "DESC"}
    });
  }

  // @Query(() => [Post])
  // async myPagesPost(@Args("userId") userId: string) {
  //   const follow = await Follower.find({ where: { followerId: userId } });
  // }


  @Mutation(() => Post)
  async createPost(
    @Args('pageId') pageId: string, @Args('authorId') authorId: string,
    @Args('files', {nullable: true}) fileInput: CreateFileInput,
    @Args('post') postInput: CreatePostInput
  ): Promise<Post> {
    const isAdmin = await PageAdmin.findOne({
      where: [{ pageId, adminId: authorId, adminType: AdminType.ADMIN },
        { pageId, adminId: authorId, adminType: AdminType.CHIEFADMIN }]
    });
    if (!isAdmin) throw new NotFoundException("You can't create a post because you are not an admin of this page")
    const post = Post.create({ ...postInput });
    post.pageId = pageId;
    post.authorId = authorId
    await post.save().catch((err) => {
      console.log(err.errors.message)
      throw new Error(err.errors.message);
    });
    await Follower.update({ pageId }, { postUpdate: post.updatedAt });
    let file;
    if (fileInput) {
      file = File.create({ ...fileInput });
      file.postId = post.id;
      file.post = post;
      await file.save().catch((err) => {
        console.log(err);
        throw new Error(err.message);
      });
    }
    post.files = file
    if (post.published === true) pubSub.publish('postAdded', { postAdded: post });
    return post;
  }

  // @Mutation(() => Boolean)
  // async createFile(
  //   @Args('userId') userId: string,
  //   @Args("files", GraphQLUpload) {createReadStream, filename}: Upload): Promise<boolean> {
  //   return new Promise( (resolve, reject) =>
  //     createReadStream()
  //       .pipe(createWriteStream(__dirname + `/../../${filename}`))
  //       .on("finish", () => resolve(true))
  //       .on("error", () => reject(false))
  //   )

  // }

  @Mutation(() => Post)
  async updatePost(@Args("postId") id: string, @Args("authorId") authorId: string,
    @Args("data") data: UpdatePostInput): Promise<Post> {
    const newpost = await Post.update({ id, authorId }, { ...data })
    if (newpost.affected === 0) throw new NotFoundException("Post not found/Error while updating")
    const updatePost = await Post.findOne({ where: { id, authorId } })

    if (updatePost.published === true) pubSub.publish('postUpdated', { postUpdated: updatePost });
    await Follower.update({ pageId: updatePost.pageId }, { postUpdate: updatePost.updatedAt });
    return updatePost;
  }

  @Mutation(() => String)
  async deletePost(@Args("postId") id: string, @Args("authorId") authorId: string): Promise<string> {
    const deletePost = await Post.findOne({ where: {id, authorId} });
    const result = await Post.delete({ id, authorId });
    if (result.affected === 0) throw new NotFoundException("Post not found to delete");

    if (deletePost.published === true) pubSub.publish('postUpdated', { postUpdated: deletePost });
    return `Post with ID - ${id} deleted successfully`;
  }

  @ResolveField(() => User)
  async author(@Parent() post: Post): Promise<User> {
    return await this.userService.getUser(post.authorId);
  }

  @ResolveField(() => [File])
  async files(@Parent() post: Post): Promise<File[]> {
    return File.find({where: {postId: post.id}})
  }

  @ResolveField(() => Page)
  async page(@Parent() post: Post): Promise<Page> {
    return Page.findOne({where: {id: post.pageId}})
  }

  @ResolveField(() => [Comment])
  async comments(@Parent() post: Post): Promise<Comment[]> {
    return await Comment.find({ where: { postId: post.id } });
  }

  @ResolveField(() => [Like])
  async likes(@Parent() post: Post): Promise<Like[]> {
    return await Like.find({ where: { postId: post.id } });
  }

  @Subscription(() => Post)
  postAdded() {
    return pubSub.asyncIterator('postAdded');
  }

  @Subscription(() => Post)
  postUpdated() {
    return pubSub.asyncIterator('postUpdated');
  }

  @Subscription(() => Post)
  postDeleted() {
    return pubSub.asyncIterator('postDeleted');
  }
}
