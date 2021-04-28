import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { UserService } from '../user/user.service';
import { PostService } from './post.service';

@Module({
  imports: [
  ],
  providers: [PostResolver, UserService, PostService]
})
export class PostModule {}
