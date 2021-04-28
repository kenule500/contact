import { userValidate } from '@contact/validation/index';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User, Profile, Friend } from '@contact/entity/index';
import { CreateUserInput, LoginUserInput, UpdateAdminInput } from '@contact/dto/index';
import { Resolver, Args, Mutation, Query, ResolveField, Parent} from '@nestjs/graphql';
import { UserService } from './user.service';


@Resolver(() => User)
export class UserResolver {

  constructor(private userService: UserService) { }

  @Query(() => User)
  async user(@Args("id") id: string): Promise<User> {
    return await this.userService.getUser(id);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find({ relations: ["posts", "comments", "likes", "profile"]})
  }

  @Mutation(() => User)
  async createUser(@Args("data") data: CreateUserInput): Promise<User> {
    data.salt = await bcrypt.genSalt();
    data.password = await userValidate(data.phoneNumber, data.password, data.email, data.salt);

    return await User.create({ ...data }).save().catch((err) => {
      if (err.code === '23505') {
        throw new ConflictException(`user with ${data.email} / ${data.phoneNumber} already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    });
  }

  @Mutation(() => User)
  async login(@Args("data") data: LoginUserInput): Promise<User> {
    const result = await User.findOne({
      where: [
        { email: data.id },
        {phoneNumber: data.id}
      ]
    })
    if (!result) throw new NotFoundException("You are not a registered user");
    const isMatch = await bcrypt.compare(data.password, result.password);
    if (!isMatch) throw new NotFoundException("You are not a registered user");
    return result
  }

  @Mutation(() => User)
  async updateAdmin(@Args("data") data: UpdateAdminInput, @Args("userId") userId: string): Promise<User> {
    const adminExist = await User.findOne({ where: { id: userId } });
    if (!adminExist) throw new NotFoundException("You are not an User");
    const updatedAdmin = await User.update({ id: userId }, { ...data });
    if (updatedAdmin.affected === 0) throw new Error("An error occured while updating your data");
    return await User.findOne({ where: { id: userId } });
  }

  @Mutation(() => User)
  async deleteUser(@Args("id") id: string): Promise<void> {
    const re = await User.delete({ id });
    if (re.affected === 0) {
      throw new NotFoundException('User with ID "' + id + '" not found');
    }
  }

  @ResolveField(() => Profile)
  async profile(@Parent() user: User): Promise<Profile> {
    return await Profile.findOne({ where: { userId: user.id } });
  }

  @ResolveField(() => [Friend])
  async friends(@Parent() user: User): Promise<Friend[]> {
    return await Friend.find({ where: { authorId: user.id } });
  }


}
