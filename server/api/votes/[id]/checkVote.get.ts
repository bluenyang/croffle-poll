import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const voteId = Number(event.context.params?.id);

  return await db.transaction(async (tx) => {
    const session = await getUserSession(event);
    if (!session.user) throw createError({ statusCode: 401 });
    const user = session.user as {
      id: number;
      email: string;
      name: string;
      role: 'ADMIN' | 'MEMBER';
    };
    const userId = user.id;

    const existingVotes = await tx
      .select()
      .from(voteResponses)
      .where(and(eq(voteResponses.voteId, voteId), eq(voteResponses.userId, userId)));

    return { hasVoted: existingVotes.length > 0 };
  });
});
