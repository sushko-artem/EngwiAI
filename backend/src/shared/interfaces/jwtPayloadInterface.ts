import { Role } from '@generated/prisma/client';

export interface IjwtPayload {
  id: string;
  email: string;
  roles: Role[];
}
