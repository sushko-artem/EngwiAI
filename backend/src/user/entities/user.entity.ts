import { Role, User } from '@generated/prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  name: string;

  id: string;
  email: string;

  @Exclude()
  password: string;

  roles: Role[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
