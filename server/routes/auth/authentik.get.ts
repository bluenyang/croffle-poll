import { eq } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';

import { db } from '~~/server/utils/db';
import { users } from '~~/server/utils/schema';

export default defineOAuthAuthentikEventHandler({
  config: {
    // Configuration is automatically read from NUXT_OAUTH_AUTHENTIK_* env vars
  },
  async onSuccess(event, { user }) {
    // `user` is the user object from Authentik profile
    const email = user.email;
    const nickname = user.name || user.preferred_username || email.split('@')[0];
    const groups = user.groups || []; 
    
    // Check if user should be an admin
    const config = useRuntimeConfig(event);
    const adminGroup = config.authentikAdminGroup;
    const isAdmin = adminGroup && groups.includes(adminGroup);
    const role = isAdmin ? 'ADMIN' : 'MEMBER';

    let [dbUser] = await db.select().from(users).where(eq(users.email, email));

    if (!dbUser) {
      // Auto register
      [dbUser] = await db.insert(users).values({
        id: uuidv7(),
        email,
        nickname,
        role,
      }).returning();
    } else {
      // Update role if changed based on Authentik groups
      if (dbUser.role !== role) {
        [dbUser] = await db.update(users)
          .set({ role, updatedAt: new Date() })
          .where(eq(users.id, dbUser.id))
          .returning();
      }
    }

    await setUserSession(event, {
      user: {
        id: dbUser!.id,
        email: dbUser!.email,
        nickname: dbUser!.nickname,
        role: dbUser!.role,
      },
    });

    return sendRedirect(event, '/');
  },
  onError(event, error) {
    console.error('Authentik OAuth error:', error);
    return sendRedirect(event, '/login?error=oauth_failed');
  },
});
