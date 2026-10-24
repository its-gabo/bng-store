import { createParamDecorator } from '@nestjs/common';

import type {
  AuthenticatedRequest,
  AuthUserSession,
} from '../types/auth.types';
import type { ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUserSession => {
    const { authSession } = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    if (!authSession) {
      throw new Error('CurrentUser requires SessionAuthGuard on the route');
    }

    return authSession;
  },
);
