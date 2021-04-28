import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Admin } from '@contact/entity/index';
import { CreateAdminInput, LoginUserInput, UpdateAdminInput } from '@contact/dto/index';
import { userValidate } from '@contact/validation/index';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Resolver(Admin)
export class AdminResolver {

  @Mutation(() => Admin)
  async createAdmin(@Args("data") data: CreateAdminInput): Promise<Admin> {
    data.salt = await bcrypt.genSalt();
    data.password = await userValidate(data.phoneNumber, data.password, data.email, data.salt)

    return await Admin.create({ ...data }).save().catch((err) => {
      if (err.code === '23505') {
        throw new ConflictException(`Admin with ${data.email} / ${data.phoneNumber} already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    });
  }

  @Mutation(() => Admin)
  async updateAdmin(@Args("data") data: UpdateAdminInput, @Args("adminId") adminId: string): Promise<Admin> {
    const adminExist = await Admin.findOne({ where: { id: adminId } })
    if (!adminExist) throw new NotFoundException("You are not an admin")
    const updatedAdmin = await Admin.update({ id: adminId }, { ...data });
    if (updatedAdmin.affected === 0) throw new Error("An error occured while updating your data")
    return await Admin.findOne({ where: { id: adminId } });
  }

  @Mutation(() => Admin)
  async loginAdmin(@Args("data") data: LoginUserInput): Promise<Admin> {
    const result = await Admin.findOne({
      where: [
        { email: data.id },
        { phoneNumber: data.id }
      ]
    })
    if (!result) throw new NotFoundException("You are not a registered user")
    const isMatch = await bcrypt.compare(data.password, result.password);
    if (!isMatch) throw new NotFoundException("You are not a registered user")
    return result
  }

}
