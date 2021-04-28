import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import { User, Comment, Post, Profile, Like, File, Friend, Message, Discussion, Group, GroupMember, Page, Follower, PageAdmin, Admin, AdminProfile } from '../libs/entity/src/entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'starboy50',
  database: 'contact',
  logging: true,
  // entities: [__dirname + '../libs/entity/src/entity/clientEntities/*.entity{.ts,.js}'],
  entities: [User, Comment, Post, Profile, Like, File, Friend, Message, Discussion,
              Group, GroupMember, Page, Follower, PageAdmin, Admin, AdminProfile],
  synchronize: true,
  migrations: ['../migration/**/*.ts'],
  subscribers: ['../subscriber/**/*.ts'],
};
