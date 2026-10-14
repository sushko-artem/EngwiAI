import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { GoogleGuard } from './google.guard';

export const GUARDS = [JwtAuthGuard, RolesGuard, GoogleGuard];
