import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { typeOrmConfig } from '../../../../config/typeorm.config';
import { UserModule } from './client/user/user.module';
import { ProfileModule } from './client/profile/profile.module';
import { PostModule } from './client/post/post.module';
import { CommentModule } from './client/comment/comment.module';
import { LikeModule } from './client/like/like.module';
import { FileModule } from './client/file/file.module';
import { FriendResolver } from './client/friend/friend.resolver';
import { MessageResolver } from './client/message/message.resolver';
import { GroupResolver } from './client/group/group.resolver';
import { GroupMenberResolver } from './client/group-member/group-menber.resolver';
import { PageResolver } from './client/page/page.resolver';
import { FollowerResolver } from './client/follower/follower.resolver';
import { PageAdminResolver } from './client/page-admin/page-admin.resolver';
import { AdminResolver } from './admin/admin/admin.resolver';
import { AdminProfileResolver } from './admin/admin-profile/admin-profile.resolver';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: "MUTATION",
      signOptions: {
        expiresIn: 3600
      }
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playground: true,
      installSubscriptionHandlers: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    ProfileModule,
    PostModule,
    CommentModule,
    LikeModule,
    FileModule
  ],
  providers: [AppService, FriendResolver, MessageResolver, GroupResolver,
    GroupMenberResolver, PageResolver, FollowerResolver, PageAdminResolver, AdminResolver, AdminProfileResolver],
})
export class AppModule {}
