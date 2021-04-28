import { Injectable } from '@nestjs/common';
import { Post } from '@contact/entity/index';

@Injectable()
export class PostService {

  // constructor() { }

  async getAllPost(userId: string): Promise<Post[]> {
    const post =  Post.find({ where: { authorId: userId } })
    console.log(post)
    return post
  }
}
