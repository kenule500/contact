import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AdminProfile, Admin } from '@contact/entity/index';
import { CreateAdminProfileInput, UpdateAdminProfileInput } from '@contact/dto/index';
import { NotFoundException, ConflictException } from '@nestjs/common';

@Resolver(AdminProfile)
export class AdminProfileResolver {

  @Query(() => AdminProfile)
  async adminProfile(@Args("adminId") adminId: string): Promise<AdminProfile> {
    return await AdminProfile.findOne({ where: { adminId } });
  }

  @Mutation(() => AdminProfile)
  async createAdminProfile(@Args("adminId") adminId: string, @Args("data") data: CreateAdminProfileInput): Promise<AdminProfile> {
    const adminExist = await Admin.findOne({ where: { id: adminId } });
    if (!adminExist) throw new NotFoundException("You are not an admin")
    const profile = AdminProfile.create({ ...data })
    profile.adminId = adminId;
    try {
      return await profile.save();

    } catch (error) {
      if (error.code === "23505") throw new ConflictException("Profile already exist")
    }
  }

  @Mutation(() => AdminProfile)
  async updateAdminProfile(@Args("adminId") adminId: string, @Args("data") data: UpdateAdminProfileInput): Promise<AdminProfile> {
    const updatedProfile = await AdminProfile.update({ id: adminId }, { ...data });
    if (updatedProfile.affected === 0) throw new Error("Error occured while updating / no profile created yet")
    return await AdminProfile.findOne({ where: { adminId } });
  }
}
