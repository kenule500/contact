import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PostService } from '../post/post.service';

@Module({
  imports: [
  ],
  providers: [UserResolver, UserService, PostService]
})
export class UserModule {}
