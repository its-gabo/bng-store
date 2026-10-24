import type { AuthUserSession } from '../types/auth.types';
import type { AuthSessionData, AuthUserDto } from './auth.dto.types';

export const toAuthUserDto = (session: AuthUserSession): AuthUserDto => ({
  id: session.userId,
  email: session.email,
  name: session.name,
  emailVerified: session.emailVerified,
});

export const toAuthSessionDto = (
  session: AuthUserSession | null,
): AuthSessionData => {
  if (!session) return { authenticated: false };

  return { authenticated: true, user: toAuthUserDto(session) };
};
