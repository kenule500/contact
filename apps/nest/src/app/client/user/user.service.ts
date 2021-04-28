import { Injectable } from '@nestjs/common';
import { User } from '@contact/entity/index';

@Injectable()
export class UserService {


  async getUser(id: string): Promise<User> {
    return User.findOne({
      where: { id },
      relations: ["posts", "comments", "likes", "profile" ]
    })
  }
}
